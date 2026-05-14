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
    Map: new (el: HTMLElement, opts: { center: unknown; level: number }) => unknown;
    Marker: new (opts: { position: unknown; map: unknown }) => unknown;
    Roadview: new (el: HTMLElement) => {
      setPanoId: (panoId: number, position: unknown) => void;
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
  const [hasRoadview, setHasRoadview] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState(false);
  const KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

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

          const rv = new kakao.maps.Roadview(rvRef.current);
          const rvClient = new kakao.maps.RoadviewClient();
          rvClient.getNearestPanoId(coords, 50, (panoId) => {
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

  // Kakao 키 없을 때 → OSM 폴백
  if (!KEY || loadError) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden border border-border min-h-72 lg:min-h-96">
          <MiniMapInner sido={sido} sigungu={sigungu} dong={dong} />
        </div>
        <p className="text-[11px] text-muted leading-relaxed">
          표시된 위치는 등록 시 입력한 주소를 기반으로 보여지며 정확한 위치와 차이가 있을 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid lg:grid-cols-2 gap-2">
        <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden border border-border">
          <div ref={mapRef} className="absolute inset-0" />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-border rounded text-[10px] font-bold text-foreground">
            <Icon.Map size={10} />
            지도
          </div>
        </div>
        <div className="relative aspect-video bg-zinc-100 rounded overflow-hidden border border-border">
          <div ref={rvRef} className="absolute inset-0" />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-border rounded text-[10px] font-bold text-foreground z-10">
            로드뷰
          </div>
          {hasRoadview === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-[12px] text-muted text-center px-4">
              이 위치 주변에는<br />로드뷰가 제공되지 않습니다.
            </div>
          )}
          {hasRoadview === null && (
            <div className="absolute inset-0 flex items-center justify-center text-[12px] text-muted">
              로드뷰 불러오는 중…
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-muted leading-relaxed">
        표시된 위치는 등록 시 입력한 주소를 기반으로 보여지며 정확한 위치와 차이가 있을 수 있습니다.
      </p>
    </div>
  );
}
