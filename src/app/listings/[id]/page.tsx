import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SAMPLE_LISTINGS } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";
import { formatKRW, formatRelativeDate } from "@/lib/format";
import { UrgentCard } from "@/components/ListingCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = SAMPLE_LISTINGS.find((l) => l.id === Number(id));
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
  const listing = SAMPLE_LISTINGS.find((l) => l.id === Number(id));
  if (!listing) notFound();

  const related = SAMPLE_LISTINGS.filter(
    (l) => l.id !== listing.id && l.category === listing.category
  ).slice(0, 4);

  return (
    <div className="container-custom py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-primary">매물검색</Link>
        <span>/</span>
        <Link href={`/listings?sido=${listing.sido}`} className="hover:text-primary">{listing.sido}</Link>
        <span>/</span>
        <span className="text-foreground">{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_380px] gap-4 lg:gap-6">
        {/* Left: Photos + details */}
        <div>
          <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
            <div className="relative aspect-[16/10] bg-zinc-100">
              <Image
                src={listing.thumbnail}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                unoptimized
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

          <div className="bg-white rounded-xl border border-border p-4 lg:p-6 mb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <span>{listing.region}</span>
                  <span>·</span>
                  <span className="text-primary font-semibold">{listing.category}</span>
                  <span>·</span>
                  <span>{listing.area}평</span>
                </div>
                <h1 className="text-xl lg:text-2xl font-black text-foreground mb-2">
                  {listing.title}
                </h1>
                <p className="text-sm text-muted">{listing.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-border rounded text-xs font-semibold text-muted hover:text-primary hover:border-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  찜 {listing.favorites}
                </button>
                <span className="text-[11px] text-muted">조회 {listing.views.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">보증금</div>
                <div className="font-black text-base">{listing.deposit.toLocaleString()}만</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">월세</div>
                <div className="font-black text-base">{listing.monthlyRent.toLocaleString()}만</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted mb-1">권리금</div>
                <div className="font-black text-base">{listing.premium.toLocaleString()}만</div>
              </div>
              <div className="text-center bg-primary-light rounded-lg p-2">
                <div className="text-[11px] text-primary mb-1">합계</div>
                <div className="font-black text-base text-primary">
                  {formatKRW(listing.deposit + listing.premium)}
                </div>
              </div>
            </div>
          </div>

          {/* 상세정보 */}
          <div className="bg-white rounded-xl border border-border p-4 lg:p-6 mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded" />
              샵 구조
            </h2>
            <div className="text-sm text-foreground/80 leading-relaxed space-y-2 mb-4">
              <p>· 1인실 2개, 2인실 1개 (총 4베드 운영중)</p>
              <p>· 샤워실 2개, 화장실 분리</p>
              <p>· 대기실 + 카운터 분리 구조</p>
              <p>· 신축 인테리어 후 1년 미사용 부분 다수</p>
            </div>

            <h2 className="text-base font-bold mb-3 mt-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded" />
              상권
            </h2>
            <div className="text-sm text-foreground/80 leading-relaxed space-y-2 mb-4">
              <p>· 역세권 도보 5분 거리</p>
              <p>· 주변 오피스 및 주거지 밀집 지역</p>
              <p>· 경쟁업체 상대적으로 적은 안정 상권</p>
              <p>· 평일/주말 모두 매출 안정적</p>
            </div>

            <h2 className="text-base font-bold mb-3 mt-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded" />
              기타사항
            </h2>
            <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
              <p>· 권리금 협의 가능</p>
              <p>· 인테리어 사진 별도 전송 가능</p>
              <p>· 현재 운영중이며 빠른 거래 원함</p>
              <p>· 영업비밀 유지 부탁드립니다</p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-border p-4 lg:p-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded" />
              위치 정보
            </h2>
            {listing.isAddressPublic ? (
              <>
                <p className="text-sm text-foreground mb-3">
                  {listing.region} (역세권 도보 5분)
                </p>
                <div className="aspect-[16/9] bg-zinc-100 rounded-lg flex items-center justify-center text-muted text-sm">
                  지도 영역 (카카오맵 / 네이버맵 연동 예정)
                </div>
              </>
            ) : (
              <div className="aspect-[16/9] bg-zinc-50 rounded-lg flex flex-col items-center justify-center text-muted text-sm gap-2 border-2 border-dashed border-border">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 8L8 16M8 8l8 8"/></svg>
                <p className="font-semibold">주소 비공개 매물</p>
                <p className="text-xs">매도자에게 직접 문의 후 위치 확인이 가능합니다</p>
                <p className="text-xs text-foreground">표시 가능 지역: <span className="font-semibold">{listing.sido} {listing.sigungu}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact panel (sticky on desktop) */}
        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-muted mb-1">매도자에게 직접 연락하세요</p>
            <p className="text-[11px] text-muted mb-3">
              샵대장은 광고 플랫폼이며 거래 중개에 개입하지 않습니다.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${listing.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                전화걸기 {listing.useSecretNumber && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">안심번호</span>}
              </a>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#FEE500] text-black font-bold rounded-lg hover:opacity-90">
                <span>💬</span> 카카오톡 상담
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-border text-foreground font-semibold rounded-lg hover:bg-zinc-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                찜하기
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted">매물번호</span><span className="font-medium">{listing.id}</span></div>
              <div className="flex justify-between"><span className="text-muted">등록일</span><span className="font-medium">{formatRelativeDate(listing.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted">상태</span><span className="font-medium text-green-600">정상</span></div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <p className="font-bold mb-1">⚠️ 사기 피해 예방</p>
            <ul className="space-y-1 text-amber-800">
              <li>· 계약금/보증금을 미리 송금하지 마세요</li>
              <li>· 반드시 현장 방문 후 거래하세요</li>
              <li>· 의심스러운 매물은 신고해주세요</li>
            </ul>
          </div>

          <button className="w-full py-2 text-xs text-muted border border-border rounded hover:text-red-600 hover:border-red-300">
            🚨 매물 신고하기
          </button>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg lg:text-xl font-black mb-3">같은 업종의 다른 매물</h2>
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
