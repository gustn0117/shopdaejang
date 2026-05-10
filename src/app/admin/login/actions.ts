"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminSignIn(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  if (pw !== "1234") {
    redirect(`/admin/login?error=1&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const jar = await cookies();
  jar.set("admin_pass", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function adminSignOut() {
  const jar = await cookies();
  jar.delete("admin_pass");
  redirect("/");
}
