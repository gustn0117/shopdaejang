export const metadata = { title: "결제내역" };

const PAYMENTS = [
  { id: "P-2026050001", item: "긴급매물 1개월", listing: "강남 신축 마사지샵 권리인하 급매", method: "신용카드", amount: 90000, status: "결제완료", date: "2026-05-01" },
  { id: "P-2026042002", item: "프리미엄 3개월", listing: "수원 우량 스웨디시 매장 양도", method: "카카오페이", amount: 90000, status: "결제완료", date: "2026-04-20" },
  { id: "P-2026041003", item: "일반 1개월", listing: "부산 영도 아로마샵 매매", method: "계좌이체", amount: 30000, status: "결제완료", date: "2026-04-10" },
  { id: "P-2026040004", item: "긴급매물 무제한", listing: "대전 둔산동 스포츠샵 양도", method: "신용카드", amount: 170000, status: "환불완료", date: "2026-04-01" },
  { id: "P-2026032005", item: "일반 2개월", listing: "광주 동구 전통샵 매매", method: "네이버페이", amount: 50000, status: "결제완료", date: "2026-03-25" },
];

export default function PaymentsPage() {
  const total = PAYMENTS.filter((p) => p.status === "결제완료").reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">결제내역</h1>

      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">총 결제건수</p>
          <p className="text-lg lg:text-2xl font-black mt-1">{PAYMENTS.length}건</p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">총 결제금액</p>
          <p className="text-lg lg:text-2xl font-black mt-1 text-foreground">{total.toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">진행중 광고</p>
          <p className="text-lg lg:text-2xl font-black mt-1">2건</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[160px_1fr_120px_100px_100px_80px] gap-2 px-3 py-2.5 border-b border-border bg-zinc-50 text-[11px] font-bold text-muted">
          <div>주문번호</div>
          <div>광고 / 매물</div>
          <div>결제수단</div>
          <div className="text-right">금액</div>
          <div className="text-center">상태</div>
          <div className="text-center">영수증</div>
        </div>
        <ul className="divide-y divide-border">
          {PAYMENTS.map((p) => (
            <li key={p.id} className="grid grid-cols-2 md:grid-cols-[160px_1fr_120px_100px_100px_80px] gap-2 px-3 py-3 text-sm items-center">
              <div>
                <p className="text-xs text-muted">주문번호</p>
                <p className="text-xs font-mono">{p.id}</p>
                <p className="text-[10px] text-muted">{p.date}</p>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs font-bold">{p.item}</p>
                <p className="text-[11px] text-muted line-clamp-1">{p.listing}</p>
              </div>
              <div className="text-xs text-muted hidden md:block">{p.method}</div>
              <div className="text-right font-black">{p.amount.toLocaleString()}원</div>
              <div className="text-center">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${
                  p.status === "결제완료" ? "border-free text-free" : "border-border text-muted"
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="text-center">
                <button type="button" className="text-[11px] text-foreground hover:underline">영수증</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
