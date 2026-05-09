import Link from "next/link";
import { AD_PRICING, CATEGORIES } from "@/lib/data";
import { fetchListings, fetchNotices } from "@/lib/db";
import { UrgentCard, PremiumCard, NormalRow, FreeRow } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import { Icon } from "@/components/Icon";

export const revalidate = 60;

export default async function HomePage() {
  const [urgent, premium, normal, free, notices] = await Promise.all([
    fetchListings({ tier: "urgent", limit: 8 }),
    fetchListings({ tier: "premium", limit: 8 }),
    fetchListings({ tier: "normal", limit: 10 }),
    fetchListings({ tier: "free", limit: 8 }),
    fetchNotices({ limit: 4 }),
  ]);

  return (
    <div className="container-custom py-4 lg:py-6 space-y-6 lg:space-y-8">
      <section className="grid lg:grid-cols-[1fr_320px] gap-3 lg:gap-4">
        <div className="bg-foreground rounded-md p-5 lg:p-8 text-white">
          <div className="inline-block px-2 py-0.5 border border-white/30 text-[11px] font-semibold rounded mb-3">
            마사지샵 직거래 1등 사이트
          </div>
          <h1 className="text-xl lg:text-3xl font-black mb-1 lg:mb-2 leading-tight tracking-tight">
            마사지샵 양도양수
            <br />
            샵대장에서 직접 거래하세요
          </h1>
          <p className="text-white/70 text-xs lg:text-sm mb-4">
            매도자와 매수자가 직접 연결되는 직거래 플랫폼
          </p>
          <div className="flex gap-2">
            <Link
              href="/mypage/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-foreground font-bold text-xs lg:text-sm rounded hover:bg-zinc-100"
            >
              <Icon.Plus size={14} strokeWidth={2.4} />
              매물등록하기
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/30 text-white font-bold text-xs lg:text-sm rounded hover:bg-white/10"
            >
              <Icon.Search size={14} strokeWidth={2.2} />
              매물찾기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
          <div className="bg-white rounded-md border border-border p-3 lg:p-4 lg:flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs lg:text-sm font-bold text-foreground">공지사항</h3>
              <Link href="/notice" className="inline-flex items-center text-[10px] text-muted hover:text-foreground">
                <Icon.Plus size={11} strokeWidth={2} />
              </Link>
            </div>
            <ul className="space-y-1.5">
              {notices.map((n) => (
                <li key={n.id} className="flex items-start gap-1.5">
                  {n.isPinned && <Icon.Pin size={11} className="text-foreground shrink-0 mt-0.5" />}
                  <Link
                    href={`/notice/${n.id}`}
                    className="text-[11px] lg:text-xs text-foreground hover:text-foreground/70 line-clamp-1"
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-md border border-border p-3 lg:p-4 lg:flex-1">
            <h3 className="text-xs lg:text-sm font-bold text-foreground mb-2">간편 로그인</h3>
            <div className="grid grid-cols-3 gap-1.5">
              <Link href="/login" className="flex flex-col items-center gap-1 py-2 bg-[#03C75A] text-white rounded text-[10px] font-bold">
                <span className="text-base font-black leading-none">N</span>
                네이버
              </Link>
              <Link href="/login" className="flex flex-col items-center gap-1 py-2 bg-[#FEE500] text-black rounded text-[10px] font-bold">
                <Icon.Chat size={14} strokeWidth={2.2} />
                카카오
              </Link>
              <Link href="/login" className="flex flex-col items-center gap-1 py-2 bg-white border border-border text-foreground rounded text-[10px] font-bold">
                <span className="text-base leading-none">G</span>
                구글
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SearchBar />

      <section className="bg-white rounded-md border border-border p-3 lg:p-4">
        <h3 className="text-sm font-bold mb-2 text-foreground">업종별 빠른 찾기</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/listings?category=${encodeURIComponent(cat)}`}
              className="text-center px-1 py-2 text-xs font-medium border border-border rounded hover:border-foreground hover:bg-zinc-50 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="긴급매물"
          subtitle="빠른 거래를 원하시는 매물"
          badge="HOT"
          href="/listings?tier=urgent"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
          {urgent.map((l) => (
            <UrgentCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white border border-border rounded-md p-4 lg:p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold text-muted mb-0.5 tracking-wider">SHOP DAEJANG AD</div>
            <h3 className="text-base lg:text-lg font-black mb-0.5">긴급매물 1+1 이벤트</h3>
            <p className="text-xs text-muted">긴급매물 등록 시 광고 기간 1+1 혜택</p>
          </div>
          <Link href="/ad-info" className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded shrink-0">
            자세히 <Icon.ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white border border-border rounded-md p-4 lg:p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold text-muted mb-0.5 tracking-wider">SHOP DAEJANG</div>
            <h3 className="text-base lg:text-lg font-black mb-0.5">지도로 매물찾기</h3>
            <p className="text-xs text-muted">지역별 매물을 지도에서 한눈에</p>
          </div>
          <Link href="/map" className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded shrink-0">
            <Icon.Map size={12} />
            지도검색
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader title="프리미엄 매물" subtitle="검증된 매물을 추천합니다" badge="PRO" href="/listings?tier=premium" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
          {premium.map((l) => (
            <PremiumCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="일반 매물" href="/listings?tier=normal" />
        <div className="bg-white rounded-md border border-border overflow-hidden">
          {normal.map((l) => (
            <NormalRow key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="무료 매물" subtitle="10일간 무료 노출" href="/listings?tier=free" />
        <div className="bg-white rounded-md border border-border overflow-hidden">
          {free.map((l) => (
            <FreeRow key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-md border border-border p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg lg:text-xl font-black text-foreground tracking-tight">광고 상품 안내</h2>
            <p className="text-xs text-muted mt-1">매물의 노출도를 높이는 다양한 광고 상품을 만나보세요</p>
          </div>
          <Link href="/ad-info" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-foreground text-white text-xs font-bold rounded">
            광고 안내 자세히
            <Icon.ChevronRight size={12} strokeWidth={2.2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
          {AD_PRICING.map((p) => (
            <div
              key={p.tier}
              className="border border-border rounded p-3 lg:p-4 hover:border-foreground transition-colors"
            >
              <div className="text-xs font-bold mb-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-white text-[10px] mr-1 ${
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
              </div>
              <p className="text-[11px] text-muted mb-2 line-clamp-2 h-8">{p.description}</p>
              <div className="text-base font-black text-foreground">
                {p.prices[0].price === 0 ? "무료" : `${(p.prices[0].price / 10000).toFixed(0)}만원`}
                <span className="text-xs font-normal text-muted ml-1">/ {p.prices[0].period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
