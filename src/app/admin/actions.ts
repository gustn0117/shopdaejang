"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const jar = await cookies();
  if (jar.get("admin_pass")?.value !== "ok") {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

export async function approveListing(id: number) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("listings").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/");
}

export async function rejectListing(id: number) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("listings").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/listings");
}

export async function changeListingTier(
  id: number,
  tier: "urgent" | "premium" | "normal" | "free"
) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("listings")
    .update({ tier, bumped_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/listings");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/");
}

export async function deleteNotice(id: number) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("notices").delete().eq("id", id);
  revalidatePath("/admin/notices");
  revalidatePath("/notice");
}

export async function togglePinNotice(id: number, pinned: boolean) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("notices").update({ is_pinned: !pinned }).eq("id", id);
  revalidatePath("/admin/notices");
  revalidatePath("/notice");
}

export type AdminListingPayload = {
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
  tier: "urgent" | "premium" | "normal" | "free";
  ad_period: string;
  ad_duration_days?: number;
  thumbnail?: string;
  images: string[];
  features: string[];
  phone: string;
  use_secret_number: boolean;
  is_public: boolean;
};

export async function adminCreateListing(
  payload: AdminListingPayload
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  await assertAdmin();
  const admin = createAdminClient();

  const days = payload.ad_duration_days ?? defaultDurationDays(payload.ad_period);
  const adExpiresAt = days
    ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { ad_duration_days: _ignore, ...row } = payload;
  void _ignore;
  const { data, error } = await admin
    .from("listings")
    .insert({
      ...row,
      user_id: null,
      status: "approved",
      ad_expires_at: adExpiresAt,
      bumped_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/admin/listings");
  return { ok: true, id: data.id as number };
}

function defaultDurationDays(period: string): number {
  if (period === "10일") return 10;
  if (period === "팔릴 때까지") return 365;
  const m = period.match(/(\d+)/);
  return m ? Number(m[1]) * 30 : 30;
}

export async function suspendUser(userId: string, days = 365) {
  await assertAdmin();
  const admin = createAdminClient();
  const banDuration = `${days * 24}h`; // Supabase ban_duration: '24h', '720h' 등
  const { error } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: banDuration,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function unsuspendUser(userId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: "none",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function createNotice(formData: FormData) {
  await assertAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const isPinned = formData.get("is_pinned") === "on";
  if (!title || !content) return;
  const admin = createAdminClient();
  await admin.from("notices").insert({ title, content, is_pinned: isPinned });
  revalidatePath("/admin/notices");
  revalidatePath("/notice");
}
