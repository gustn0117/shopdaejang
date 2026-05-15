import { AD_PRICING } from "@/lib/data";
import { Icon } from "@/components/Icon";

export const metadata = { title: "광고 노출순서", robots: "noindex" };

const POSITION: Record<string, string> = {
  urgent: "메인 최상단 (큰 카드)",
  premium: "메인 중단 (사진형)",
  normal: "메인 하단 (텍스트)",
  free: "최하단 (텍스트)",
};

export default function AdConfigPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg lg:text-xl font-black tracking-tight">광고 상품별 노출순서</h1>
        <p className="text-xs text-muted mt-1">
          각 광고 등급의 노출 위치 · 자동 점프 주기 · 만료 처리 · 가격 정책을 확인합니다.
        </p>
      </div>

      <div className="bg-white border border-border rounded p-3 text-[12px] text-muted inline-flex items-start gap-2">
        <Icon.Info size={13} className="shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          이 페이지는 현재 적용 중인 정책을 보여줍니다. 가격·점프 주기 변경은 코드 또는 추후 정책 DB에서 직접 수정해주세요.
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {AD_PRICING.map((p, idx) => (
          <div
            key={p.tier}
            className="bg-white rounded-md border border-border p-5"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`shrink-0 px-2 py-1 rounded text-xs font-bold ${
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
                <span className="text-[11px] text-muted truncate">{p.description}</span>
              </div>
              <span className="shrink-0 text-[10px] text-muted tabular">{idx + 1}순위</span>
            </div>

            {/* 정책 행 */}
            <dl className="space-y-3 text-[13px]">
              <Row label="노출 위치">{POSITION[p.tier]}</Row>
              <Row label="자동 점프">{p.tier === "free" ? "없음" : "1시간마다"}</Row>
              <Row label="만료 처리">자동 비노출 + 매도자 알림 발송</Row>
              <Row label="기간 한도">
                {p.tier === "free"
                  ? "10일 (무료)"
                  : p.tier === "normal"
                  ? "최대 3개월"
                  : "최대 무제한"}
              </Row>
            </dl>

            {/* 가격 정책 */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-[11px] font-bold text-muted tracking-wide uppercase mb-3">
                가격 정책
              </p>
              <ul className="space-y-1.5">
                {p.prices.map((price) => (
                  <li
                    key={price.period}
                    className="flex items-center justify-between gap-2 text-[13px]"
                  >
                    <span className="text-muted">{price.period}</span>
                    <span className="font-bold tabular text-foreground">
                      {price.price === 0
                        ? "무료"
                        : `${price.price.toLocaleString()}원`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50 border border-border rounded p-4 text-[12px] text-muted leading-relaxed">
        <p className="font-bold text-foreground mb-1">참고</p>
        <ul className="space-y-1">
          <li>· 유료 매물(긴급·프리미엄·일반)은 1시간마다 가장 뒤의 2건부터 차례로 앞으로 점프됩니다.</li>
          <li>· 무료 매물은 등록 후 10일이 지나면 자동으로 비공개 처리됩니다.</li>
          <li>· 매도자가 결제 후 등급 변경을 요청하면 매물 승인 페이지에서 등급을 직접 변경할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted shrink-0">{label}</dt>
      <dd className="font-medium text-foreground text-right">{children}</dd>
    </div>
  );
}
