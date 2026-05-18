import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // 관리자: 비밀번호 쿠키 기반 (Supabase Auth와 무관)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname.startsWith("/admin/login")) {
      return supabaseResponse;
    }
    const adminPass = request.cookies.get("admin_pass")?.value;
    if (adminPass !== "ok") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname.startsWith("/mypage")) {
    // /mypage/register 는 비로그인도 화면 조회 가능 (제출은 server action 에서 한 번 더 체크)
    if (request.nextUrl.pathname.startsWith("/mypage/register")) {
      return supabaseResponse;
    }
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // 소셜 가입 후 휴대폰 번호 미입력 사용자는 /onboarding 으로 강제 이동
  if (user && !isPublicPath(request.nextUrl.pathname)) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const phone =
      (typeof meta.phone === "string" && meta.phone) ||
      (typeof user.phone === "string" && user.phone) ||
      "";
    if (!phone) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

function isPublicPath(pathname: string): boolean {
  if (pathname === "/onboarding") return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/signup")) return true;
  if (pathname.startsWith("/find-account")) return true;
  if (pathname.startsWith("/logout")) return true;
  if (pathname.startsWith("/admin")) return true;
  return false;
}
