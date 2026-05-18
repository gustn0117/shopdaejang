import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription ?? error)}`,
        url.origin
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeErr) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(exchangeErr.message)}`, url.origin)
    );
  }

  const user = data.user;
  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const phone =
      (typeof meta.phone === "string" && meta.phone) ||
      (typeof user.phone === "string" && user.phone) ||
      "";
    const name =
      (typeof meta.name === "string" && meta.name) ||
      (typeof meta.nickname === "string" && meta.nickname) ||
      (typeof meta.full_name === "string" && meta.full_name) ||
      "";

    const admin = createAdminClient();
    await admin
      .from("profiles")
      .upsert({ id: user.id, name, phone }, { onConflict: "id" });

    if (!phone) {
      return NextResponse.redirect(
        new URL(
          `/onboarding?redirect=${encodeURIComponent(redirectTo)}`,
          url.origin
        )
      );
    }
  }

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
