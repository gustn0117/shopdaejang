import Link from "next/link";
import { REGIONS, CATEGORIES } from "@/lib/data";
import { fetchListings } from "@/lib/db";
import { UrgentCard, PremiumCard, NormalRow } from "@/components/ListingCard";
import { ListingsFilter } from "@/components/ListingsFilter";
import { Icon } from "@/components/Icon";
import type { Listing } from "@/lib/types";

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
}>;

export default async function ListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tier = (sp.tier as Listing["tier"] | undefined) ?? undefined;

  const filtered = await fetchListings({
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
  });

  const urgent = filtered.filter((l) => l.tier === "urgent");
  const premium = filtered.filter((l) => l.tier === "premium");
  const normal = filtered.filter((l) => l.tier === "normal" || l.tier === "free");

  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight">매물검색</h1>
          <p className="text-xs lg:text-sm text-muted mt-1">
            총 <span className="text-foreground font-bold">{filtered.length}</span>건의 매물이 검색되었습니다
          </p>
        </div>
        <Link href="/map" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-border rounded hover:border-foreground">
          <Icon.Map size={12} />
          지도검색
        </Link>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        <ListingsFilter
          regions={REGIONS}
          categories={CATEGORIES}
          initial={sp}
        />

        <div className="space-y-6">
          {urgent.length > 0 && (
            <section>
              <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
                <span className="px-1.5 py-0.5 badge-urgent text-[10px] rounded">긴급</span>
                긴급매물 ({urgent.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {urgent.map((l) => <UrgentCard key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {premium.length > 0 && (
            <section>
              <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
                <span className="px-1.5 py-0.5 badge-premium text-[10px] rounded">프리미엄</span>
                프리미엄 ({premium.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {premium.map((l) => <PremiumCard key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {normal.length > 0 && (
            <section>
              <h2 className="font-bold text-sm mb-2">일반·무료 ({normal.length})</h2>
              <div className="bg-white rounded-md border border-border overflow-hidden">
                {normal.map((l) => <NormalRow key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="bg-white rounded-md border border-border p-12 text-center">
              <Icon.Search size={32} className="mx-auto mb-3 text-muted" />
              <p className="font-bold mb-1">검색 결과가 없습니다</p>
              <p className="text-sm text-muted">다른 조건으로 다시 검색해주세요</p>
              <Link href="/listings" className="inline-block mt-4 px-4 py-2 bg-foreground text-white text-sm font-bold rounded">
                전체 매물 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
