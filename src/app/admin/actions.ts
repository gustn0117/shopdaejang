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
