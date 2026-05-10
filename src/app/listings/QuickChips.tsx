"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const POPULAR_SIDOS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주"];
const TIERS = [
  { value: "urgent", label: "긴급" },
  { value: "premium", label: "프리미엄" },
  { value: "normal", label: "일반" },
  { value: "free", label: "무료" },
];

export function QuickChips({
  currentTier,
  currentSido,
}: {
  currentTier?: string;
  currentSido?: string;
}) {
  const sp = useSearchParams();

  function buildHref(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(sp.toString());
    next.delete("page");
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, v);
    });
    const qs = next.toString();
    return `/listings${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-muted mr-1">빠른 필터</span>
      <Link
        href={buildHref({ tier: undefined })}
        className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
          !currentTier
            ? "bg-foreground text-white border-foreground"
            : "border-border text-muted hover:border-foreground"
        }`}
      >
        전체
      </Link>
      {TIERS.map((t) => (
        <Link
          key={t.value}
          href={buildHref({ tier: currentTier === t.value ? undefined : t.value })}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
            currentTier === t.value
              ? "bg-foreground text-white border-foreground"
              : "border-border text-muted hover:border-foreground"
          }`}
        >
          {t.label}
        </Link>
      ))}
      <span className="w-px h-4 bg-border mx-1" />
      {POPULAR_SIDOS.map((sido) => (
        <Link
          key={sido}
          href={buildHref({ sido: currentSido === sido ? undefined : sido, sigungu: undefined })}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
            currentSido === sido
              ? "bg-foreground text-white border-foreground"
              : "border-border text-muted hover:border-foreground"
          }`}
        >
          {sido}
        </Link>
      ))}
    </div>
  );
}
