import Link from "next/link";
import Image from "next/image";
import { signInWithPassword } from "./actions";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";

export const metadata = {
  title: "로그인",
  description: "샵대장 로그인",
};

type SP = Promise<{ error?: string; redirect?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="container-custom py-10 lg:py-20 max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center" aria-label="샵대장 홈">
          <Image src="/logo.png" alt="샵대장" width={256} height={256} priority className="w-40 h-40 object-contain" />
        </Link>
        <h1 className="text-lg font-bold mt-6 tracking-tight">로그인</h1>
        <p className="text-sm text-muted mt-1">이메일로 로그인하세요</p>
        {sp.error && (
          <p className="text-xs text-urgent mt-3 bg-white border border-urgent/30 rounded px-3 py-2">{sp.error}</p>
        )}
      </div>

      <form action={signInWithPassword} className="space-y-2">
        <input type="hidden" name="redirect" value={sp.redirect ?? "/"} />
        <Field name="email" type="email" placeholder="이메일" autoComplete="email" />
        <Field name="password" type="password" placeholder="비밀번호" autoComplete="current-password" />
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-foreground text-white font-semibold rounded-md hover:bg-foreground-soft transition-colors"
        >
          로그인
        </button>
      </form>

      <SocialLoginButtons redirect={sp.redirect ?? "/"} />

      <div className="flex items-center justify-between text-xs text-muted mt-6">
        <Link href="/signup" className="hover:text-foreground">이메일 회원가입</Link>
        <Link href="/find-account" className="hover:text-foreground">비밀번호 찾기</Link>
      </div>

      <p className="text-[11px] text-center text-muted mt-8 leading-relaxed">
        로그인 시 <Link href="/terms" className="underline">이용약관</Link>과{" "}
        <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의한 것으로 간주됩니다.
      </p>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      required
      className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:border-foreground placeholder:text-muted/70"
    />
  );
}
