"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<Tier | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();

  // 서버 prop이 우선이지만, 진행 중 optimistic 값으로 즉시 표시
  const current = optimistic ?? tier;

  function onChange(next: Tier) {
    if (next === current) return;
    setOptimistic(next);
    start(async () => {
      try {
        await changeListingTier(id, next);
        const label = TIER_OPTIONS.find((o) => o.value === next)?.label;
        toast.success(`#${id} 등급을 ${label}(으)로 변경`);
        router.refresh();
        // refresh 후 prop이 next 로 갱신되면 optimistic 무시되며 자연스럽게 동기화
        setOptimistic(null);
      } catch (e) {
        setOptimistic(null);
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
      className={`text-[10px] font-bold rounded border px-2 py-0.75 cursor-pointer disabled:opacity-50 ${TIER_COLOR[current]}`}
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
