"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";

const TIER_LABEL: Record<string, string> = {
  urgent: "긴급",
  premium: "프리미엄",
  normal: "일반",
  free: "무료",
};

function fmtMoney(v: string): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  if (n === 0) return "0";
  if (n >= 10000 && n % 10000 === 0) return `${n / 10000}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}억`;
  return `${n.toLocaleString()}만`;
}

type Chip = { keys: string[]; label: string };

function buildChips(sp: URLSearchParams): Chip[] {
  const chips: Chip[] = [];
  const sido = sp.get("sido");
  const sigungu = sp.get("sigungu");
  if (sido && sigungu) chips.push({ keys: ["sido", "sigungu"], label: `${sido} ${sigungu}` });
  else if (sido) chips.push({ keys: ["sido"], label: sido });

  const cat = sp.get("category");
  if (cat) chips.push({ keys: ["category"], label: cat });

  const tier = sp.get("tier");
  if (tier && TIER_LABEL[tier]) chips.push({ keys: ["tier"], label: `${TIER_LABEL[tier]}매물` });

  const q = sp.get("q");
  if (q) chips.push({ keys: ["q"], label: `"${q}"` });

  // 보증금
  const dMin = sp.get("depositMin");
  const dMax = sp.get("depositMax");
  if (dMin || dMax) {
    chips.push({
      keys: ["depositMin", "depositMax"],
      label: rangeLabel("보증금", dMin, dMax),
    });
  }

  // 월세
  const rMin = sp.get("rentMin");
  const rMax = sp.get("rentMax");
  if (rMin || rMax) {
    chips.push({
      keys: ["rentMin", "rentMax"],
      label: rangeLabel("월세", rMin, rMax),
    });
  }

  // 권리금
  const pMin = sp.get("premiumMin");
  const pMax = sp.get("premiumMax");
  if (pMin || pMax) {
    if (pMin === "0" && pMax === "0") {
      chips.push({ keys: ["premiumMin", "premiumMax"], label: "권리금 없음" });
    } else {
      chips.push({
        keys: ["premiumMin", "premiumMax"],
        label: rangeLabel("권리금", pMin, pMax),
      });
    }
  }

  return chips;
}

function rangeLabel(prefix: string, min: string | null, max: string | null): string {
  if (min && max) return `${prefix} ${fmtMoney(min)}~${fmtMoney(max)}`;
  if (min) return `${prefix} ${fmtMoney(min)}+`;
  if (max) return `${prefix} ${fmtMoney(max)} 이하`;
  return prefix;
}

export function ActiveFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const chips = buildChips(sp);

  if (chips.length === 0) return null;

  function removeKeys(keys: string[]) {
    const next = new URLSearchParams(sp.toString());
    keys.forEach((k) => next.delete(k));
    next.delete("page");
    router.push(`/listings${next.toString() ? `?${next.toString()}` : ""}`);
  }

  function clearAll() {
    router.push("/listings");
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      <span className="text-[11px] text-muted mr-1">적용된 조건</span>
      {chips.map((c) => (
        <button
          key={c.keys.join(",")}
          type="button"
          onClick={() => removeKeys(c.keys)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-foreground text-white rounded-full hover:bg-foreground-soft transition-colors"
        >
          {c.label}
          <Icon.X size={11} strokeWidth={2.4} />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-[11px] text-muted hover:text-foreground underline underline-offset-2 ml-1"
        >
          전체 해제
        </button>
      )}
    </div>
  );
}
