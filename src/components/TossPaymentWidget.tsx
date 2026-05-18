"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

type TossWidgets = Awaited<
  ReturnType<Awaited<ReturnType<typeof loadTossPayments>>["widgets"]>
>;

export function TossPaymentWidget({
  clientKey,
  customerKey,
  orderId,
  orderName,
  amount,
  customerName,
  customerEmail,
}: {
  clientKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
}) {
  const widgetsRef = useRef<TossWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        if (canceled) return;
        const widgets = tossPayments.widgets({ customerKey });
        await widgets.setAmount({ currency: "KRW", value: amount });
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
        if (canceled) return;
        widgetsRef.current = widgets;
        setReady(true);
      } catch (e) {
        if (!canceled) {
          setError(e instanceof Error ? e.message : "결제 위젯 로드 실패");
        }
      }
    })();
    return () => {
      canceled = true;
    };
  }, [clientKey, customerKey, amount]);

  async function onPay() {
    const widgets = widgetsRef.current;
    if (!widgets) return;
    setSubmitting(true);
    setError(null);
    try {
      const origin = window.location.origin;
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${origin}/payments/success`,
        failUrl: `${origin}/payments/fail`,
        customerEmail,
        customerName,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "결제 요청 실패");
      setSubmitting(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-xs text-urgent bg-white border border-urgent/30 rounded p-3 mb-3">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onPay}
        disabled={!ready || submitting}
        className="w-full py-3.5 bg-foreground text-white font-black rounded-md hover:bg-foreground/90 disabled:bg-zinc-300 disabled:cursor-not-allowed"
      >
        {!ready
          ? "결제 위젯 로드 중..."
          : submitting
          ? "결제창 여는 중..."
          : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}
