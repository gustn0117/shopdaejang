import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SAMPLE_LISTINGS, REGIONS, CATEGORIES } from "@/lib/data";
import { UrgentCard, NormalRow } from "@/components/ListingCard";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ sido: string }> }): Promise<Metadata> {
  const { sido: rawSido } = await params;
  const sido = decodeURIComponent(rawSido);
  return {
    title: `${sido} 마사지샵 매물 모음`,
    description: `${sido} 지역 마사지샵 양도양수 매물을 한눈에 확인하세요. 긴급매물, 프리미엄, 일반 매물 등 다양한 ${sido} 마사지 매장 정보.`,
  };
}

export async function generateStaticParams() {
  return Object.keys(REGIONS).map((sido) => ({ sido: encodeURIComponent(sido) }));
}

export default async function SidoAreaPage({ params }: { params: Promise<{ sido: string }> }) {
  const { sido: rawSido } = await params;
  const sido = decodeURIComponent(rawSido);
  if (!REGIONS[sido as keyof typeof REGIONS]) notFound();

  const listings = SAMPLE_LISTINGS.filter((l) => l.sido === sido);
  const urgent = listings.filter((l) => l.tier === "urgent" || l.tier === "premium").slice(0, 6);
  const others = listings.filter((l) => l.tier !== "urgent" && l.tier !== "premium");

  // category counts in this sido
  const catCounts = CATEGORIES.map((c) => ({
    cat: c,
    count: listings.filter((l) => l.category === c).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="container-custom py-4 lg:py-6">
      <nav className="text-xs text-muted mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-foreground">매물검색</Link>
        <span>/</span>
        <span className="text-foreground">{sido}</span>
      </nav>

      <header className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
          {sido} 마사지샵 매물 모음
        </h1>
        <p className="text-xs lg:text-sm text-muted mt-2">
          {sido} 지역에 등록된 마사지샵 양도양수 매물 <span className="text-foreground font-bold">{listings.length}건</span>을 한눈에 확인하세요.
        </p>
      </header>

      {/* 카테고리 바로가기 */}
      <section className="bg-white rounded-md border border-border p-3 lg:p-4 mb-4">
        <h2 className="text-sm font-bold mb-2">{sido}의 업종별 매물</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {catCounts.map((c) => (
            <Link
              key={c.cat}
              href={`/area/${encodeURIComponent(sido)}/${encodeURIComponent(c.cat)}`}
              className="px-2 py-2 text-xs text-center border border-border rounded hover:border-foreground hover:bg-zinc-50"
            >
              <p className="font-semibold">{c.cat}</p>
              <p className="text-[10px] text-muted">{c.count}건</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 시·구·군 바로가기 */}
      <section className="bg-white rounded-md border border-border p-3 lg:p-4 mb-4">
        <h2 className="text-sm font-bold mb-2">{sido}의 구·군별 매물</h2>
        <div className="flex flex-wrap gap-1">
          {(REGIONS[sido as keyof typeof REGIONS] ?? []).map((sigungu) => (
            <Link
              key={sigungu}
              href={`/listings?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`}
              className="px-2 py-1 text-xs border border-border rounded-full hover:border-foreground"
            >
              {sigungu}
            </Link>
          ))}
        </div>
      </section>

      {urgent.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base lg:text-lg font-black mb-3">
            {sido} 추천 매물
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3">
            {urgent.map((l) => <UrgentCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="text-base lg:text-lg font-black mb-3">
            {sido} 전체 매물 ({others.length})
          </h2>
          <div className="bg-white rounded-md border border-border overflow-hidden">
            {others.map((l) => <NormalRow key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {listings.length === 0 && (
        <div className="bg-white rounded-md border border-border p-12 text-center">
          <Icon.Info size={32} className="mx-auto mb-3 text-muted" />
          <p className="font-bold">{sido}에 등록된 매물이 없습니다</p>
          <p className="text-sm text-muted mt-1">다른 지역의 매물을 확인해보세요</p>
        </div>
      )}

      <section className="mt-8 bg-white rounded-md border border-border p-4 lg:p-6">
        <h2 className="text-base font-bold mb-2">{sido}에서 마사지샵 찾기</h2>
        <p className="text-xs lg:text-sm text-muted leading-relaxed">
          {sido} 지역에서 운영중인 마사지샵, 스웨디시, 스포츠 마사지, 아로마, 타이, 중국, 전통, 베트남, 경락, 피부관리실, 토탈샵 등 다양한 업종의 매물을 확인하실 수 있습니다.
          샵대장은 매도자와 매수자가 직접 거래할 수 있는 직거래 플랫폼으로, 중개 수수료 없이 안전하게 양도양수를 진행하실 수 있습니다.
          {sido}에서 새로 마사지샵을 시작하시거나 기존 매장을 양도하시려는 분들께 최신 매물 정보를 제공해드리고 있습니다.
        </p>
      </section>
    </div>
  );
}
