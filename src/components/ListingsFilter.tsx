"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ShopCategory } from "@/lib/types";
import { Icon } from "./Icon";

const TIER_OPTIONS = [
  { value: "", label: "전체" },
  { value: "urgent", label: "긴급" },
  { value: "premium", label: "프리미엄" },
  { value: "normal", label: "일반" },
  { value: "free", label: "무료" },
];

// 0~20000만 (2억)
const MONEY_OPTIONS = Array.from({ length: 21 }, (_, i) => i * 1000);
function moneyLabel(v: number) {
  if (v === 0) return "0";
  if (v >= 10000) return `${v / 10000}억`;
  return `${v.toLocaleString()}만`;
}

export function ListingsFilter({
  regions,
  categories,
  initial,
}: {
  regions: Record<string, string[]>;
  categories: ShopCategory[];
  initial: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [sido, setSido] = useState(initial.sido ?? "");
  const [sigungu, setSigungu] = useState(initial.sigungu ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [tier, setTier] = useState(initial.tier ?? "");
  const [q, setQ] = useState(initial.q ?? "");
  const [depositMin, setDepositMin] = useState(initial.depositMin ?? "");
  const [depositMax, setDepositMax] = useState(initial.depositMax ?? "");
  const [rentMin, setRentMin] = useState(initial.rentMin ?? "");
  const [rentMax, setRentMax] = useState(initial.rentMax ?? "");
  const [premiumMin, setPremiumMin] = useState(initial.premiumMin ?? "");
  const [premiumMax, setPremiumMax] = useState(initial.premiumMax ?? "");
  const [sort, setSort] = useState(initial.sort ?? "default");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sigunguList = sido ? regions[sido] ?? [] : [];

  function apply() {
    const params = new URLSearchParams();
    if (sido) params.set("sido", sido);
    if (sigungu) params.set("sigungu", sigungu);
    if (category) params.set("category", category);
    if (tier) params.set("tier", tier);
    if (q) params.set("q", q);
    if (depositMin) params.set("depositMin", depositMin);
    if (depositMax) params.set("depositMax", depositMax);
    if (rentMin) params.set("rentMin", rentMin);
    if (rentMax) params.set("rentMax", rentMax);
    if (premiumMin) params.set("premiumMin", premiumMin);
    if (premiumMax) params.set("premiumMax", premiumMax);
    if (sort && sort !== "default") params.set("sort", sort);
    router.push(`/listings?${params.toString()}`);
    setMobileOpen(false);
  }

  function reset() {
    router.push("/listings");
  }

  const filterCount = [sido, sigungu, category, tier, q, depositMin, depositMax, rentMin, rentMax, premiumMin, premiumMax].filter(Boolean).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white border border-border rounded-md font-semibold text-sm"
      >
        <span className="flex items-center gap-2">
          <Icon.Filter size={14} />
          검색 필터
          {filterCount > 0 && <span className="px-1.5 py-0.5 bg-foreground text-white text-[10px] rounded-full">{filterCount}</span>}
        </span>
        <Icon.ChevronRight size={14} className="text-muted" />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/50 lg:hidden ${mobileOpen ? "block" : "hidden"}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-24 right-0 z-50 lg:z-0
          h-screen lg:h-auto w-[88vw] max-w-sm lg:w-auto lg:max-w-none
          bg-white lg:bg-transparent
          overflow-y-auto lg:overflow-visible
          transition-transform
          ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="bg-white lg:border lg:border-border rounded-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">검색 필터</h3>
            <button type="button" onClick={() => setMobileOpen(false)} className="lg:hidden text-muted" aria-label="닫기">
              <Icon.X size={16} />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">키워드</label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="제목, 지역, 설명 검색"
              className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">지역</label>
            <div className="grid grid-cols-2 gap-1">
              <select
                value={sido}
                onChange={(e) => { setSido(e.target.value); setSigungu(""); }}
                className="px-2 py-2 text-xs border border-border rounded bg-white"
              >
                <option value="">시·도</option>
                {Object.keys(regions).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={sigungu}
                onChange={(e) => setSigungu(e.target.value)}
                disabled={!sido}
                className="px-2 py-2 text-xs border border-border rounded bg-white disabled:bg-zinc-50 disabled:text-muted"
              >
                <option value="">구·군</option>
                {sigunguList.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">업종</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2 py-2 text-xs border border-border rounded bg-white"
            >
              <option value="">전체</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">광고 등급</label>
            <div className="flex flex-wrap gap-1">
              {TIER_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  className={`px-2 py-1 text-xs border rounded ${
                    tier === t.value
                      ? "bg-foreground text-white border-foreground"
                      : "border-border text-muted hover:border-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">보증금</label>
            <div className="grid grid-cols-2 gap-1">
              <select value={depositMin} onChange={(e) => setDepositMin(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최소</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
              <select value={depositMax} onChange={(e) => setDepositMax(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최대</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">월세</label>
            <div className="grid grid-cols-2 gap-1">
              <select value={rentMin} onChange={(e) => setRentMin(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최소</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
              <select value={rentMax} onChange={(e) => setRentMax(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최대</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">권리금</label>
            <div className="grid grid-cols-2 gap-1">
              <select value={premiumMin} onChange={(e) => setPremiumMin(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최소</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
              <select value={premiumMax} onChange={(e) => setPremiumMax(e.target.value)} className="px-2 py-2 text-xs border border-border rounded bg-white">
                <option value="">최대</option>
                {MONEY_OPTIONS.map((v) => <option key={v} value={v}>{moneyLabel(v)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">정렬</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-2 py-2 text-xs border border-border rounded bg-white">
              <option value="default">기본 (광고순)</option>
              <option value="newest">최신순</option>
              <option value="views">조회순</option>
              <option value="price-low">낮은가격순</option>
              <option value="price-high">높은가격순</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button type="button" onClick={reset} className="py-2.5 text-xs font-bold border border-border rounded hover:border-foreground">
              초기화
            </button>
            <button type="button" onClick={apply} className="py-2.5 text-xs font-bold bg-foreground text-white rounded hover:bg-foreground/90">
              검색하기
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
