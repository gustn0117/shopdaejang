import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "로그인",
  description: "샵대장 로그인",
};

export default function LoginPage() {
  return (
    <div className="container-custom py-8 lg:py-16 max-w-md">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-12 h-12 rounded-md bg-foreground text-white font-black text-2xl flex items-center justify-center">샵</span>
          <span className="text-2xl font-black">샵대장</span>
        </Link>
        <h1 className="text-xl font-black mb-1">간편 로그인</h1>
        <p className="text-sm text-muted">SNS 계정으로 빠르게 시작하세요</p>
      </div>

      <div className="bg-white rounded-md border border-border p-5 space-y-2">
        <button type="button" className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#03C75A] text-white font-bold rounded hover:opacity-95">
          <span className="w-5 h-5 bg-white text-[#03C75A] rounded-sm flex items-center justify-center font-black text-xs">N</span>
          네이버로 시작하기
        </button>
        <button type="button" className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#FEE500] text-black font-bold rounded hover:opacity-95">
          <Icon.Chat size={16} strokeWidth={2.2} />
          카카오로 시작하기
        </button>
        <button type="button" className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border border-border text-foreground font-bold rounded hover:bg-zinc-50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          구글로 시작하기
        </button>

        <div className="my-4 flex items-center gap-2 text-xs text-muted">
          <hr className="flex-1 border-border" />
          또는
          <hr className="flex-1 border-border" />
        </div>

        <form className="space-y-2">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="w-full py-3 bg-foreground text-white font-bold rounded hover:opacity-90"
          >
            이메일로 로그인
          </button>
        </form>

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
