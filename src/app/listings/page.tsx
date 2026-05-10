import Link from "next/link";
import { REGIONS, CATEGORIES } from "@/lib/data";
import { fetchListingsWithCount } from "@/lib/db";
import { UrgentCard, PremiumCard, NormalRow } from "@/components/ListingCard";
import { ListingsFilter } from "@/components/ListingsFilter";
import { Icon } from "@/components/Icon";
import { Pagination } from "@/components/Pagination";
import type { Listing } from "@/lib/types";
import { SortBar } from "./SortBar";
import { QuickChips } from "./QuickChips";

const PAGE_SIZE = 24;

type SP = Promise<{
  sido?: string;
  sigungu?: string;
  category?: string;
  tier?: string;
  q?: string;
  depositMin?: string;
  depositMax?: string;
  rentMin?: string;
  rentMax?: string;
  premiumMin?: string;
  premiumMax?: string;
  sort?: string;
  page?: string;
}>;

export default async function ListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tier = (sp.tier as Listing["tier"] | undefined) ?? undefined;
  const page = Math.max(1, Number(sp.page ?? "1"));

  const { rows: filtered, total } = await fetchListingsWithCount({
    tier,
    sido: sp.sido,
    sigungu: sp.sigungu,
    category: sp.category,
    q: sp.q,
    depositMin: sp.depositMin ? Number(sp.depositMin) : undefined,
    depositMax: sp.depositMax ? Number(sp.depositMax) : undefined,
    rentMin: sp.rentMin ? Number(sp.rentMin) : undefined,
    rentMax: sp.rentMax ? Number(sp.rentMax) : undefined,
    premiumMin: sp.premiumMin ? Number(sp.premiumMin) : undefined,
    premiumMax: sp.premiumMax ? Number(sp.premiumMax) : undefined,
    sort: sp.sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const urgent = filtered.filter((l) => l.tier === "urgent");
  const premium = filtered.filter((l) => l.tier === "premium");
  const normal = filtered.filter((l) => l.tier === "normal" || l.tier === "free");

  function buildHref(p: number) {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
      if (k !== "page" && v) params.set(k, String(v));
    });
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/listings${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
            Listings
          </p>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">매물검색</h1>
          <p className="text-sm text-muted mt-2">
            <span className="text-foreground font-bold tabular">{total.toLocaleString()}</span>건의 매물
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SortBar currentSort={sp.sort ?? "default"} />
          <Link
            href="/map"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-md hover:border-foreground transition-colors"
          >
            <Icon.Map size={14} />
            지도검색
          </Link>
        </div>
      </div>

      <QuickChips currentTier={tier} currentSido={sp.sido} />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 mt-4">
        <ListingsFilter regions={REGIONS} categories={CATEGORIES} initial={sp} />

        <div className="space-y-8">
          {urgent.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="px-1.5 py-0.5 badge-urgent text-[10px] rounded">긴급</span>
                긴급매물 <span className="text-muted tabular">({urgent.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {urgent.map((l) => <UrgentCard key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {premium.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="px-1.5 py-0.5 badge-premium text-[10px] rounded">프리미엄</span>
                프리미엄 <span className="text-muted tabular">({premium.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {premium.map((l) => <PremiumCard key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {normal.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm mb-3">
                일반·무료 <span className="text-muted tabular">({normal.length})</span>
              </h2>
              <div className="surface-card overflow-hidden">
                {normal.map((l) => <NormalRow key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="surface-card p-16 text-center">
              <Icon.Search size={32} className="mx-auto mb-4 text-muted" />
              <p className="font-semibold text-foreground">검색 결과가 없습니다</p>
              <p className="text-sm text-muted mt-1">다른 조건으로 다시 검색해주세요</p>
              <Link href="/listings" className="inline-block mt-5 px-4 py-2 bg-foreground text-white text-sm font-semibold rounded-md">
                전체 매물 보기
              </Link>
            </div>
          )}
          {total > PAGE_SIZE && (
            <Pagination
              current={page}
              total={total}
              pageSize={PAGE_SIZE}
              buildHref={buildHref}
            />
          )}
        </div>
      </div>
    </div>
  );
}
