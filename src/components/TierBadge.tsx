import type { AdTier } from "@/lib/types";

const TIER_LABELS: Record<AdTier, string> = {
  urgent: "긴급",
  premium: "프리미엄",
  normal: "일반",
  free: "무료",
};

const TIER_CLASSES: Record<AdTier, string> = {
  urgent: "badge-urgent",
  premium: "badge-premium",
  normal: "badge-normal",
  free: "badge-free",
};

export function TierBadge({ tier, size = "sm" }: { tier: AdTier; size?: "xs" | "sm" | "md" }) {
  const sizeClass =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5"
      : size === "md"
      ? "text-xs px-2.5 py-1"
      : "text-[11px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center font-bold rounded ${sizeClass} ${TIER_CLASSES[tier]}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
