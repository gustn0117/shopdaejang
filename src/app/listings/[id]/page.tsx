import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchListingById, fetchListings } from "@/lib/db";
import { TierBadge } from "@/components/TierBadge";
import { formatKRW, formatRelativeDate } from "@/lib/format";
import { UrgentCard } from "@/components/ListingCard";
import { Icon } from "@/components/Icon";
import { Thumbnail } from "@/components/Thumbnail";
import { KakaoLocation } from "@/components/KakaoLocation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ViewTracker } from "@/components/ViewTracker";
import { RecentTracker } from "@/components/RecentTracker";
import { createClient } from "@/lib/supabase/server";
import { FEATURE_LABEL } from "@/lib/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(Number(id));
  if (!listing) return { title: "매물을 찾을 수 없습니다" };

  const title = `${listing.region} ${listing.category} ${listing.area}평 - ${listing.title}`;
  const description = `${listing.region} ${listing.category} ${listing.area}평 양도양수 매물. 보증금 ${listing.deposit.toLocaleString()}만, 월세 ${listing.monthlyRent.toLocaleString()}만, 권리금 ${listing.premium.toLocaleString()}만. 직거래로 빠르고 안전하게.`;
  const url = `https://shopdaejang.hsweb.pics/listings/${listing.id}`;

  return {
    title,
    description,
    keywords: [
      `${listing.region} ${listing.category}`,
      `${listing.sido} 마사지샵`,
      `${listing.sido} ${listing.category} 양도`,
      `${listing.sido} ${listing.category} 매매`,
      "마사지샵 직거래",
      "샵대장",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "ko_KR",
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListingById(Number(id));
  if (!listing) notFound();

  // 조회수 증가는 클라이언트 마운트 시 ViewTracker → /api/views/listing/[id] 호출

  // 현재 사용자가 찜했는지 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let favorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id)
      .eq("listing_id", listing.id)
      .maybeSingle();
    favorited = !!fav;
  }

  const relatedAll = await fetchListings({ category: listing.category, limit: 5 });
  const related = relatedAll.filter((l) => l.id !== listing.id).slice(0, 4);

  // 같은 구·군 매물
  const sameDistrictAll = await fetchListings({
    sido: listing.sido,
    sigungu: listing.sigungu,
    limit: 6,
  });
  const sameDistrict = sameDistrictAll.filter((l) => l.id !== listing.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${listing.region} ${listing.category} ${listing.area}평`,
    description: listing.description || `${listing.region} ${listing.category} 양도양수 매물`,
    sku: `SHOP-${listing.id}`,
    category: listing.category,
    offers: {
      "@type": "Offer",
      price: listing.deposit + listing.premium,
      priceCurrency: "KRW",
      availability:
        listing.status === "approved"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      areaServed: { "@type": "Place", name: listing.region },
    },
    aggregateRating:
      listing.favorites > 0
        ? { "@type": "AggregateRating", ratingValue: 5, ratingCount: listing.favorites }
        : undefined,
  };

  return (
    <div className="container-custom py-6 lg:py-10 pb-32 lg:pb-10">
      <ViewTracker type="listing" id={listing.id} />
      <RecentTracker id={listing.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-[11px] text-muted mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <span className="text-border">/</span>
        <Link href="/listings" className="hover:text-foreground">매물검색</Link>
        <span className="text-border">/</span>
        <Link href={`/listings?sido=${listing.sido}`} className="hover:text-foreground">{listing.sido}</Link>
      </nav>

      <div className="grid lg:grid-cols-[1fr_380px] gap-4 lg:gap-6">
        {/* Left: Photos + details */}
        <div>
          <div className="bg-white rounded-md border border-border overflow-hidden mb-4">
            <div className="relative aspect-16/10 bg-zinc-100">
              <Thumbnail
                src={listing.thumbnail}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <TierBadge tier={listing.tier} size="md" />
                <span className="px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                  매물번호 {listing.id}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-border p-4 lg:p-6 mb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <span>{listing.region}</span>
                  <span>·</span>
                  <span className="text-foreground font-semibold">{listing.category}</span>
                  <span>·</span>
                  <span>{listing.area}평</span>
                </div>
                <h1 className="text-xl lg:text-2xl font-black text-foreground mb-2 tracking-tight">
                  {listing.title}
                </h1>
                <p className="text-sm text-muted">{listing.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <FavoriteButton
                  listingId={listing.id}
                  initialFavorited={favorited}
                  initialCount={listing.favorites}
                />
                <span className="text-[11px] text-muted tabular">조회 {listing.views.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">보증금</div>
                <div className="font-black text-base tabular">{listing.deposit.toLocaleString()}만</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">월세</div>
                <div className="font-black text-base tabular">{listing.monthlyRent.toLocaleString()}만</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">권리금</div>
                <div className="font-black text-base tabular">{listing.premium.toLocaleString()}만</div>
              </div>
              <div className="text-center bg-foreground text-white rounded p-2">
                <div className="text-[11px] text-white/70 mb-1">합계</div>
                <div className="font-black text-base tabular">
                  {formatKRW(listing.deposit + listing.premium)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-border p-4 lg:p-6 mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              상세 정보
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {listing.description ||
                listing.shopStructure ||
                listing.commercialArea ||
                listing.etcInfo ||
                "등록된 정보가 없습니다."}
            </p>

            {listing.features && listing.features.length > 0 && (
              <>
                <h2 className="text-base font-bold mb-3 mt-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-foreground rounded-sm" />
                  매물 특징
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {listing.features.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium border border-border rounded-full bg-zinc-50"
                    >
                      <Icon.Check size={11} strokeWidth={2.5} className="text-foreground" />
                      {FEATURE_LABEL[k] ?? k}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-md border border-border p-4 lg:p-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              위치 정보
            </h2>
            {listing.isAddressPublic ? (
              <>
                <p className="text-sm text-foreground mb-3">{listing.region}</p>
                <KakaoLocation
                  sido={listing.sido}
                  sigungu={listing.sigungu}
                  dong={listing.dong}
                />
              </>
            ) : (
              <div className="aspect-video bg-zinc-50 rounded flex flex-col items-center justify-center text-muted text-sm gap-2 border border-dashed border-border">
                <Icon.MapPin size={32} className="text-muted" />
                <p className="font-semibold">주소 비공개 매물</p>
                <p className="text-xs">매도자에게 직접 문의 후 위치 확인이 가능합니다</p>
                <p className="text-xs text-foreground">표시 가능 지역: <span className="font-semibold">{listing.sido} {listing.sigungu}</span></p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="bg-white rounded-md border border-border p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-foreground text-white text-[10px] font-bold rounded">
                <Icon.Check size={10} strokeWidth={3} />
                관리자 검수 완료
              </span>
              {listing.useSecretNumber && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-foreground text-foreground text-[10px] font-bold rounded">
                  안심번호
                </span>
              )}
            </div>
            <p className="text-[12px] text-muted mb-3 leading-relaxed">
              매도자에게 직접 연락하세요. 샵대장은 광고 플랫폼이며 거래에 개입하지 않습니다.
            </p>
            <div className="mb-2 px-3 py-2.5 bg-zinc-50 border border-border rounded flex items-center justify-between">
              <span className="text-[11px] text-muted">
                {listing.useSecretNumber ? "안심번호" : "판매자 연락처"}
              </span>
              <a
                href={`tel:${listing.phone}`}
                className="text-sm font-black tabular text-foreground tracking-tight hover:underline"
              >
                {listing.phone}
              </a>
            </div>
            <div className="space-y-2">
              <a
                href={`tel:${listing.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-white font-bold rounded hover:bg-foreground/90"
              >
                <Icon.Phone size={16} strokeWidth={2.4} />
                판매자에게 전화
              </a>
              <a
                href={`sms:${listing.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-foreground text-foreground font-bold rounded hover:bg-zinc-50"
              >
                <Icon.Chat size={16} strokeWidth={2.4} />
                판매자에게 문자
              </a>
              <a
                href="http://pf.kakao.com/_shopdaejang"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#FEE500] text-black font-bold rounded hover:opacity-90"
              >
                <Icon.Chat size={14} strokeWidth={2.2} />
                샵대장 카카오톡 채널 상담
              </a>
              <FavoriteButton
                listingId={listing.id}
                initialFavorited={favorited}
                initialCount={listing.favorites}
                variant="block"
              />
            </div>
            <dl className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <dt className="text-muted">매물번호</dt>
              <dd className="font-medium tabular text-right">#{listing.id}</dd>
              <dt className="text-muted">등록일</dt>
              <dd className="font-medium text-right">{formatRelativeDate(listing.createdAt)}</dd>
              <dt className="text-muted">조회수</dt>
              <dd className="font-medium tabular text-right">{listing.views.toLocaleString()}</dd>
              <dt className="text-muted">상태</dt>
              <dd className="font-medium text-free text-right inline-flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-free inline-block" />
                정상 노출중
              </dd>
            </dl>
          </div>

          <div className="bg-white border border-border rounded-md p-4 text-xs text-foreground/80">
            <p className="font-bold mb-2 flex items-center gap-1.5 text-foreground">
              <Icon.Warning size={12} strokeWidth={2.2} />
              안전 거래 가이드
            </p>
            <ul className="space-y-1.5 leading-relaxed">
              <li>· 계약금·보증금을 미리 송금하지 마세요</li>
              <li>· 반드시 현장 방문 후 거래하세요</li>
              <li>· 사업자등록증·임대차계약서 확인을 권장합니다</li>
              <li>· 의심스러운 매물은 즉시 신고해주세요</li>
            </ul>
          </div>

          <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs text-muted border border-border rounded hover:text-urgent hover:border-urgent">
            <Icon.Flag size={12} />
            매물 신고하기
          </button>
        </aside>
      </div>

      <MobileCtaBar
        listingId={listing.id}
        initialFavorited={favorited}
        initialCount={listing.favorites}
        phone={listing.phone}
        useSecretNumber={listing.useSecretNumber}
      />

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg lg:text-xl font-black mb-3 tracking-tight">같은 업종의 다른 매물</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
            {related.map((l) => (
              <UrgentCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {sameDistrict.length > 0 && (
        <section className="mt-10">
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
            Same District
          </p>
          <h2 className="text-lg lg:text-xl font-black mb-4 tracking-tight">
            &lsquo;{listing.sido} {listing.sigungu}&rsquo; 지역의 다른 매물을 보여드려요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
            {sameDistrict.map((l) => (
              <UrgentCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
