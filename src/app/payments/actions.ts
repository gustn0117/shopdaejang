"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { confirmTossPayment } from "@/lib/toss";
import { AD_PRICING } from "@/lib/data";
import type { AdTier } from "@/lib/types";

type CreateListingDraft = {
  title: string;
  description?: string;
  sido: string;
  sigungu: string;
  dong?: string;
  detail_address?: string;
  is_address_public: boolean;
  category: string;
  area: number;
  deposit: number;
  monthly_rent: number;
  premium: number;
  tier: AdTier;
  ad_period: string;
  thumbnail?: string;
  images: string[];
  features: string[];
  phone: string;
  use_secret_number: boolean;
  is_public: boolean;
};

function tierPrice(tier: AdTier, period: string): number | null {
  const item = AD_PRICING.find((p) => p.tier === tier);
  if (!item) return null;
  const price = item.prices.find((p) => p.period === period);
  return price ? price.price : null;
}

function orderName(tier: AdTier, period: string, title: string) {
  const tierLabel =
    AD_PRICING.find((p) => p.tier === tier)?.label ?? tier;
  return `[${tierLabel} ${period}] ${title.slice(0, 30)}`;
}

function genOrderId() {
  // Toss orderId: 영문/숫자, 하이픈, 언더스코어 6~64자
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createListingOrder(
  draft: CreateListingDraft
): Promise<
  | { ok: true; orderId: string; amount: number }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const amount = tierPrice(draft.tier, draft.ad_period);
  if (amount === null) return { ok: false, error: "유효하지 않은 광고 상품입니다." };
  if (amount === 0) {
    return { ok: false, error: "무료 상품은 결제가 필요 없습니다." };
  }

  const orderId = genOrderId();
  const admin = createAdminClient();
  const { error } = await admin.from("payments").insert({
    id: orderId,
    user_id: user.id,
    item: orderName(draft.tier, draft.ad_period, draft.title),
    method: "toss",
    amount,
    status: "pending",
    tier: draft.tier,
    period: draft.ad_period,
    flow: "create",
    pending_payload: draft,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, orderId, amount };
}

export async function createRenewOrder(input: {
  listing_id: number;
  tier: AdTier;
  period: string;
}): Promise<
  | { ok: true; orderId: string; amount: number }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { data: listing } = await supabase
    .from("listings")
    .select("id,user_id,title")
    .eq("id", input.listing_id)
    .maybeSingle();
  if (!listing || listing.user_id !== user.id) {
    return { ok: false, error: "본인 매물만 연장할 수 있습니다." };
  }

  const amount = tierPrice(input.tier, input.period);
  if (amount === null) return { ok: false, error: "유효하지 않은 광고 상품입니다." };
  if (amount === 0) {
    return { ok: false, error: "무료 상품은 결제가 필요 없습니다." };
  }

  const orderId = genOrderId();
  const admin = createAdminClient();
  const { error } = await admin.from("payments").insert({
    id: orderId,
    user_id: user.id,
    item: orderName(input.tier, input.period, listing.title as string),
    method: "toss",
    amount,
    status: "pending",
    tier: input.tier,
    period: input.period,
    flow: "renew",
    listing_id: input.listing_id,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, orderId, amount };
}

function periodToMonths(period: string) {
  if (period === "팔릴 때까지") return 12;
  if (period === "10일") return 10 / 30;
  const m = period.match(/(\d+)/);
  return m ? Number(m[1]) : 1;
}

function expiresAtFromNow(period: string, baseMs?: number) {
  const base = baseMs ?? Date.now();
  const days = period === "10일" ? 10 : Math.round(periodToMonths(period) * 30);
  return new Date(base + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function confirmCheckout(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<
  | { ok: true; redirect: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const admin = createAdminClient();
  const { data: order, error: fetchErr } = await admin
    .from("payments")
    .select("*")
    .eq("id", input.orderId)
    .maybeSingle();
  if (fetchErr || !order) return { ok: false, error: "주문 정보를 찾을 수 없습니다." };
  if (order.user_id !== user.id) {
    return { ok: false, error: "본인 주문만 승인할 수 있습니다." };
  }

  // 멱등성: 이미 paid 면 그대로 통과
  if (order.status === "paid") {
    return {
      ok: true,
      redirect:
        order.flow === "renew"
          ? "/mypage/listings"
          : `/listings/${order.listing_id ?? ""}`,
    };
  }

  if (Number(order.amount) !== input.amount) {
    await admin
      .from("payments")
      .update({ status: "failed", failed_reason: "amount_mismatch" })
      .eq("id", input.orderId);
    return { ok: false, error: "결제 금액이 일치하지 않습니다." };
  }

  const toss = await confirmTossPayment({
    paymentKey: input.paymentKey,
    orderId: input.orderId,
    amount: input.amount,
  });
  if (!toss.ok) {
    await admin
      .from("payments")
      .update({ status: "failed", failed_reason: toss.message })
      .eq("id", input.orderId);
    return { ok: false, error: toss.message };
  }

  const payment = toss.payment;
  const tier = order.tier as AdTier;
  const period = order.period as string;

  if (order.flow === "create") {
    const draft = order.pending_payload as CreateListingDraft;
    const { data: created, error: insErr } = await admin
      .from("listings")
      .insert({
        ...draft,
        user_id: user.id,
        status: "approved",
        ad_expires_at: expiresAtFromNow(period),
      })
      .select("id")
      .single();
    if (insErr || !created) {
      await admin
        .from("payments")
        .update({ status: "failed", failed_reason: insErr?.message ?? "listing_insert_failed" })
        .eq("id", input.orderId);
      return { ok: false, error: insErr?.message ?? "매물 생성 실패" };
    }

    await admin
      .from("payments")
      .update({
        status: "paid",
        payment_key: payment.paymentKey,
        method: payment.method ?? "toss",
        approved_at: payment.approvedAt ?? new Date().toISOString(),
        listing_id: created.id,
        raw: payment,
      })
      .eq("id", input.orderId);

    revalidatePath("/");
    revalidatePath("/mypage/listings");
    return { ok: true, redirect: `/listings/${created.id}` };
  }

  if (order.flow === "renew") {
    const listingId = order.listing_id as number | null;
    if (!listingId) return { ok: false, error: "연장 대상 매물이 없습니다." };

    const { data: existing } = await admin
      .from("listings")
      .select("ad_expires_at")
      .eq("id", listingId)
      .maybeSingle();
    const baseTs = existing?.ad_expires_at
      ? Math.max(Date.now(), new Date(existing.ad_expires_at as string).getTime())
      : Date.now();

    const { error: updErr } = await admin
      .from("listings")
      .update({
        tier,
        ad_period: period,
        ad_expires_at: expiresAtFromNow(period, baseTs),
        status: "approved",
        bumped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("user_id", user.id);
    if (updErr) {
      await admin
        .from("payments")
        .update({ status: "failed", failed_reason: updErr.message })
        .eq("id", input.orderId);
      return { ok: false, error: updErr.message };
    }

    await admin
      .from("payments")
      .update({
        status: "paid",
        payment_key: payment.paymentKey,
        method: payment.method ?? "toss",
        approved_at: payment.approvedAt ?? new Date().toISOString(),
        raw: payment,
      })
      .eq("id", input.orderId);

    revalidatePath("/");
    revalidatePath("/mypage/listings");
    revalidatePath(`/listings/${listingId}`);
    return { ok: true, redirect: "/mypage/listings" };
  }

  return { ok: false, error: "알 수 없는 주문 유형" };
}

export async function recordCheckoutFailure(input: {
  orderId: string;
  code?: string;
  message: string;
}) {
  const admin = createAdminClient();
  await admin
    .from("payments")
    .update({
      status: "failed",
      failed_reason: input.code ? `${input.code}: ${input.message}` : input.message,
    })
    .eq("id", input.orderId);
}
