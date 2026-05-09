"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role ?? user?.user_metadata?.role;
  if (!user || role !== "admin") {
    throw new Error("관리자 권한이 필요합니다.");
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
