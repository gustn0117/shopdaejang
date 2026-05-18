"use client";

import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SocialLoginButtons({ redirect = "/" }: { redirect?: string }) {
  const [pending, start] = useTransition();

  function signInKakao() {
    start(async () => {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });
    });
  }

  function signInNaver() {
    if (typeof window === "undefined") return;
    window.location.href = `/api/auth/naver/start?redirect=${encodeURIComponent(redirect)}`;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 my-5">
        <span className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted">또는 SNS 로그인</span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <button
        type="button"
        onClick={signInKakao}
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FEE500] hover:opacity-90 text-black font-semibold rounded-md transition-opacity disabled:opacity-50"
      >
        <KakaoIcon />
        카카오로 시작하기
      </button>
      <button
        type="button"
        onClick={signInNaver}
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#03C75A] hover:opacity-90 text-white font-semibold rounded-md transition-opacity disabled:opacity-50"
      >
        <NaverIcon />
        네이버로 시작하기
      </button>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.85 5.32 4.65 6.75-.2.71-.74 2.66-.85 3.08-.13.51.19.5.4.36.16-.1 2.6-1.76 3.66-2.48.7.1 1.41.15 2.14.15 5.52 0 10-3.58 10-8s-4.48-7.85-10-7.85z" />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.27 21H21V3h-4.73v9.74L7.73 3H3v18h4.73v-9.74L16.27 21z" />
    </svg>
  );
}
