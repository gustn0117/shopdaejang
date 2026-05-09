"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Listing } from "@/lib/types";
import { TierBadge } from "./TierBadge";
import { Icon } from "./Icon";

const SIDO_COORDS: Record<string, [number, number]> = {
  서울: [55, 32],
  경기: [50, 30],
  인천: [42, 32],
  강원: [70, 22],
  충북: [60, 45],
  충남: [45, 48],
  대전: [55, 50],
  세종: [55, 45],
  전북: [50, 65],
  전남: [45, 78],
  광주: [42, 75],
  경북: [72, 45],
  대구: [68, 55],
  울산: [80, 60],
  부산: [78, 70],
  경남: [65, 70],
  제주: [40, 92],
};

export function MapView({ listings }: { listings: Listing[] }) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const grouped = useMemo(() => {
    const filtered =
      filter === "all"
        ? listings
        : listings.filter((l) => l.tier === filter);
    return filtered;
  }, [listings, filter]);

  const counts: Record<string, number> = {};
  grouped.forEach((l) => {
    counts[l.sido] = (counts[l.sido] ?? 0) + 1;
  });

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-3 h-[80vh] lg:h-[78vh]">
      <div className="relative bg-white rounded-md border border-border overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect width="100" height="100" fill="#fafafa" />
          <path
            d="M 38,18 Q 44,12 50,15 Q 58,12 60,20 Q 65,18 68,25 L 75,30 L 72,40 Q 80,42 78,52 L 82,58 Q 78,66 80,70 L 76,76 Q 70,80 64,78 L 56,82 Q 48,80 42,75 L 38,70 Q 34,62 38,55 L 36,48 Q 38,40 36,32 Z"
            fill="#ffffff"
            stroke="#d4d4d4"
            strokeWidth="0.4"
          />
          <circle cx="40" cy="92" r="4" fill="#ffffff" stroke="#d4d4d4" strokeWidth="0.3" />
        </svg>

        {Object.entries(SIDO_COORDS).map(([sido, [x, y]]) => {
          const sidoListings = grouped.filter((l) => l.sido === sido);
          if (sidoListings.length === 0) return null;
          return (
            <div
              key={sido}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            >
              <button
                type="button"
                onClick={() => setSelected(sidoListings[0])}
                className="relative group"
              >
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-foreground text-white font-bold text-xs lg:text-sm flex flex-col items-center justify-center hover:scale-105 transition-transform">
                  <span className="leading-none">{sido}</span>
                  <span className="text-[10px] lg:text-xs leading-none mt-0.5">
                    {sidoListings.length}
                  </span>
                </div>
              </button>
            </div>
          );
        })}

        <div className="absolute top-3 left-3 bg-white rounded border border-border p-1 flex gap-1">
          {[
            { v: "all", l: "전체" },
            { v: "urgent", l: "긴급" },
            { v: "premium", l: "프리미엄" },
            { v: "normal", l: "일반" },
            { v: "free", l: "무료" },
          ].map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => setFilter(t.v)}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                filter === t.v ? "bg-foreground text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white border border-border rounded p-2 text-[11px] text-muted">
          <Icon.Map size={12} />
          데모 지도 · 실제 서비스에는 카카오/네이버 지도 연동
        </div>
      </div>

      <aside className="bg-white rounded-md border border-border overflow-hidden flex flex-col">
        <div className="p-3 border-b border-border bg-zinc-50">
          <h3 className="font-bold text-sm">지역별 매물 현황</h3>
          <p className="text-xs text-muted">
            지도의 마커를 클릭하면 매물 정보가 표시됩니다
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <div className="p-3 animate-fade-up">
              <div className="flex items-center gap-1 mb-1">
                <TierBadge tier={selected.tier} size="xs" />
                <span className="text-[11px] text-muted">{selected.region}</span>
              </div>
              <h4 className="font-bold text-sm mb-2">{selected.title}</h4>
              <p className="text-xs text-muted mb-2">{selected.description}</p>
              <div className="grid grid-cols-3 gap-1 text-center text-[11px] mb-3 bg-zinc-50 p-2 rounded border border-border">
                <div><div className="text-muted">보증금</div><div className="font-bold">{selected.deposit.toLocaleString()}만</div></div>
                <div><div className="text-muted">월세</div><div className="font-bold">{selected.monthlyRent.toLocaleString()}만</div></div>
                <div><div className="text-muted">권리금</div><div className="font-bold">{selected.premium.toLocaleString()}만</div></div>
              </div>
              <Link
                href={`/listings/${selected.id}`}
                className="block w-full py-2 text-center bg-foreground text-white text-sm font-bold rounded"
              >
                자세히 보기
              </Link>
              <hr className="my-3 border-border" />
            </div>
          ) : null}

          <div className="p-3 space-y-2">
            <h4 className="text-xs font-bold text-muted">전체 지역 통계</h4>
            {Object.entries(counts)
              .sort((a, b) => b[1] - a[1])
              .map(([sido, c]) => (
                <Link
                  key={sido}
                  href={`/listings?sido=${encodeURIComponent(sido)}`}
                  className="flex items-center justify-between px-3 py-2 bg-zinc-50 rounded hover:bg-zinc-100 text-sm"
                >
                  <span className="font-semibold">{sido}</span>
                  <span className="inline-flex items-center gap-1 text-muted text-xs">
                    매물 {c}건 <Icon.ChevronRight size={11} />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
