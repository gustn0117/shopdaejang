import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

type NaverProfile = {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    name?: string;
    nickname?: string;
    mobile?: string;
    mobile_e164?: string;
  };
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errParam = url.searchParams.get("error");

  if (errParam) {
    return redirectWithError(url.origin, errParam);
  }
  if (!code || !state) {
    return redirectWithError(url.origin, "missing_code_or_state");
  }

  const expectedState = request.cookies.get("naver_oauth_state")?.value;
  const redirect = request.cookies.get("naver_oauth_redirect")?.value ?? "/";
  if (!expectedState || expectedState !== state) {
    return redirectWithError(url.origin, "invalid_state");
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectWithError(url.origin, "네이버 로그인이 설정되지 않았습니다.");
  }

  // 1) Naver code → access token
  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${encodeURIComponent(
      clientId
    )}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(state)}`,
    { method: "GET", cache: "no-store" }
  );
  if (!tokenRes.ok) {
    return redirectWithError(url.origin, "naver_token_failed");
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenJson.access_token) {
    return redirectWithError(url.origin, tokenJson.error ?? "naver_token_failed");
  }

  // 2) Naver access token → user profile
  const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    cache: "no-store",
  });
  if (!profileRes.ok) {
    return redirectWithError(url.origin, "naver_profile_failed");
  }
  const profile = (await profileRes.json()) as NaverProfile;
  if (profile.resultcode !== "00" || !profile.response) {
    return redirectWithError(url.origin, profile.message || "naver_profile_failed");
  }

  const naverId = profile.response.id;
  const email =
    profile.response.email && profile.response.email.length > 0
      ? profile.response.email
      : `naver_${naverId}@social.shopdaejang.local`;
  const name =
    profile.response.name ?? profile.response.nickname ?? "네이버 사용자";
  const naverPhone = profile.response.mobile_e164 ?? profile.response.mobile ?? "";

  // 3) Supabase admin: get or create user
  const admin = createAdminClient();

  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      provider: "naver",
      naver_id: naverId,
      name,
      ...(naverPhone ? { phone: naverPhone } : {}),
    },
  });

  let userId: string | null = created.data.user?.id ?? null;

  if (created.error) {
    // already exists → look up and (optionally) refresh metadata
    const msg = created.error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = listed.data.users.find((u) => u.email === email);
      if (!existing) {
        return redirectWithError(url.origin, "user_lookup_failed");
      }
      userId = existing.id;
      const existingMeta = (existing.user_metadata ?? {}) as Record<string, unknown>;
      // Preserve user-entered phone; only fill what's missing
      await admin.auth.admin.updateUserById(existing.id, {
        user_metadata: {
          ...existingMeta,
          provider: existingMeta.provider ?? "naver",
          naver_id: naverId,
          name: existingMeta.name ?? name,
          ...(naverPhone && !existingMeta.phone ? { phone: naverPhone } : {}),
        },
      });
    } else {
      return redirectWithError(url.origin, created.error.message);
    }
  }

  if (!userId) {
    return redirectWithError(url.origin, "user_create_failed");
  }

  // 4) Issue magic-link token, then exchange for session cookies
  const link = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const hashed = link.data.properties?.hashed_token;
  if (link.error || !hashed) {
    return redirectWithError(url.origin, link.error?.message ?? "link_failed");
  }

  const supabase = await createClient();
  const verify = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: hashed,
  });
  if (verify.error) {
    return redirectWithError(url.origin, verify.error.message);
  }

  // 5) Upsert profiles
  const finalUser = verify.data.user;
  if (finalUser) {
    const meta = (finalUser.user_metadata ?? {}) as Record<string, unknown>;
    const phoneForProfile =
      (typeof meta.phone === "string" && meta.phone) || naverPhone || "";
    await admin
      .from("profiles")
      .upsert(
        { id: finalUser.id, name, phone: phoneForProfile },
        { onConflict: "id" }
      );

    if (!phoneForProfile) {
      const onboardUrl = new URL(
        `/onboarding?redirect=${encodeURIComponent(redirect)}`,
        url.origin
      );
      const res = NextResponse.redirect(onboardUrl);
      clearOauthCookies(res);
      return res;
    }
  }

  const res = NextResponse.redirect(new URL(redirect, url.origin));
  clearOauthCookies(res);
  return res;
}

function clearOauthCookies(res: NextResponse) {
  res.cookies.set("naver_oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("naver_oauth_redirect", "", { path: "/", maxAge: 0 });
}

function redirectWithError(origin: string, message: string) {
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(message)}`, origin)
  );
}
