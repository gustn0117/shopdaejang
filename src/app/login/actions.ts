"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyCaptcha } from "@/lib/captcha";

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect(redirectTo);
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");

  // 자동등록방지 (간단 수식 캡차) 검증
  const captchaA = Number(formData.get("captcha_a"));
  const captchaB = Number(formData.get("captcha_b"));
  const captchaAnswer = Number(formData.get("captcha_answer"));
  const captchaToken = String(formData.get("captcha_token") ?? "");
  if (!verifyCaptcha(captchaA, captchaB, captchaAnswer, captchaToken)) {
    redirect(`/signup?error=${encodeURIComponent("자동등록방지 답이 올바르지 않습니다.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, name, phone });
  }
  redirect("/mypage");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
