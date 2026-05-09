export const metadata = { title: "결제 관리", robots: "noindex" };

const PAYMENTS = [
  { id: "P-2026050001", user: "홍길동", item: "긴급매물 1개월", method: "신용카드", amount: 90000, status: "결제완료", date: "2026-05-09 10:23" },
  { id: "P-2026050002", user: "김철수", item: "프리미엄 3개월", method: "카카오페이", amount: 90000, status: "결제완료", date: "2026-05-09 09:11" },
  { id: "P-2026050003", user: "이영희", item: "일반 1개월", method: "계좌이체", amount: 30000, status: "환불요청", date: "2026-05-09 08:45" },
  { id: "P-2026050004", user: "박민수", item: "긴급매물 무제한", method: "신용카드", amount: 170000, status: "결제완료", date: "2026-05-08 22:01" },
  { id: "P-2026050005", user: "최지원", item: "일반 2개월", method: "네이버페이", amount: 50000, status: "환불완료", date: "2026-05-08 18:30" },
];

export default function AdminPaymentsPage() {
  const total = PAYMENTS.filter((p) => p.status === "결제완료").reduce((acc, p) => acc + p.amount, 0);
  const refundReq = PAYMENTS.filter((p) => p.status === "환불요청").length;

  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">결제 관리</h1>

      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">오늘 결제건수</p>
          <p className="text-lg lg:text-2xl font-black mt-1">{PAYMENTS.length}건</p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">오늘 결제금액</p>
          <p className="text-lg lg:text-2xl font-black mt-1">{total.toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">환불 대기</p>
          <p className="text-lg lg:text-2xl font-black mt-1 text-urgent">{refundReq}건</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[160px_100px_1fr_120px_100px_100px_100px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
          <div>주문번호</div>
          <div>회원</div>
          <div>광고 상품</div>
          <div>결제수단</div>
          <div className="text-right">금액</div>
          <div className="text-center">상태</div>
          <div className="text-center">처리</div>
        </div>
        <ul className="divide-y divide-border">
          {PAYMENTS.map((p) => (
            <li key={p.id} className="grid grid-cols-2 md:grid-cols-[160px_100px_1fr_120px_100px_100px_100px] gap-2 px-3 py-3 text-sm items-center">
              <div className="text-xs font-mono">{p.id}<p className="text-[10px] text-muted">{p.date}</p></div>
              <div className="text-xs">{p.user}</div>
              <div className="text-xs font-bold">{p.item}</div>
              <div className="text-xs text-muted hidden md:block">{p.method}</div>
              <div className="text-right font-black">{p.amount.toLocaleString()}원</div>
              <div className="text-center">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${
                  p.status === "결제완료" ? "border-free text-free" :
                  p.status === "환불요청" ? "border-urgent text-urgent" :
                  "border-border text-muted"
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="text-center">
                <button type="button" className="px-2 py-1 text-[11px] border border-border rounded">상세</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
