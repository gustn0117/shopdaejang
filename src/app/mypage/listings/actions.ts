"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EditListingPayload = {
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
  thumbnail?: string;
  images: string[];
  features: string[];
  phone: string;
  use_secret_number: boolean;
  is_public: boolean;
};

export async function updateListing(
  id: number,
  payload: EditListingPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  // 소유권 검증
  const { data: existing, error: fetchErr } = await supabase
    .from("listings")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) return { ok: false, error: fetchErr.message };
  if (!existing) return { ok: false, error: "매물을 찾을 수 없습니다." };
  if (existing.user_id !== user.id) {
    return { ok: false, error: "본인 매물만 수정할 수 있습니다." };
  }

  const { error } = await supabase
    .from("listings")
    .update({
      ...payload,
      status: "pending", // 수정 시 재심사
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/listings/${id}`);
  revalidatePath("/mypage/listings");
  revalidatePath(`/mypage/listings/${id}/edit`);
  return { ok: true };
}

export async function deleteListing(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/mypage/listings`);
  }
  // RLS 미사용 환경이므로 user_id 매칭으로 안전 보장
  await supabase.from("listings").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/mypage/listings");
  redirect("/mypage/listings");
}
