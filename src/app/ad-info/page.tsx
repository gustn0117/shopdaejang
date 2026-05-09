import Link from "next/link";
import { AD_PRICING } from "@/lib/data";

export const metadata = {
  title: "광고안내",
  description: "샵대장 광고 상품 안내 - 긴급매물, 프리미엄, 일반, 무료",
};

const FEATURE_TABLE = [
  { feature: "메인 페이지 노출", urgent: "최상단 큰 썸네일", premium: "중단 사진 카드", normal: "하단 텍스트", free: "최하단 텍스트" },
  { feature: "1시간마다 자동 점프", urgent: true, premium: true, normal: true, free: false },
  { feature: "검색결과 우선노출", urgent: true, premium: true, normal: false, free: false },
  { feature: "찜 알림 전송", urgent: true, premium: true, normal: false, free: false },
  { feature: "지도/지역 모음 노출", urgent: true, premium: true, normal: true, free: true },
  { feature: "기간 한도", urgent: "최대 무제한", premium: "최대 무제한", normal: "최대 3개월", free: "10일" },
];

export default function AdInfoPage() {
  return (
    <div className="container-custom py-4 lg:py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 lg:p-10 text-white mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-8" />
        <div className="relative max-w-2xl">
          <span className="inline-block px-2 py-0.5 bg-white/20 text-[11px] font-semibold rounded mb-2">
            ShopDaejang Advertising
          </span>
          <h1 className="text-2xl lg:text-4xl font-black mb-2">
            매물의 노출도를 높이는
            <br />
            샵대장 광고 상품
          </h1>
          <p className="text-sm lg:text-base text-white/90 mb-4">
            긴급매물, 프리미엄, 일반, 무료 - 매물 성격에 맞는 최적의 광고 상품을 선택하세요.
          </p>
          <Link href="/mypage/register" className="inline-flex items-center gap-1 px-5 py-3 bg-white text-primary font-bold rounded-lg">
            매물 등록하기 →
          </Link>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {AD_PRICING.map((p) => (
          <div key={p.tier} className="bg-white rounded-2xl border-2 border-border p-4 lg:p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  p.tier === "urgent" ? "badge-urgent" :
                  p.tier === "premium" ? "badge-premium" :
                  p.tier === "normal" ? "badge-normal" :
                  "badge-free"
                }`}
              >
                {p.label}
              </span>
            </div>
            <p className="text-xs text-muted mb-3 h-8">{p.description}</p>

            <ul className="space-y-2 mb-4">
              {p.prices.map((price) => (
                <li
                  key={price.period}
                  className={`flex items-center justify-between p-2.5 rounded-lg border ${
                    price.isFeatured ? "border-primary bg-primary-light" : "border-border"
                  }`}
                >
                  <div>
                    {price.isFeatured && <span className="text-[10px] font-bold text-primary block">추천</span>}
                    <span className="text-xs font-bold">{price.period}</span>
                  </div>
                  <span className="font-black text-sm">
                    {price.price === 0 ? "무료" : `${(price.price / 10000).toFixed(1).replace(".0", "")}만원`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-3 mt-auto">
              <p className="text-[11px] font-bold mb-1.5 text-muted">상품 혜택</p>
              <ul className="space-y-1">
                {p.benefits.map((b) => (
                  <li key={b} className="text-[11px] text-foreground/80 flex items-start gap-1">
                    <span className="text-primary shrink-0">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <section className="bg-white rounded-2xl border border-border p-4 lg:p-6 mb-6">
        <h2 className="text-base lg:text-lg font-black mb-3">광고 상품 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-3 bg-zinc-50 border border-border font-bold text-xs">기능</th>
                <th className="p-3 bg-zinc-50 border border-border">
                  <span className="badge-urgent inline-block px-2 py-0.5 rounded text-xs">긴급</span>
                </th>
                <th className="p-3 bg-zinc-50 border border-border">
                  <span className="badge-premium inline-block px-2 py-0.5 rounded text-xs">프리미엄</span>
                </th>
                <th className="p-3 bg-zinc-50 border border-border">
                  <span className="badge-normal inline-block px-2 py-0.5 rounded text-xs">일반</span>
                </th>
                <th className="p-3 bg-zinc-50 border border-border">
                  <span className="badge-free inline-block px-2 py-0.5 rounded text-xs">무료</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_TABLE.map((row) => (
                <tr key={row.feature}>
                  <td className="p-3 border border-border font-semibold text-xs">{row.feature}</td>
                  {(["urgent", "premium", "normal", "free"] as const).map((t) => {
                    const v = row[t];
                    return (
                      <td key={t} className="p-3 border border-border text-center text-xs">
                        {typeof v === "boolean" ? (v ? <span className="text-green-600 font-bold">✓</span> : <span className="text-zinc-300">—</span>) : v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white rounded-2xl border border-border p-4 lg:p-6 mb-6">
        <h2 className="text-base lg:text-lg font-black mb-3">매물 등록 절차</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { n: "1", t: "회원가입", d: "네이버/카카오/구글 간편 가입" },
            { n: "2", t: "매물 등록", d: "정보 입력 + 사진 업로드" },
            { n: "3", t: "광고 결제", d: "광고 상품 선택 후 결제" },
            { n: "4", t: "관리자 승인", d: "검수 후 노출 (평균 2~6시간)" },
          ].map((s) => (
            <div key={s.n} className="bg-primary-light rounded-xl p-4 text-center">
              <div className="w-8 h-8 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-black mb-2">
                {s.n}
              </div>
              <h3 className="font-bold text-sm mb-1">{s.t}</h3>
              <p className="text-xs text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white rounded-2xl border border-border p-4 lg:p-6 mb-6">
        <h2 className="text-base lg:text-lg font-black mb-3">자주 묻는 질문</h2>
        <div className="space-y-2">
          {[
            { q: "광고비는 환불 가능한가요?", a: "노출 시작 전까지는 100% 환불 가능합니다. 노출 시작 후에는 잔여 기간 안분 환불됩니다." },
            { q: "유료 매물은 자동으로 점프되나요?", a: "유료 매물(긴급/프리미엄/일반)은 1시간마다 자동 점프되어 항상 상위에 노출됩니다." },
            { q: "광고 기간이 끝나면 어떻게 되나요?", a: "기간 만료 시 자동으로 비노출 처리되며, 매물 정보는 마이페이지에서 확인 가능합니다. 연장 결제 시 다시 노출됩니다." },
            { q: "매물 수정이 가능한가요?", a: "마이페이지에서 언제든 매물 정보 수정이 가능합니다. 단, 수정 시 다시 관리자 승인 절차를 거칩니다." },
          ].map((f, i) => (
            <details key={i} className="bg-zinc-50 rounded-lg border border-border group">
              <summary className="cursor-pointer px-4 py-3 font-bold text-sm flex items-center justify-between">
                <span>Q. {f.q}</span>
                <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-foreground/80">A. {f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="bg-foreground rounded-2xl p-6 lg:p-10 text-white text-center">
        <h2 className="text-xl lg:text-2xl font-black mb-2">지금 바로 매물을 등록하세요</h2>
        <p className="text-sm text-white/80 mb-4">간편한 매물 등록과 다양한 광고 상품으로 빠른 거래를 도와드립니다.</p>
        <Link href="/mypage/register" className="inline-flex items-center gap-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">
          매물 등록하러 가기 →
        </Link>
      </div>
    </div>
  );
}
