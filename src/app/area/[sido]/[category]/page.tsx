import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SAMPLE_LISTINGS, REGIONS, CATEGORIES } from "@/lib/data";
import { UrgentCard, NormalRow } from "@/components/ListingCard";
import type { ShopCategory } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sido: string; category: string }>;
}): Promise<Metadata> {
  const { sido: rawSido, category: rawCategory } = await params;
  const sido = decodeURIComponent(rawSido);
  const category = decodeURIComponent(rawCategory);
  return {
    title: `${sido} ${category} 매물 모음`,
    description: `${sido} 지역 ${category} 양도양수 매물을 한눈에 확인하세요. 직거래 전문 사이트 샵대장에서 ${sido} ${category} 매장 정보를 빠르게 찾아보세요.`,
  };
}

export async function generateStaticParams() {
  const params: { sido: string; category: string }[] = [];
  for (const sido of Object.keys(REGIONS)) {
    for (const cat of CATEGORIES) {
      params.push({
        sido: encodeURIComponent(sido),
        category: encodeURIComponent(cat),
      });
    }
  }
  return params;
}

export default async function CategoryAreaPage({
  params,
}: {
  params: Promise<{ sido: string; category: string }>;
}) {
  const { sido: rawSido, category: rawCategory } = await params;
  const sido = decodeURIComponent(rawSido);
  const category = decodeURIComponent(rawCategory) as ShopCategory;

  if (!REGIONS[sido as keyof typeof REGIONS]) notFound();
  if (!CATEGORIES.includes(category)) notFound();

  const listings = SAMPLE_LISTINGS.filter(
    (l) => l.sido === sido && l.category === category
  );

  return (
    <div className="container-custom py-4 lg:py-6">
      <nav className="text-xs text-muted mb-3 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span>/</span>
        <Link href={`/area/${encodeURIComponent(sido)}`} className="hover:text-primary">{sido}</Link>
        <span>/</span>
        <span className="text-foreground">{category}</span>
      </nav>

      <header className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-black">
          {sido} {category} 매물 모음
        </h1>
        <p className="text-xs lg:text-sm text-muted mt-2">
          {sido} 지역의 {category} 매물 <span className="text-primary font-bold">{listings.length}건</span>이 등록되어 있습니다.
        </p>
      </header>

      {/* 다른 카테고리 바로가기 */}
      <section className="bg-white rounded-xl border border-border p-3 lg:p-4 mb-4">
        <h2 className="text-sm font-bold mb-2">{sido}의 다른 업종 보기</h2>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.filter((c) => c !== category).map((c) => (
            <Link
              key={c}
              href={`/area/${encodeURIComponent(sido)}/${encodeURIComponent(c)}`}
              className="px-2 py-1 text-xs border border-border rounded-full hover:border-primary hover:text-primary"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {listings.length > 0 ? (
        <>
          <section className="mb-6">
            <h2 className="text-base lg:text-lg font-black mb-3">
              {sido} {category} 추천 매물
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3">
              {listings.slice(0, 6).map((l) => (
                <UrgentCard key={l.id} listing={l} />
              ))}
            </div>
          </section>

          {listings.length > 6 && (
            <section>
              <h2 className="text-base lg:text-lg font-black mb-3">
                {sido} {category} 전체 매물
              </h2>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {listings.slice(6).map((l) => (
                  <NormalRow key={l.id} listing={l} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-bold">{sido} {category} 매물이 없습니다</p>
          <p className="text-sm text-muted mt-1">다른 지역이나 업종을 확인해보세요</p>
          <Link href={`/area/${encodeURIComponent(sido)}`} className="inline-block mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">
            {sido} 전체 매물 보기 →
          </Link>
        </div>
      )}

      <section className="mt-8 bg-white rounded-xl border border-border p-4 lg:p-6">
        <h2 className="text-base font-bold mb-2">{sido} {category} 매물에 대해</h2>
        <p className="text-xs lg:text-sm text-muted leading-relaxed">
          {sido}에서 {category} 양도양수를 원하시는 분들께 최신 매물 정보를 제공해드립니다.
          샵대장은 매도자와 매수자가 직접 거래할 수 있는 직거래 플랫폼으로, 중개 수수료 없이 안전하게 거래하실 수 있습니다.
          {category}을(를) 신규 창업하시거나 기존 매장을 양도하시려는 분들께 도움이 되는 정보를 제공합니다.
          매물 등록 시 광고 상품 결제 후 관리자 승인을 거쳐 노출됩니다.
        </p>
      </section>
    </div>
  );
}
