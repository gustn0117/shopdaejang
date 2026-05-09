import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchListingById, fetchListings } from "@/lib/db";
import { TierBadge } from "@/components/TierBadge";
import { formatKRW, formatRelativeDate } from "@/lib/format";
import { UrgentCard } from "@/components/ListingCard";
import { Icon } from "@/components/Icon";
import { Thumbnail } from "@/components/Thumbnail";
import { MiniMap } from "@/components/MiniMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(Number(id));
  if (!listing) return { title: "매물을 찾을 수 없습니다" };
  return {
    title: `${listing.title} - ${listing.region} ${listing.category}`,
    description: `${listing.region} ${listing.category} ${listing.area}평 매물. 보증금 ${listing.deposit.toLocaleString()}만 / 월세 ${listing.monthlyRent.toLocaleString()}만 / 권리금 ${listing.premium.toLocaleString()}만`,
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

  const relatedAll = await fetchListings({ category: listing.category, limit: 5 });
  const related = relatedAll.filter((l) => l.id !== listing.id).slice(0, 4);

  return (
    <div className="container-custom py-6 lg:py-10">
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
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button type="button" className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded text-xs font-semibold text-muted hover:text-foreground hover:border-foreground">
                  <Icon.Heart size={12} strokeWidth={2} />
                  찜 {listing.favorites}
                </button>
                <span className="text-[11px] text-muted">조회 {listing.views.toLocaleString()}</span>
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

          {/* 상세정보 */}
          <div className="bg-white rounded-md border border-border p-4 lg:p-6 mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              샵 구조
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line mb-4">
              {listing.shopStructure || "등록된 정보가 없습니다."}
            </p>

            <h2 className="text-base font-bold mb-3 mt-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              상권
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line mb-4">
              {listing.commercialArea || "등록된 정보가 없습니다."}
            </p>

            <h2 className="text-base font-bold mb-3 mt-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              기타사항
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {listing.etcInfo || "등록된 정보가 없습니다."}
            </p>
          </div>

          {/* Map */}
          <div className="bg-white rounded-md border border-border p-4 lg:p-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground rounded-sm" />
              위치 정보
            </h2>
            {listing.isAddressPublic ? (
              <>
                <p className="text-sm text-foreground mb-3">
                  {listing.region}
                </p>
                <MiniMap sido={listing.sido} sigungu={listing.sigungu} />
                <p className="text-[11px] text-muted mt-2 leading-relaxed">
                  지도는 시·도 단위 위치 기준이며, 정확한 매장 위치는 매도자에게 직접 확인해주세요.
                </p>
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

        {/* Right: Contact panel (sticky on desktop) */}
        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="bg-white rounded-md border border-border p-4">
            <p className="text-xs text-muted mb-1">매도자에게 직접 연락하세요</p>
            <p className="text-[11px] text-muted mb-3">
              샵대장은 광고 플랫폼이며 거래 중개에 개입하지 않습니다.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${listing.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-white font-bold rounded hover:bg-foreground/90"
              >
                <Icon.Phone size={16} strokeWidth={2.4} />
                전화걸기 {listing.useSecretNumber && <span className="text-[10px] border border-white/30 px-1.5 py-0.5 rounded">안심번호</span>}
              </a>
              <button type="button" className="flex items-center justify-center gap-2 w-full py-3 bg-[#FEE500] text-black font-bold rounded hover:opacity-90">
                <Icon.Chat size={14} strokeWidth={2.2} />
                카카오톡 상담
              </button>
              <button type="button" className="flex items-center justify-center gap-2 w-full py-2.5 border border-border text-foreground font-semibold rounded hover:bg-zinc-50">
                <Icon.Heart size={14} strokeWidth={2} />
                찜하기
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted">매물번호</span><span className="font-medium">{listing.id}</span></div>
              <div className="flex justify-between"><span className="text-muted">등록일</span><span className="font-medium">{formatRelativeDate(listing.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted">상태</span><span className="font-medium text-free">정상</span></div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-border rounded p-3 text-xs text-foreground/80">
            <p className="font-bold mb-1.5 flex items-center gap-1.5 text-foreground">
              <Icon.Warning size={12} strokeWidth={2.2} />
              사기 피해 예방
            </p>
            <ul className="space-y-1">
              <li>· 계약금/보증금을 미리 송금하지 마세요</li>
              <li>· 반드시 현장 방문 후 거래하세요</li>
              <li>· 의심스러운 매물은 신고해주세요</li>
            </ul>
          </div>

          <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs text-muted border border-border rounded hover:text-urgent hover:border-urgent">
            <Icon.Flag size={12} />
            매물 신고하기
          </button>
        </aside>
      </div>

      {/* Related */}
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
    </div>
  );
}
