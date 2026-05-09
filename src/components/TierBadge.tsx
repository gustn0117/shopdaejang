import type { AdTier } from "@/lib/types";

const TIER_LABELS: Record<AdTier, string> = {
  urgent: "긴급",
  premium: "프리미엄",
  normal: "일반",
  free: "무료",
};

const TIER_CLASSES: Record<AdTier, string> = {
  urgent: "border-urgent text-urgent",
  premium: "border-premium text-premium",
  normal: "border-normal text-normal",
  free: "border-free text-free",
};

export function TierBadge({ tier, size = "sm" }: { tier: AdTier; size?: "xs" | "sm" | "md" }) {
  const sizeClass =
    size === "xs"
      ? "text-[10px] px-1.5 py-0"
      : size === "md"
      ? "text-xs px-2.5 py-0.5"
      : "text-[11px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center font-bold rounded border bg-white ${sizeClass} ${TIER_CLASSES[tier]}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
