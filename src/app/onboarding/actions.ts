"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function saveOnboarding(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const phone = phoneRaw.replace(/[^0-9-]/g, "");
  const redirectTo = String(formData.get("redirect") ?? "/");

  if (!name || name.length < 1) {
    redirect(`/onboarding?error=${encodeURIComponent("이름을 입력해주세요.")}&redirect=${encodeURIComponent(redirectTo)}`);
  }
  if (phone.replace(/-/g, "").length < 9) {
    redirect(`/onboarding?error=${encodeURIComponent("휴대폰 번호를 정확히 입력해주세요.")}&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  await supabase.auth.updateUser({
    data: { ...meta, name, phone },
  });

  const admin = createAdminClient();
  await admin
    .from("profiles")
    .upsert({ id: user.id, name, phone }, { onConflict: "id" });

  redirect(redirectTo);
}
