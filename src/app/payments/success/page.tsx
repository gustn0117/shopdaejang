import Link from "next/link";
import { redirect } from "next/navigation";
import { confirmCheckout } from "../actions";
import { Icon } from "@/components/Icon";

export const metadata = { title: "결제 처리", robots: "noindex" };
export const dynamic = "force-dynamic";

type SP = Promise<{
  paymentKey?: string;
  orderId?: string;
  amount?: string;
}>;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const { paymentKey, orderId, amount } = sp;

  if (!paymentKey || !orderId || !amount) {
    return (
      <ErrorScreen message="결제 정보가 누락되었습니다." orderId={orderId ?? ""} />
    );
  }

  const result = await confirmCheckout({
    paymentKey,
    orderId,
    amount: Number(amount),
  });

  if (result.ok) {
    redirect(`${result.redirect}?paid=1`);
  }

  return <ErrorScreen message={result.error} orderId={orderId} />;
}

function ErrorScreen({ message, orderId }: { message: string; orderId: string }) {
  return (
    <div className="container-custom py-16 max-w-md text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-urgent/10 text-urgent mb-4">
        <Icon.Warning size={28} strokeWidth={2} />
      </div>
      <h1 className="text-xl font-black mb-2">결제 승인 실패</h1>
      <p className="text-sm text-muted mb-1">{message}</p>
      {orderId && (
        <p className="text-[11px] text-muted tabular mb-6">주문번호 {orderId}</p>
      )}
      <div className="flex gap-2 justify-center">
        <Link
          href="/mypage/listings"
          className="px-5 py-2.5 border border-border font-bold rounded"
        >
          내 매물로
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 bg-foreground text-white font-bold rounded"
        >
          문의하기
        </Link>
      </div>
    </div>
  );
}
