import { notFound, redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { TossPaymentWidget } from "@/components/TossPaymentWidget";
import { TOSS_CLIENT_KEY } from "@/lib/toss";
import { AD_PRICING } from "@/lib/data";

export const metadata = { title: "결제 진행", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  if (!orderId) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/payments/checkout/${orderId}`);

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("payments")
    .select("id,user_id,item,amount,status,tier,period")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();
  if (order.user_id !== user.id) {
    redirect("/mypage/listings");
  }
  if (order.status === "paid") {
    redirect("/mypage/listings");
  }
  if (order.status === "failed" || order.status === "canceled") {
    redirect(`/payments/fail?orderId=${orderId}&message=already_${order.status}`);
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const customerName =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.nickname === "string" && meta.nickname) ||
    "구매자";
  const tierLabel =
    AD_PRICING.find((p) => p.tier === order.tier)?.label ?? order.tier;

  return (
    <div className="container-custom py-6 lg:py-10 max-w-3xl">
      <h1 className="text-xl lg:text-2xl font-black tracking-tight mb-1">결제 진행</h1>
      <p className="text-sm text-muted mb-6">
        주문번호 <span className="tabular font-semibold text-foreground">{order.id}</span>
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">
        <div className="space-y-3 order-2 lg:order-1">
          <div className="bg-white border border-border rounded-md p-4">
            <h2 className="text-sm font-bold mb-3">결제수단</h2>
            <div id="payment-method" />
          </div>
          <div className="bg-white border border-border rounded-md p-4">
            <h2 className="text-sm font-bold mb-3">이용 약관</h2>
            <div id="agreement" />
          </div>
          <TossPaymentWidget
            clientKey={TOSS_CLIENT_KEY}
            customerKey={user.id}
            orderId={order.id}
            orderName={order.item as string}
            amount={Number(order.amount)}
            customerName={customerName}
            customerEmail={user.email ?? undefined}
          />
        </div>

        <aside className="order-1 lg:order-2">
          <div className="bg-white border border-border rounded-md p-4 lg:sticky lg:top-24">
            <h2 className="text-sm font-bold mb-3">주문 요약</h2>
            <dl className="space-y-2 text-sm">
              <Row label="상품" value={order.item as string} />
              <Row label="광고 상품" value={`${tierLabel} · ${order.period}`} />
              <div className="flex justify-between pt-3 border-t border-border">
                <dt className="text-muted">결제 금액</dt>
                <dd className="text-xl font-black tabular">
                  {Number(order.amount).toLocaleString()}원
                </dd>
              </div>
            </dl>
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              결제 완료 즉시 매물이 노출되며, 영수증은 마이페이지 결제내역에서 확인할 수 있습니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted shrink-0">{label}</dt>
      <dd className="font-semibold text-right line-clamp-2">{value}</dd>
    </div>
  );
}
