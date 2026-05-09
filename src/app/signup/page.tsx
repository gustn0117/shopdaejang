import Link from "next/link";

export const metadata = { title: "회원가입" };

export default function SignupPage() {
  return (
    <div className="container-custom py-8 lg:py-16 max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-xl font-black tracking-tight">이메일 회원가입</h1>
        <p className="text-sm text-muted mt-1">간편 가입은 <Link href="/login" className="underline">로그인 페이지</Link>를 이용하세요.</p>
      </div>
      <form className="bg-white rounded-md border border-border p-5 space-y-2">
        <input type="text" placeholder="이름" className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="email" placeholder="이메일" className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="password" placeholder="비밀번호" className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="password" placeholder="비밀번호 확인" className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="tel" placeholder="휴대폰 번호" className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <label className="flex items-start gap-2 text-xs cursor-pointer pt-2">
          <input type="checkbox" className="mt-0.5 accent-foreground" />
          <span><Link href="/terms" className="underline">이용약관</Link>과 <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.</span>
        </label>
        <button type="submit" className="w-full py-3 bg-foreground text-white font-bold rounded mt-2">
          회원가입하기
        </button>
      </form>
    </div>
  );
}
