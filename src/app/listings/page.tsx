import Link from "next/link";
import { SAMPLE_LISTINGS, REGIONS, CATEGORIES } from "@/lib/data";
import { UrgentCard, PremiumCard, NormalRow } from "@/components/ListingCard";
import { ListingsFilter } from "@/components/ListingsFilter";

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
  let filtered = [...SAMPLE_LISTINGS];

  if (sp.sido) filtered = filtered.filter((l) => l.sido === sp.sido);
  if (sp.sigungu) filtered = filtered.filter((l) => l.sigungu === sp.sigungu);
  if (sp.category) filtered = filtered.filter((l) => l.category === sp.category);
  if (sp.tier) filtered = filtered.filter((l) => l.tier === sp.tier);
  if (sp.q) {
    const q = sp.q.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
    );
  }
  if (sp.depositMin) filtered = filtered.filter((l) => l.deposit >= Number(sp.depositMin));
  if (sp.depositMax) filtered = filtered.filter((l) => l.deposit <= Number(sp.depositMax));
  if (sp.rentMin) filtered = filtered.filter((l) => l.monthlyRent >= Number(sp.rentMin));
  if (sp.rentMax) filtered = filtered.filter((l) => l.monthlyRent <= Number(sp.rentMax));
  if (sp.premiumMin) filtered = filtered.filter((l) => l.premium >= Number(sp.premiumMin));
  if (sp.premiumMax) filtered = filtered.filter((l) => l.premium <= Number(sp.premiumMax));

  // sort
  const sort = sp.sort ?? "default";
  if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (sort === "views") filtered.sort((a, b) => b.views - a.views);
  if (sort === "price-low") filtered.sort((a, b) => a.deposit + a.premium - b.deposit - b.premium);
  if (sort === "price-high") filtered.sort((a, b) => b.deposit + b.premium - a.deposit - a.premium);
  if (sort === "default") {
    const tierOrder: Record<string, number> = { urgent: 0, premium: 1, normal: 2, free: 3 };
    filtered.sort((a, b) => {
      const t = tierOrder[a.tier] - tierOrder[b.tier];
      if (t !== 0) return t;
      return new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime();
    });
  }

  const urgent = filtered.filter((l) => l.tier === "urgent");
  const premium = filtered.filter((l) => l.tier === "premium");
  const normal = filtered.filter((l) => l.tier === "normal" || l.tier === "free");

  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-black">매물검색</h1>
          <p className="text-xs lg:text-sm text-muted mt-1">
            총 <span className="text-primary font-bold">{filtered.length}</span>건의 매물이 검색되었습니다
          </p>
        </div>
        <Link href="/map" className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs border border-border rounded-lg hover:border-primary hover:text-primary">
          🗺️ 지도검색
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
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {normal.map((l) => <NormalRow key={l.id} listing={l} />)}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-bold mb-1">검색 결과가 없습니다</p>
              <p className="text-sm text-muted">다른 조건으로 다시 검색해주세요</p>
              <Link href="/listings" className="inline-block mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg">
                전체 매물 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
