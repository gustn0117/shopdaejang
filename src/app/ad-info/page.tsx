import Link from "next/link";
import { AD_PRICING } from "@/lib/data";
import { Icon } from "@/components/Icon";

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
    <div className="container-custom py-8 lg:py-14 space-y-12 lg:space-y-20">
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
        <div>
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-4">
            Pricing & Plans
          </p>
          <h1 className="h-display text-3xl lg:text-5xl">
            매물의 노출도를 높이는
            <br />
            <span className="text-muted-strong">샵대장 광고 상품</span>
          </h1>
          <p className="text-sm lg:text-base text-muted mt-5 max-w-md leading-relaxed">
            긴급매물, 프리미엄, 일반, 무료 — 매물의 성격에 맞는 상품을 선택하세요.
          </p>
          <Link
            href="/mypage/register"
            className="inline-flex items-center gap-1.5 mt-6 px-5 py-3 bg-foreground text-white font-semibold text-sm rounded-md hover:bg-foreground-soft"
          >
            <Icon.Plus size={14} strokeWidth={2.4} />
            매물 등록하기
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AD_PRICING.map((p) => (
          <div key={p.tier} className="surface-card p-5 lg:p-6 flex flex-col">
            <span
              className={`inline-block self-start px-2 py-1 rounded text-xs font-bold ${
                p.tier === "urgent" ? "badge-urgent" :
                p.tier === "premium" ? "badge-premium" :
                p.tier === "normal" ? "badge-normal" :
                "badge-free"
              }`}
            >
              {p.label}
            </span>
            <p className="text-xs text-muted mt-3 mb-4 h-8 leading-snug">{p.description}</p>

            <ul className="space-y-2 mb-5">
              {p.prices.map((price) => (
                <li
                  key={price.period}
                  className={`flex items-center justify-between p-3 rounded border ${
                    price.isFeatured ? "border-foreground bg-primary-soft" : "border-border"
                  }`}
                >
                  <div>
                    {price.isFeatured && <span className="text-[10px] font-bold text-foreground block">추천</span>}
                    <span className="text-xs font-bold">{price.period}</span>
                  </div>
                  <span className="font-black text-sm tabular">
                    {price.price === 0 ? "무료" : `${(price.price / 10000).toFixed(1).replace(".0", "")}만원`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4 mt-auto">
              <p className="text-[11px] font-bold mb-2 text-muted tracking-wide">상품 혜택</p>
              <ul className="space-y-1.5">
                {p.benefits.map((b) => (
                  <li key={b} className="text-[12px] text-foreground/80 flex items-start gap-1.5">
                    <Icon.Check size={12} strokeWidth={2.5} className="text-foreground shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle eyebrow="Comparison" title="광고 상품 비교" />
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-150">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-xs text-muted">기능</th>
                <th className="p-4">
                  <span className="badge-urgent inline-block px-2 py-0.5 rounded text-xs">긴급</span>
                </th>
                <th className="p-4">
                  <span className="badge-premium inline-block px-2 py-0.5 rounded text-xs">프리미엄</span>
                </th>
                <th className="p-4">
                  <span className="badge-normal inline-block px-2 py-0.5 rounded text-xs">일반</span>
                </th>
                <th className="p-4">
                  <span className="badge-free inline-block px-2 py-0.5 rounded text-xs">무료</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_TABLE.map((row, i) => (
                <tr key={row.feature} className={i !== FEATURE_TABLE.length - 1 ? "border-b border-border" : ""}>
                  <td className="p-4 font-semibold text-xs">{row.feature}</td>
                  {(["urgent", "premium", "normal", "free"] as const).map((t) => {
                    const v = row[t];
                    return (
                      <td key={t} className="p-4 text-center text-xs">
                        {typeof v === "boolean" ? (
                          v ? (
                            <Icon.Check size={14} strokeWidth={2.5} className="inline text-foreground" />
                          ) : (
                            <span className="text-zinc-300">—</span>
                          )
                        ) : v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Process" title="매물 등록 절차" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { n: "01", t: "회원가입", d: "이메일로 1초 가입" },
            { n: "02", t: "매물 등록", d: "정보 입력 + 사진 업로드" },
            { n: "03", t: "광고 결제", d: "광고 상품 선택 후 결제" },
            { n: "04", t: "관리자 승인", d: "검수 후 노출 (2~6시간)" },
          ].map((s) => (
            <div key={s.n} className="surface-card p-5">
              <p className="text-2xl font-black tabular text-muted mb-3">{s.n}</p>
              <h3 className="font-bold text-sm mb-1">{s.t}</h3>
              <p className="text-xs text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="FAQ" title="자주 묻는 질문" />
        <div className="surface-card overflow-hidden divide-y divide-border">
          {[
            { q: "광고비는 환불 가능한가요?", a: "노출 시작 전까지는 100% 환불 가능합니다. 노출 시작 후에는 잔여 기간 안분 환불됩니다." },
            { q: "유료 매물은 자동으로 점프되나요?", a: "유료 매물(긴급/프리미엄/일반)은 1시간마다 자동 점프되어 항상 상위에 노출됩니다." },
            { q: "광고 기간이 끝나면 어떻게 되나요?", a: "기간 만료 시 자동으로 비노출 처리되며, 매물 정보는 마이페이지에서 확인 가능합니다. 연장 결제 시 다시 노출됩니다." },
            { q: "매물 수정이 가능한가요?", a: "마이페이지에서 언제든 매물 정보 수정이 가능합니다. 단, 수정 시 다시 관리자 승인 절차를 거칩니다." },
          ].map((f, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer px-5 py-4 font-semibold text-sm flex items-center justify-between list-none hover:bg-primary-soft">
                <span>Q. {f.q}</span>
                <Icon.ChevronDown size={14} className="text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-foreground/80 leading-relaxed">A. {f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="bg-foreground text-white rounded-md p-8 lg:p-12 text-center">
        <h2 className="h-display text-2xl lg:text-3xl mb-2">
          지금 바로 매물을 등록하세요
        </h2>
        <p className="text-sm text-white/70 mb-6">
          간편한 매물 등록과 다양한 광고 상품으로 빠른 거래를 도와드립니다.
        </p>
        <Link
          href="/mypage/register"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-white text-foreground font-semibold rounded-md hover:bg-zinc-100 transition-colors"
        >
          매물 등록하러 가기
          <Icon.ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted mb-1.5">
        {eyebrow}
      </p>
      <h2 className="text-xl lg:text-2xl font-black tracking-tight">{title}</h2>
    </div>
  );
}
