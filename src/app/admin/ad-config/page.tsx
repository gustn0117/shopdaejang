import { AD_PRICING } from "@/lib/data";

export const metadata = { title: "광고 노출순서", robots: "noindex" };

export default function AdConfigPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black">광고 상품별 노출순서 관리</h1>
      <p className="text-xs text-muted">
        각 광고 등급의 노출 순서, 점프 주기, 만료 처리를 설정합니다.
      </p>

      <div className="grid gap-3">
        {AD_PRICING.map((p, idx) => (
          <div key={p.tier} className="bg-white rounded-xl border border-border p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted">노출 순서 {idx + 1}순위</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                p.tier === "urgent" ? "badge-urgent" : p.tier === "premium" ? "badge-premium" : p.tier === "normal" ? "badge-normal" : "badge-free"
              }`}>
                {p.label}
              </span>
              <span className="text-xs text-muted">{p.description}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Field label="자동 점프 주기">
                <select className="w-full px-3 py-2 text-sm border border-border rounded">
                  <option>1시간 (기본)</option>
                  <option>30분</option>
                  <option>2시간</option>
                  <option>점프 없음</option>
                </select>
              </Field>
              <Field label="기본 노출 위치">
                <select className="w-full px-3 py-2 text-sm border border-border rounded">
                  <option>{p.tier === "urgent" ? "메인 최상단 (큰 카드)" : p.tier === "premium" ? "메인 중단 (사진형)" : p.tier === "normal" ? "메인 하단 (텍스트)" : "최하단 (텍스트)"}</option>
                </select>
              </Field>
              <Field label="만료 후 자동 처리">
                <select className="w-full px-3 py-2 text-sm border border-border rounded">
                  <option>비노출 + 알림 발송</option>
                  <option>비노출만</option>
                  <option>자동 갱신 (사용자 동의시)</option>
                </select>
              </Field>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-bold mb-2">가격 정책 (변경시 즉시 반영)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {p.prices.map((price) => (
                  <div key={price.period} className="flex items-center gap-1">
                    <span className="text-xs w-16 text-muted">{price.period}</span>
                    <input
                      type="number"
                      defaultValue={price.price}
                      className="flex-1 px-2 py-1.5 text-sm border border-border rounded"
                    />
                    <span className="text-xs text-muted">원</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 border border-border text-sm font-bold rounded-lg">취소</button>
        <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg">설정 저장</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold mb-1 block text-muted">{label}</label>
      {children}
    </div>
  );
}
