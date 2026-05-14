"use client";

import { useState, useTransition } from "react";
import { changeListingTier } from "../actions";
import { useToast } from "@/components/Toast";

type Tier = "urgent" | "premium" | "normal" | "free";

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: "urgent", label: "긴급" },
  { value: "premium", label: "프리미엄" },
  { value: "normal", label: "일반" },
  { value: "free", label: "무료" },
];

const TIER_COLOR: Record<Tier, string> = {
  urgent: "bg-urgent text-white border-urgent",
  premium: "bg-premium text-white border-premium",
  normal: "bg-normal text-white border-normal",
  free: "bg-free text-white border-free",
};

export function TierSelect({ id, tier }: { id: number; tier: Tier }) {
  const [current, setCurrent] = useState<Tier>(tier);
  const [pending, start] = useTransition();
  const toast = useToast();

  function onChange(next: Tier) {
    if (next === current) return;
    const prev = current;
    setCurrent(next);
    start(async () => {
      try {
        await changeListingTier(id, next);
        toast.success(`#${id} 등급을 ${TIER_OPTIONS.find((o) => o.value === next)?.label}(으)로 변경`);
      } catch (e) {
        setCurrent(prev);
        toast.error(e instanceof Error ? e.message : "변경 실패");
      }
    });
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value as Tier)}
      disabled={pending}
      aria-label="광고 등급 변경"
      className={`text-[10px] font-bold rounded border px-2 py-[3px] cursor-pointer disabled:opacity-50 ${TIER_COLOR[current]}`}
      style={{
        backgroundImage: "none",
        paddingRight: "1.5rem",
      }}
    >
      {TIER_OPTIONS.map((o) => (
        <option key={o.value} value={o.value} className="text-foreground bg-white">
          {o.label}
        </option>
      ))}
    </select>
  );
}
