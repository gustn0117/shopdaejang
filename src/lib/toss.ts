// 토스페이먼츠 서버 헬퍼
// 공식 테스트 키 (Toss 공개): https://docs.tosspayments.com/reference/test-key
// env 가 없으면 결제위젯 공식 테스트 키로 폴백.

export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ??
  "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY ?? "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

const TOSS_API = "https://api.tosspayments.com/v1";

type TossPaymentResponse = {
  paymentKey: string;
  orderId: string;
  status:
    | "READY"
    | "IN_PROGRESS"
    | "DONE"
    | "CANCELED"
    | "PARTIAL_CANCELED"
    | "ABORTED"
    | "EXPIRED";
  method?: string;
  totalAmount: number;
  approvedAt?: string;
  receipt?: { url?: string };
  card?: { number?: string; company?: string };
  message?: string;
  code?: string;
};

function authHeader() {
  const token = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  return `Basic ${token}`;
}

export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<
  | { ok: true; payment: TossPaymentResponse }
  | { ok: false; code?: string; message: string }
> {
  const res = await fetch(`${TOSS_API}/payments/confirm`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const body = (await res.json()) as TossPaymentResponse;

  if (!res.ok) {
    return {
      ok: false,
      code: body.code,
      message: body.message ?? `Toss confirm failed (${res.status})`,
    };
  }
  return { ok: true, payment: body };
}

export async function cancelTossPayment(input: {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
}): Promise<
  | { ok: true; payment: TossPaymentResponse }
  | { ok: false; code?: string; message: string }
> {
  const { paymentKey, ...payload } = input;
  const res = await fetch(`${TOSS_API}/payments/${encodeURIComponent(paymentKey)}/cancel`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body = (await res.json()) as TossPaymentResponse;
  if (!res.ok) {
    return { ok: false, code: body.code, message: body.message ?? "Toss cancel failed" };
  }
  return { ok: true, payment: body };
}

export type { TossPaymentResponse };
