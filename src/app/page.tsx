import Link from "next/link";
import { cookies } from "next/headers";
import { AD_PRICING, CATEGORIES } from "@/lib/data";
import { fetchListings, fetchNotices } from "@/lib/db";
import { UrgentCard, PremiumCard, NormalRow, FreeRow } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import { Icon } from "@/components/Icon";
import type { Listing } from "@/lib/types";

export const revalidate = 60;

async function fetchRecentlyViewed(): Promise<Listing[]> {
  const jar = await cookies();
  const raw = jar.get("recent_listings")?.value;
  if (!raw) return [];
  const ids = raw
    .split(",")
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 8);
  if (ids.length === 0) return [];

  const all = await fetchListings({ limit: 100 });
  const byId = new Map(all.map((l) => [l.id, l]));
  return ids.map((id) => byId.get(id)).filter((l): l is Listing => Boolean(l));
}

export default async function HomePage() {
  const [urgent, premium, normal, free, notices, recent] = await Promise.all([
    fetchListings({ tier: "urgent", limit: 8 }),
    fetchListings({ tier: "premium", limit: 6 }),
    fetchListings({ tier: "normal", limit: 8 }),
    fetchListings({ tier: "free", limit: 8 }),
    fetchNotices({ limit: 3 }),
    fetchRecentlyViewed(),
  ]);

  return (
    <div className="container-custom py-6 lg:py-10 space-y-10 lg:space-y-16">
      <section className="pt-4 pb-2 max-w-3xl">
        <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-4">
          Shopdaejang · Marketplace
        </p>
        <h1 className="h-display text-[32px] sm:text-[44px] lg:text-[58px] text-foreground">
          마사지샵 <span className="text-muted-strong">직거래</span>의 기준
        </h1>
        <p className="text-sm lg:text-base text-muted mt-5 max-w-xl leading-relaxed">
          매도자와 매수자가 직접 만나는 마사지샵 양도양수 플랫폼.
          중개 수수료 없이, 광고 비용만으로 거래를 시작하세요.
        </p>
        <div className="flex flex-wrap gap-2 mt-7">
          <Link
            href="/mypage/register"
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-foreground text-white text-sm font-semibold rounded-md hover:bg-foreground-soft transition-colors"
          >
            <Icon.Plus size={14} strokeWidth={2.4} />
            매물 등록하기
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-white border border-border text-foreground text-sm font-semibold rounded-md hover:border-foreground transition-colors"
          >
            <Icon.Search size={14} strokeWidth={2.2} />
            매물 둘러보기
          </Link>
        </div>
      </section>

      <SearchBar />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { n: "01", t: "회원가입 + 매물등록", d: "이메일로 가입하고 사진과 함께 매물을 등록합니다." },
          { n: "02", t: "광고 상품 결제", d: "긴급·프리미엄·일반·무료 중 선택해 결제합니다." },
          { n: "03", t: "관리자 승인 노출", d: "검수 후 평균 2~6시간 이내 노출됩니다." },
          { n: "04", t: "매수자 직접 연락", d: "매수자가 전화·카톡으로 매도자에게 직접 연락합니다." },
        ].map((s) => (
          <div key={s.n} className="surface-card p-4 lg:p-5">
            <p className="text-2xl font-black tabular text-muted-strong mb-3">{s.n}</p>
            <h3 className="font-bold text-sm tracking-tight mb-1">{s.t}</h3>
            <p className="text-[12px] text-muted leading-relaxed">{s.d}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-base lg:text-lg font-bold text-foreground tracking-tight">
            업종별 둘러보기
          </h2>
          <span className="text-[11px] text-muted">{CATEGORIES.length}개 업종</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/listings?category=${encodeURIComponent(cat)}`}
              className="px-3 py-3 text-sm font-medium text-center bg-white border border-border rounded-md hover:border-foreground hover:bg-primary-soft transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="Recently Viewed"
            title="최근 본 매물"
            href="/listings"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {recent.slice(0, 4).map((l) => (
              <UrgentCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {urgent.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="HOT"
            title="긴급매물"
            subtitle="빠른 거래를 원하시는 매물"
            href="/listings?tier=urgent"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {urgent.map((l) => (
              <UrgentCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {premium.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="PRO"
            title="프리미엄 매물"
            subtitle="검증된 매물을 추천합니다"
            href="/listings?tier=premium"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {premium.map((l) => (
              <PremiumCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-3 gap-3">
        <Link
          href="/ad-info"
          className="group lg:col-span-2 bg-foreground text-white rounded-md p-6 lg:p-8 flex items-center justify-between hover:bg-foreground-soft transition-colors"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 mb-2">
              Shopdaejang Ad
            </p>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight">
              긴급매물 1+1 이벤트
            </h3>
            <p className="text-sm text-white/70 mt-1">
              긴급매물 등록 시 광고 기간을 두 배로 드립니다.
            </p>
          </div>
          <Icon.ArrowRight size={22} strokeWidth={1.6} className="shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/map"
          className="group bg-white border border-border rounded-md p-6 lg:p-8 flex items-center justify-between hover:border-foreground transition-colors"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-2">
              Map View
            </p>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight">
              지도로 찾기
            </h3>
            <p className="text-sm text-muted mt-1">
              지역별 매물을 한눈에.
            </p>
          </div>
          <Icon.ArrowRight size={22} strokeWidth={1.6} className="shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {normal.length > 0 && (
        <section>
          <SectionHeader title="일반 매물" href="/listings?tier=normal" />
          <div className="surface-card overflow-hidden">
            {normal.map((l) => (
              <NormalRow key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {free.length > 0 && (
        <section>
          <SectionHeader title="무료 매물" subtitle="10일간 무료 노출" href="/listings?tier=free" />
          <div className="surface-card overflow-hidden">
            {free.map((l) => (
              <FreeRow key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 pt-2">
        <div>
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-3">
            Pricing
          </p>
          <h2 className="h-display text-2xl lg:text-3xl mb-2">
            매물에 맞는 광고 상품을 선택하세요
          </h2>
          <p className="text-sm text-muted mb-6">
            긴급·프리미엄·일반·무료 — 가장 빠른 거래로 가는 길.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AD_PRICING.map((p) => (
              <div
                key={p.tier}
                className="surface-card p-4 lg:p-5 flex flex-col"
              >
                <span
                  className={`inline-block self-start px-2 py-0.5 rounded text-white text-[10px] mb-3 font-bold ${
                    p.tier === "urgent"
                      ? "badge-urgent"
                      : p.tier === "premium"
                      ? "badge-premium"
                      : p.tier === "normal"
                      ? "badge-normal"
                      : "badge-free"
                  }`}
                >
                  {p.label}
                </span>
                <p className="text-[11px] text-muted mb-3 line-clamp-2 h-8 leading-snug">{p.description}</p>
                <div className="text-lg font-black text-foreground tabular">
                  {p.prices[0].price === 0 ? "무료" : `${(p.prices[0].price / 10000).toFixed(0)}만원`}
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  / {p.prices[0].period}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/ad-info"
            className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-foreground hover:underline"
          >
            전체 광고 상품 비교
            <Icon.ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

        <aside className="lg:pt-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold tracking-tight">공지사항</h3>
            <Link href="/notice" className="text-[11px] text-muted hover:text-foreground inline-flex items-center gap-0.5">
              더보기 <Icon.ChevronRight size={11} />
            </Link>
          </div>
          <ul className="space-y-3 border-t border-border">
            {notices.map((n) => (
              <li key={n.id} className="pt-3">
                <Link
                  href={`/notice/${n.id}`}
                  className="block text-sm text-foreground-soft hover:text-foreground line-clamp-1"
                >
                  {n.isPinned && <Icon.Pin size={11} className="inline mr-1 -mt-0.5 text-foreground" />}
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

