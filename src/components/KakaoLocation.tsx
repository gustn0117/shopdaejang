"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Icon } from "./Icon";

// OSM fallback (when Kakao key is not configured)
const MiniMapInner = dynamic(() => import("./MapView/MiniMapInner"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted bg-zinc-50">
      <span className="inline-flex items-center gap-1.5">
        <Icon.Map size={14} />
        지도 불러오는 중
      </span>
    </div>
  ),
});

type KakaoNS = {
  maps: {
    load: (cb: () => void) => void;
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (el: HTMLElement, opts: { center: unknown; level: number }) => {
      relayout: () => void;
      setCenter: (pos: unknown) => void;
    };
    Marker: new (opts: { position: unknown; map: unknown }) => unknown;
    Roadview: new (el: HTMLElement) => {
      setPanoId: (panoId: number, position: unknown) => void;
      relayout: () => void;
    };
    RoadviewClient: new () => {
      getNearestPanoId: (
        position: unknown,
        radius: number,
        cb: (panoId: number | null) => void
      ) => void;
    };
    services: {
      Geocoder: new () => {
        addressSearch: (
          q: string,
          cb: (
            result: Array<{ x: string; y: string }>,
            status: string
          ) => void
        ) => void;
      };
      Status: { OK: string };
    };
  };
};

declare global {
  interface Window {
    kakao?: KakaoNS;
  }
}

let kakaoLoadingPromise: Promise<void> | null = null;
function loadKakaoSdk(key: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.kakao?.maps) return Promise.resolve();
  if (kakaoLoadingPromise) return kakaoLoadingPromise;
  kakaoLoadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
    s.async = true;
    s.onload = () => {
      window.kakao?.maps.load(() => resolve());
    };
    s.onerror = () => reject(new Error("Kakao SDK 로드 실패"));
    document.head.appendChild(s);
  });
  return kakaoLoadingPromise;
}

export function KakaoLocation({
  sido,
  sigungu,
  dong,
  detailAddress,
}: {
  sido: string;
  sigungu: string;
  dong?: string;
  detailAddress?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const rvRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<{ relayout: () => void; setCenter: (p: unknown) => void } | null>(null);
  const rvInstance = useRef<{ relayout: () => void } | null>(null);
  const [tab, setTab] = useState<"map" | "roadview">("map");
  const [hasRoadview, setHasRoadview] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState(false);
  const KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  // 키 유무와 무관하게 항상 동작하는 외부 로드뷰 링크 (카카오맵)
  const fullAddress = [sido, sigungu, dong, detailAddress].filter(Boolean).join(" ");
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(fullAddress)}`;

  useEffect(() => {
    if (!KEY) return;
    if (!mapRef.current || !rvRef.current) return;

    let cancelled = false;
    loadKakaoSdk(KEY)
      .then(() => {
        if (cancelled || !window.kakao) return;
        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const query = [sido, sigungu, dong, detailAddress].filter(Boolean).join(" ");

        geocoder.addressSearch(query, (result, status) => {
          if (status !== kakao.maps.services.Status.OK || !result.length) {
            // 한 단계 줄여서 재시도
            geocoder.addressSearch(`${sido} ${sigungu}`, (r2, s2) => {
              if (s2 !== kakao.maps.services.Status.OK || !r2.length) {
                setHasRoadview(false);
                return;
              }
              renderAt(Number(r2[0].y), Number(r2[0].x));
            });
            return;
          }
          renderAt(Number(result[0].y), Number(result[0].x));
        });

        function renderAt(lat: number, lng: number) {
          if (cancelled || !mapRef.current || !rvRef.current) return;
          const coords = new kakao.maps.LatLng(lat, lng);
          const map = new kakao.maps.Map(mapRef.current, { center: coords, level: 3 });
          new kakao.maps.Marker({ position: coords, map });
          mapInstance.current = map;

          const rv = new kakao.maps.Roadview(rvRef.current);
          rvInstance.current = rv;
          const rvClient = new kakao.maps.RoadviewClient();
          rvClient.getNearestPanoId(coords, 100, (panoId) => {
            if (cancelled) return;
            if (panoId) {
              rv.setPanoId(panoId, coords);
              setHasRoadview(true);
            } else {
              setHasRoadview(false);
            }
          });
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [KEY, sido, sigungu, dong, detailAddress]);

  // 탭 전환 시 카카오 위젯 relayout (숨겨졌다 보일 때 크기 보정)
  useEffect(() => {
    const t = setTimeout(() => {
      if (tab === "map") mapInstance.current?.relayout();
      else rvInstance.current?.relayout();
    }, 60);
    return () => clearTimeout(t);
  }, [tab]);

  // Kakao 키 없을 때 → OSM 지도 + 외부 로드뷰 링크
  if (!KEY || loadError) {
    return (
      <div className="space-y-2">
        <div className="relative h-72 lg:h-96 bg-zinc-100 rounded overflow-hidden border border-border">
          <MiniMapInner sido={sido} sigungu={sigungu} dong={dong} />
        </div>
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-3 bg-foreground text-white text-sm font-bold rounded hover:bg-foreground/90"
        >
          <Icon.MapPin size={14} strokeWidth={2.4} />
          카카오맵에서 로드뷰 보기
          <Icon.ArrowRight size={12} strokeWidth={2.4} />
        </a>
        <p className="text-[11px] text-muted leading-relaxed">
          표시된 위치는 등록 시 입력한 주소를 기반으로 보여지며 정확한 위치와 차이가 있을 수 있습니다.
          로드뷰는 카카오맵 새 창에서 확인됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-md border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setTab("map")}
          className={`inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold transition-colors ${
            tab === "map" ? "bg-foreground text-white" : "bg-white text-muted hover:text-foreground"
          }`}
        >
          <Icon.Map size={12} strokeWidth={2.2} />
          지도
        </button>
        <button
          type="button"
          onClick={() => setTab("roadview")}
          className={`inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold border-l border-border transition-colors ${
            tab === "roadview" ? "bg-foreground text-white" : "bg-white text-muted hover:text-foreground"
          }`}
        >
          <Icon.MapPin size={12} strokeWidth={2.2} />
          로드뷰
          {hasRoadview === false && (
            <span className="text-[9px] font-medium opacity-70">미제공</span>
          )}
        </button>
      </div>

      <div className="relative h-72 lg:h-110 bg-zinc-100 rounded overflow-hidden border border-border">
        {/* 지도 레이어 */}
        <div
          ref={mapRef}
          className={`absolute inset-0 transition-opacity ${
            tab === "map" ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"
          }`}
        />
        {/* 로드뷰 레이어 */}
        <div
          ref={rvRef}
          className={`absolute inset-0 transition-opacity ${
            tab === "roadview" ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"
          }`}
        />

        {/* 로드뷰 미제공 안내 */}
        {tab === "roadview" && hasRoadview === false && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-zinc-50 text-center px-4">
            <Icon.MapPin size={26} className="text-muted" />
            <p className="text-[13px] font-semibold">근처 로드뷰를 바로 불러오지 못했습니다</p>
            <p className="text-[11px] text-muted mb-1">카카오맵에서 로드뷰를 확인할 수 있습니다.</p>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-white text-xs font-bold rounded hover:bg-foreground/90"
            >
              <Icon.MapPin size={12} strokeWidth={2.4} />
              카카오맵에서 로드뷰 보기
              <Icon.ArrowRight size={11} strokeWidth={2.4} />
            </a>
          </div>
        )}

        {/* 로딩 */}
        {tab === "roadview" && hasRoadview === null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center text-[12px] text-muted bg-zinc-50">
            로드뷰 불러오는 중…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted leading-relaxed">
          표시된 위치는 등록 시 입력한 주소를 기반으로 보여지며 정확한 위치와 차이가 있을 수 있습니다.
        </p>
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-foreground hover:underline"
        >
          카카오맵 크게 보기
          <Icon.ArrowRight size={10} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}
