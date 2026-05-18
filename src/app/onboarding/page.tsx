import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveOnboarding } from "./actions";

export const metadata = { title: "회원정보 등록" };
export const dynamic = "force-dynamic";

type SP = Promise<{ redirect?: string; error?: string }>;

export default async function OnboardingPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const redirectTo = sp.redirect ?? "/";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/onboarding")}`);
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const defaultName =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.nickname === "string" && meta.nickname) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    "";
  const defaultPhone =
    (typeof meta.phone === "string" && meta.phone) ||
    (typeof user.phone === "string" && user.phone) ||
    "";

  // Already onboarded → skip
  if (defaultPhone) {
    redirect(redirectTo);
  }

  const providerLabel =
    typeof meta.provider === "string"
      ? meta.provider === "naver"
        ? "네이버"
        : meta.provider === "kakao"
        ? "카카오"
        : ""
      : "";

  return (
    <div className="container-custom py-10 lg:py-16 max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center" aria-label="샵대장 홈">
          <Image src="/logo.png" alt="샵대장" width={256} height={256} priority className="w-32 h-32 object-contain" />
        </Link>
        <h1 className="text-lg font-bold mt-4 tracking-tight">추가 정보 입력</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          {providerLabel && (
            <>
              <span className="font-semibold text-foreground">{providerLabel}</span> 계정으로 로그인했습니다.<br />
            </>
          )}
          매물 등록·결제·연락을 위해 이름과 휴대폰 번호가 필요합니다.
        </p>
        {sp.error && (
          <p className="text-xs text-urgent mt-3 bg-white border border-urgent/30 rounded px-3 py-2">
            {sp.error}
          </p>
        )}
      </div>

      <form action={saveOnboarding} className="space-y-2">
        <input type="hidden" name="redirect" value={redirectTo} />
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          placeholder="이름"
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:border-foreground placeholder:text-muted/70"
        />
        <input
          name="phone"
          type="tel"
          required
          placeholder="휴대폰 번호 (예: 010-1234-5678)"
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:border-foreground placeholder:text-muted/70 tabular"
        />
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-foreground text-white font-semibold rounded-md hover:bg-foreground-soft transition-colors"
        >
          저장하고 계속하기
        </button>
      </form>

      <p className="text-[11px] text-center text-muted mt-6 leading-relaxed">
        입력한 휴대폰 번호는 매물 거래 연락처로 사용됩니다.<br />
        샵대장은 거래에 개입하지 않으며 광고 플랫폼입니다.
      </p>
    </div>
  );
}
