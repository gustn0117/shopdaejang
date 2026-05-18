import Link from "next/link";
import { recordCheckoutFailure } from "../actions";
import { Icon } from "@/components/Icon";

export const metadata = { title: "결제 실패", robots: "noindex" };
export const dynamic = "force-dynamic";

type SP = Promise<{
  code?: string;
  message?: string;
  orderId?: string;
}>;

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const code = sp.code ?? "";
  const message = sp.message ?? "결제가 완료되지 않았습니다.";
  const orderId = sp.orderId ?? "";

  if (orderId) {
    await recordCheckoutFailure({ orderId, code, message });
  }

  return (
    <div className="container-custom py-16 max-w-md text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-urgent/10 text-urgent mb-4">
        <Icon.X size={28} strokeWidth={2.5} />
      </div>
      <h1 className="text-xl font-black mb-2">결제 실패</h1>
      <p className="text-sm text-muted mb-1">{decodeURIComponent(message)}</p>
      {code && <p className="text-[11px] text-muted tabular mb-1">code: {code}</p>}
      {orderId && (
        <p className="text-[11px] text-muted tabular mb-6">주문번호 {orderId}</p>
      )}
      <div className="flex gap-2 justify-center mt-4">
        <Link
          href="/mypage/listings"
          className="px-5 py-2.5 border border-border font-bold rounded"
        >
          내 매물로
        </Link>
        <Link
          href="/mypage/register"
          className="px-5 py-2.5 bg-foreground text-white font-bold rounded"
        >
          다시 시도
        </Link>
      </div>
    </div>
  );
}
