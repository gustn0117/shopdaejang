import { createAdminClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "결제 관리", robots: "noindex" };
export const dynamic = "force-dynamic";

async function fetchPayments() {
  const admin = createAdminClient();
  const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ data: list }, { data: todayPaid }, { count: refundReq }] = await Promise.all([
    admin
      .from("payments")
      .select("id,user_id,item,method,amount,status,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("payments")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", since24),
    admin
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "refund_requested"),
  ]);

  const todayTotal = (todayPaid ?? []).reduce(
    (sum: number, p: { amount: number }) => sum + Number(p.amount),
    0
  );

  return {
    payments: (list ?? []) as Array<{
      id: string;
      user_id: string | null;
      item: string;
      method: string;
      amount: number;
      status: string;
      created_at: string;
    }>,
    todayCount: list?.filter((p: { created_at: string }) => p.created_at >= since24).length ?? 0,
    todayTotal,
    refundReq: refundReq ?? 0,
  };
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  paid: { label: "결제완료", cls: "border-free text-free" },
  refunded: { label: "환불완료", cls: "border-border text-muted" },
  refund_requested: { label: "환불요청", cls: "border-urgent text-urgent" },
  failed: { label: "실패", cls: "border-urgent text-urgent" },
};

export default async function AdminPaymentsPage() {
  const { payments, todayCount, todayTotal, refundReq } = await fetchPayments();

  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">결제 관리</h1>

      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">오늘 결제건수</p>
          <p className="text-lg lg:text-2xl font-black mt-1 tabular">{todayCount}건</p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">오늘 결제금액</p>
          <p className="text-lg lg:text-2xl font-black mt-1 tabular">
            {todayTotal.toLocaleString()}원
          </p>
        </div>
        <div className="bg-white rounded-md border border-border p-3 lg:p-4">
          <p className="text-[11px] lg:text-xs text-muted">환불 대기</p>
          <p className="text-lg lg:text-2xl font-black mt-1 text-urgent tabular">{refundReq}건</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-md border border-border p-12 text-center">
          <Icon.Card size={28} className="mx-auto mb-3 text-muted" />
          <p className="text-sm font-semibold">아직 결제 내역이 없습니다.</p>
          <p className="text-xs text-muted mt-1">매도자가 광고 결제 시 이곳에 표시됩니다.</p>
        </div>
      ) : (
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
            {payments.map((p) => {
              const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.paid;
              return (
                <li
                  key={p.id}
                  className="grid grid-cols-2 md:grid-cols-[160px_100px_1fr_120px_100px_100px_100px] gap-2 px-3 py-3 text-sm items-center"
                >
                  <div className="text-xs font-mono">
                    {p.id}
                    <p className="text-[10px] text-muted">{formatRelativeDate(p.created_at)}</p>
                  </div>
                  <div className="text-xs truncate">{p.user_id?.slice(0, 8) ?? "—"}</div>
                  <div className="text-xs font-bold">{p.item}</div>
                  <div className="text-xs text-muted hidden md:block">{p.method}</div>
                  <div className="text-right font-black tabular">
                    {p.amount.toLocaleString()}원
                  </div>
                  <div className="text-center">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${s.cls}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div className="text-center">
                    <button type="button" className="px-2 py-1 text-[11px] border border-border rounded">
                      상세
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
