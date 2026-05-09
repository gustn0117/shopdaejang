import Link from "next/link";
import { Icon } from "@/components/Icon";
import { signInWithPassword } from "./actions";

export const metadata = {
  title: "로그인",
  description: "샵대장 로그인",
};

type SP = Promise<{ error?: string; redirect?: string; admin_required?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="container-custom py-8 lg:py-16 max-w-md">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-12 h-12 rounded-md bg-foreground text-white font-black text-2xl flex items-center justify-center">샵</span>
          <span className="text-2xl font-black">샵대장</span>
        </Link>
        <h1 className="text-xl font-black mb-1">로그인</h1>
        <p className="text-sm text-muted">이메일로 로그인하세요</p>
        {sp.admin_required && (
          <p className="text-xs text-urgent mt-2">관리자 페이지는 관리자 계정으로만 접근할 수 있습니다.</p>
        )}
        {sp.error && (
          <p className="text-xs text-urgent mt-2">{sp.error}</p>
        )}
      </div>

      <div className="bg-white rounded-md border border-border p-5 space-y-2">
        <form action={signInWithPassword} className="space-y-2">
          <input type="hidden" name="redirect" value={sp.redirect ?? "/"} />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            required
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            required
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="w-full py-3 bg-foreground text-white font-bold rounded hover:opacity-90"
          >
            로그인
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-xs text-muted">
          <hr className="flex-1 border-border" />
          소셜 로그인 (준비중)
          <hr className="flex-1 border-border" />
        </div>

        <button type="button" disabled className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#03C75A]/40 text-white font-bold rounded cursor-not-allowed">
          <span className="w-5 h-5 bg-white text-[#03C75A] rounded-sm flex items-center justify-center font-black text-xs">N</span>
          네이버
        </button>
        <button type="button" disabled className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#FEE500]/50 text-black font-bold rounded cursor-not-allowed">
          <Icon.Chat size={16} strokeWidth={2.2} />
          카카오
        </button>

        <div className="flex items-center justify-between text-xs text-muted pt-2">
          <Link href="/signup" className="hover:text-foreground">이메일 회원가입</Link>
          <span>|</span>
          <Link href="/find-account" className="hover:text-foreground">아이디·비밀번호 찾기</Link>
        </div>
      </div>

      <p className="text-[11px] text-center text-muted mt-4 leading-relaxed">
        로그인 시 <Link href="/terms" className="underline">이용약관</Link>과{" "}
        <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의한 것으로 간주됩니다.
      </p>
    </div>
  );
}
