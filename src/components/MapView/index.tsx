"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { Listing } from "@/lib/types";
import { Icon } from "@/components/Icon";

const ListingsMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
      <div className="text-sm text-muted inline-flex items-center gap-2">
        <Icon.Map size={14} />
        지도를 불러오는 중...
      </div>
    </div>
  ),
});

const FILTERS: { v: Listing["tier"] | "all"; l: string }[] = [
  { v: "all", l: "전체" },
  { v: "urgent", l: "긴급" },
  { v: "premium", l: "프리미엄" },
  { v: "normal", l: "일반" },
  { v: "free", l: "무료" },
];

export function MapView({ listings }: { listings: Listing[] }) {
  const [filter, setFilter] = useState<Listing["tier"] | "all">("all");

  const counts: Record<string, number> = {};
  for (const l of listings) {
    if (filter !== "all" && l.tier !== filter) continue;
    counts[l.sido] = (counts[l.sido] ?? 0) + 1;
  }
  const sortedSidos = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-3 h-[78vh] lg:h-[78vh]">
      <div className="relative surface-card overflow-hidden">
        <ListingsMap listings={listings} filter={filter} />

        <div className="absolute top-3 left-3 z-[1000] flex gap-1 surface-card p-1 shadow-sm">
          {FILTERS.map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => setFilter(t.v)}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded ${
                filter === t.v ? "bg-foreground text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <aside className="surface-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-white">
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-1">
            Map
          </p>
          <h3 className="font-bold text-sm tracking-tight">지역별 매물 현황</h3>
          <p className="text-[12px] text-muted mt-1 tabular">
            현재 필터 매물 <strong className="text-foreground">{totalCount.toLocaleString()}</strong>건
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedSidos.length === 0 && (
            <div className="p-8 text-center text-[13px] text-muted">
              해당 조건의 매물이 없습니다.
            </div>
          )}
          <ul className="divide-y divide-border">
            {sortedSidos.map(([sido, c]) => (
              <li key={sido}>
                <Link
                  href={`/listings?sido=${encodeURIComponent(sido)}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-primary-soft transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{sido}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted tabular">
                    {c}건
                    <Icon.ChevronRight size={11} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-3 border-t border-border text-[11px] text-muted bg-zinc-50">
          마커를 클릭하면 해당 지역 매물을 확인할 수 있습니다.
        </div>
      </aside>
    </div>
  );
}
