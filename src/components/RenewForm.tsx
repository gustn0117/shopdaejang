"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdPricing, AdTier } from "@/lib/types";
import { Icon } from "./Icon";
import { TierBadge } from "./TierBadge";
import { Thumbnail } from "./Thumbnail";
import { renewListing } from "@/app/mypage/listings/actions";
import { useToast } from "./Toast";

type RenewListing = {
  id: number;
  title: string;
  tier: AdTier;
  status: string;
  region: string;
  category: string;
  area: number;
  deposit: number;
  monthlyRent: number;
  premium: number;
  thumbnail: string;
  createdAt: string;
  expiresAt: string | null;
};

const TIER_DESC: Record<
  AdTier,
  { headline: string; position: string; bullets: string[] }
> = {
  urgent: {
    headline: "긴급 급매물 - 상단노출",
    position: "메인 페이지 최상단 큰 썸네일 노출",
    bullets: [
      "메인 / 검색 결과 최상단 노출",
      "큰 썸네일 + 제목 강조",
      "1시간마다 자동 점프 우선순위",
      "긴급 라벨 표시",
    ],
  },
  premium: {
    headline: "프리미엄 매물 - 중단노출",
    position: "메인 중단 사진 카드형 노출",
    bullets: [
      "메인 중단 사진 카드 노출",
      "1시간마다 자동 점프",
      "프리미엄 라벨 표시",
      "찜한 매물 알림 발송",
    ],
  },
  normal: {
    headline: "일반 매물 - 하단노출",
    position: "메인 하단 텍스트 제목 노출",
    bullets: [
      "메인 하단 노출",
      "1시간마다 자동 점프",
      "지역별 모음 자동 노출",
    ],
  },
  free: {
    headline: "무료 매물 - 최하단 노출",
    position: "메인 최하단 텍스트 노출",
    bullets: ["광고비 없음 · 10일간 노출", "최하단 텍스트 노출", "기간 후 자동 만료"],
  },
};

function periodToMonths(period: string) {
  if (period === "팔릴 때까지") return 12;
  if (period === "10일") return 10 / 30;
  const m = period.match(/(\d+)/);
  return m ? Number(m[1]) : 1;
}

export function RenewForm({
  listing,
  adPricing,
}: {
  listing: RenewListing;
  adPricing: AdPricing[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [device, setDevice] = useState<"pc" | "mobile">("pc");
  const [tier, setTier] = useState<AdTier>(listing.tier);
  const [period, setPeriod] = useState<string>("");
  const [pending, start] = useTransition();

  const selectedTier = adPricing.find((p) => p.tier === tier);
  const selectedPrice = selectedTier?.prices.find((p) => p.period === period);

  function onSubmit() {
    if (!period) {
      toast.error("광고 기간을 선택해주세요.");
      return;
    }
    start(async () => {
      const months = periodToMonths(period);
      const result = await renewListing(listing.id, { tier, period, months });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        selectedPrice && selectedPrice.price === 0
          ? "무료 연장이 완료되었습니다."
          : "결제 후 광고가 연장되었습니다."
      );
      router.push("/mypage/listings");
      router.refresh();
    });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-4 lg:gap-6">
      {/* LEFT: Preview */}
      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setDevice("pc")}
            className={`flex-1 py-3 text-sm font-bold ${
              device === "pc"
                ? "bg-foreground text-white"
                : "bg-zinc-50 text-muted hover:text-foreground"
            }`}
          >
            PC 광고
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex-1 py-3 text-sm font-bold ${
              device === "mobile"
                ? "bg-foreground text-white"
                : "bg-zinc-50 text-muted hover:text-foreground"
            }`}
          >
            모바일 광고
          </button>
        </div>
        <div className="p-4 lg:p-6 bg-zinc-100">
          <p className="text-[11px] text-muted mb-2 text-center">
            아래 미리보기는 선택한 광고 상품 노출 위치 예시입니다
          </p>
          {device === "pc" ? (
            <PcPreview listing={listing} tier={tier} />
          ) : (
            <MobilePreview listing={listing} tier={tier} />
          )}
        </div>
      </div>

      {/* RIGHT: Options */}
      <aside className="space-y-3">
        <div className="bg-white rounded-md border border-border p-4">
          <h2 className="text-sm font-bold mb-2">광고 매물</h2>
          <div className="flex gap-2 items-center p-2 border border-border rounded">
            <div className="relative w-12 h-12 shrink-0 rounded bg-zinc-100 overflow-hidden">
              {listing.thumbnail && (
                <Thumbnail src={listing.thumbnail} alt={listing.title} fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted mb-0.5">#{listing.id}</p>
              <p className="font-bold text-xs line-clamp-1">{listing.title}</p>
              <p className="text-[11px] text-muted line-clamp-1">
                {listing.region} · {listing.category}
              </p>
            </div>
          </div>
          {listing.expiresAt && (
            <p className="text-[11px] text-muted mt-2">
              현재 만료일 ·{" "}
              <span className="text-foreground font-semibold tabular">
                {new Date(listing.expiresAt).toLocaleDateString("ko-KR")}
              </span>
            </p>
          )}
        </div>

        {adPricing.map((p) => {
          const isSelected = tier === p.tier;
          const desc = TIER_DESC[p.tier];
          return (
            <div
              key={p.tier}
              className={`bg-white rounded-md border ${
                isSelected ? "border-foreground ring-1 ring-foreground" : "border-border"
              } p-4`}
            >
              <button
                type="button"
                onClick={() => {
                  setTier(p.tier);
                  setPeriod("");
                }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TierBadge tier={p.tier} size="xs" />
                  <span className="text-[11px] font-bold text-foreground/80">
                    {desc.position.includes("최상단")
                      ? "상단노출"
                      : desc.position.includes("중단")
                      ? "중단노출"
                      : desc.position.includes("하단") && p.tier !== "free"
                      ? "하단노출"
                      : "최하단노출"}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1">{desc.headline}</h3>
                <ul className="text-[11px] text-muted space-y-0.5 mb-3 leading-relaxed">
                  {desc.bullets.map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
              </button>

              {isSelected && (
                <div>
                  <label className="block text-[11px] font-bold text-muted mb-1">
                    광고기간
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded bg-white focus:outline-none focus:border-foreground cursor-pointer"
                  >
                    <option value="">선택해주세요</option>
                    {p.prices.map((pr) => (
                      <option key={pr.period} value={pr.period}>
                        {p.label} / {pr.period} /{" "}
                        {pr.price === 0 ? "무료" : `${pr.price.toLocaleString()}원`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}

        <div className="bg-foreground text-white rounded-md p-4 sticky bottom-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/80">결제 금액</span>
            <span className="text-xl font-black tabular">
              {selectedPrice
                ? selectedPrice.price === 0
                  ? "무료"
                  : `${selectedPrice.price.toLocaleString()}원`
                : "-"}
            </span>
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={pending || !period}
            className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-white text-foreground font-black rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              "처리 중..."
            ) : selectedPrice && selectedPrice.price === 0 ? (
              <>
                <Icon.Check size={14} strokeWidth={2.5} />
                무료 재연장
              </>
            ) : (
              <>
                <Icon.Check size={14} strokeWidth={2.5} />
                결제하고 연장
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

function PcPreview({ listing, tier }: { listing: RenewListing; tier: AdTier }) {
  return (
    <div className="bg-white border border-border rounded-md p-3 space-y-3 text-foreground">
      <div className="flex items-center gap-2 px-1">
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-foreground text-white">
          샵대장
        </span>
        <span className="text-[10px] text-muted">메인 페이지</span>
      </div>

      <Section title="상단노출 · 긴급 급매물" highlight={tier === "urgent"}>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded overflow-hidden ${
                i === 0 && tier === "urgent" ? "ring-2 ring-foreground" : ""
              }`}
            >
              <div className="relative aspect-4/3 bg-zinc-200">
                {i === 0 && tier === "urgent" && listing.thumbnail && (
                  <Thumbnail src={listing.thumbnail} alt="" fill className="object-cover" />
                )}
                <span className="absolute top-0.5 left-0.5 px-1 py-px text-[7px] font-bold rounded bg-urgent text-white">
                  긴급
                </span>
              </div>
              <div className="p-1 bg-white">
                <div
                  className={`text-[8px] line-clamp-1 ${
                    i === 0 && tier === "urgent" ? "font-bold" : "text-muted"
                  }`}
                >
                  {i === 0 && tier === "urgent" ? listing.title : "매물 제목"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="중단노출 · 프리미엄" highlight={tier === "premium"}>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex gap-1.5 p-1.5 bg-white border border-border rounded ${
                i === 0 && tier === "premium" ? "ring-2 ring-foreground" : ""
              }`}
            >
              <div className="relative w-10 h-10 shrink-0 rounded bg-zinc-200 overflow-hidden">
                {i === 0 && tier === "premium" && listing.thumbnail && (
                  <Thumbnail src={listing.thumbnail} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[8px] line-clamp-1 ${
                    i === 0 && tier === "premium" ? "font-bold" : "text-muted"
                  }`}
                >
                  {i === 0 && tier === "premium" ? listing.title : "매물 제목"}
                </p>
                <p className="text-[7px] text-muted">{listing.region}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="하단노출 · 일반" highlight={tier === "normal"}>
        <div className="space-y-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-1.5 py-1 text-[8px] bg-white ${
                i === 0 && tier === "normal" ? "ring-2 ring-foreground rounded" : ""
              }`}
            >
              <span className="px-1 py-px text-[7px] font-bold rounded bg-normal text-white">일반</span>
              <span className={`flex-1 line-clamp-1 ${i === 0 && tier === "normal" ? "font-bold" : "text-muted"}`}>
                {i === 0 && tier === "normal" ? listing.title : "일반 매물 제목"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="최하단 · 무료" highlight={tier === "free"}>
        <div className="space-y-0.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-1.5 py-0.5 text-[8px] bg-white ${
                i === 0 && tier === "free" ? "ring-2 ring-foreground rounded" : ""
              }`}
            >
              <span className="px-1 py-px text-[7px] font-bold rounded bg-free text-white">무료</span>
              <span className={`flex-1 line-clamp-1 ${i === 0 && tier === "free" ? "font-bold" : "text-muted"}`}>
                {i === 0 && tier === "free" ? listing.title : "무료 매물 제목"}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function MobilePreview({ listing, tier }: { listing: RenewListing; tier: AdTier }) {
  return (
    <div className="max-w-[260px] mx-auto bg-white border border-border rounded-2xl p-2.5 space-y-2.5 text-foreground">
      <div className="flex items-center gap-1.5 px-1 pb-1 border-b border-border">
        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-foreground text-white">
          샵대장
        </span>
        <span className="text-[9px] text-muted">모바일</span>
      </div>

      <Section title="상단노출 · 긴급" highlight={tier === "urgent"}>
        <div className="grid grid-cols-2 gap-1">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`rounded overflow-hidden ${
                i === 0 && tier === "urgent" ? "ring-2 ring-foreground" : ""
              }`}
            >
              <div className="relative aspect-4/3 bg-zinc-200">
                {i === 0 && tier === "urgent" && listing.thumbnail && (
                  <Thumbnail src={listing.thumbnail} alt="" fill className="object-cover" />
                )}
                <span className="absolute top-0.5 left-0.5 px-1 py-px text-[7px] font-bold rounded bg-urgent text-white">
                  긴급
                </span>
              </div>
              <div className="p-1 bg-white">
                <p
                  className={`text-[8px] line-clamp-1 ${
                    i === 0 && tier === "urgent" ? "font-bold" : "text-muted"
                  }`}
                >
                  {i === 0 && tier === "urgent" ? listing.title : "긴급 매물"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="중단노출 · 프리미엄" highlight={tier === "premium"}>
        <div className="space-y-1">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex gap-1.5 p-1.5 bg-white border border-border rounded ${
                i === 0 && tier === "premium" ? "ring-2 ring-foreground" : ""
              }`}
            >
              <div className="relative w-9 h-9 shrink-0 rounded bg-zinc-200 overflow-hidden">
                {i === 0 && tier === "premium" && listing.thumbnail && (
                  <Thumbnail src={listing.thumbnail} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[8px] line-clamp-1 ${
                    i === 0 && tier === "premium" ? "font-bold" : "text-muted"
                  }`}
                >
                  {i === 0 && tier === "premium" ? listing.title : "프리미엄 매물"}
                </p>
                <p className="text-[7px] text-muted line-clamp-1">{listing.region}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="하단 · 일반" highlight={tier === "normal"}>
        <div className="space-y-0.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-1 py-1 text-[8px] bg-white ${
                i === 0 && tier === "normal" ? "ring-2 ring-foreground rounded" : ""
              }`}
            >
              <span className="px-1 py-px text-[7px] font-bold rounded bg-normal text-white">일반</span>
              <span className={`flex-1 line-clamp-1 ${i === 0 && tier === "normal" ? "font-bold" : "text-muted"}`}>
                {i === 0 && tier === "normal" ? listing.title : "일반 매물 제목"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="최하단 · 무료" highlight={tier === "free"}>
        <div className="space-y-0.5">
          {[0].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-1 py-1 text-[8px] bg-white ${
                tier === "free" ? "ring-2 ring-foreground rounded" : ""
              }`}
            >
              <span className="px-1 py-px text-[7px] font-bold rounded bg-free text-white">무료</span>
              <span className={`flex-1 line-clamp-1 ${tier === "free" ? "font-bold" : "text-muted"}`}>
                {tier === "free" ? listing.title : "무료 매물"}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  highlight,
  children,
}: {
  title: string;
  highlight: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${highlight ? "" : "opacity-50"} transition-opacity`}>
      <p className="text-[9px] font-bold text-foreground/70 mb-1 px-1">{title}</p>
      {children}
    </div>
  );
}
