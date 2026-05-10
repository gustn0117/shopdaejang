"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function toggleFavorite(
  listingId: number
): Promise<{ ok: true; favorited: boolean } | { ok: false; reason: "auth" }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "auth" };

  const { data: existing } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);
    revalidatePath(`/listings/${listingId}`);
    revalidatePath(`/mypage/favorites`);
    return { ok: true, favorited: false };
  }

  await supabase.from("favorites").insert({
    user_id: user.id,
    listing_id: listingId,
  });
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/mypage/favorites`);
  return { ok: true, favorited: true };
}

export async function incrementListingView(id: number) {
  // 30분 내 동일 매물 재조회는 카운트하지 않음 (쿠키 기반 throttle)
  const jar = await cookies();
  const key = `vw_${id}`;
  if (jar.get(key)?.value) return;

  try {
    const admin = createAdminClient();
    await admin.rpc("increment_listing_view", { p_id: id });
    jar.set(key, "1", {
      maxAge: 60 * 30, // 30 minutes
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
  } catch {
    // 조회수 실패는 페이지 렌더를 막지 않음
  }
}

export async function requireLogin(redirectTo: string) {
  redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
}
