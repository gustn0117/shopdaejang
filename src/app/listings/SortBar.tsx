"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "default", label: "기본 (광고순)" },
  { value: "newest", label: "최신순" },
  { value: "views", label: "조회순" },
  { value: "deposit-low", label: "보증금 낮은순" },
  { value: "rent-low", label: "월세 낮은순" },
  { value: "premium-low", label: "권리금 낮은순" },
];

export function SortBar({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "default") next.delete("sort");
    else next.set("sort", value);
    router.push(`/listings?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] text-muted">정렬</label>
      <select
        value={currentSort || "default"}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-border rounded px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:border-foreground cursor-pointer"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "12px",
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
