import Link from "next/link";
import { signUpWithPassword } from "../login/actions";

export const metadata = { title: "회원가입" };

type SP = Promise<{ error?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="container-custom py-8 lg:py-16 max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-xl font-black tracking-tight">이메일 회원가입</h1>
        <p className="text-sm text-muted mt-1">가입 후 마이페이지에서 매물을 등록할 수 있습니다.</p>
        {sp.error && <p className="text-xs text-urgent mt-2">{sp.error}</p>}
      </div>
      <form action={signUpWithPassword} className="bg-white rounded-md border border-border p-5 space-y-2">
        <input type="text" name="name" placeholder="이름" required className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="email" name="email" placeholder="이메일" required className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="password" name="password" placeholder="비밀번호 (6자 이상)" required minLength={6} className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <input type="tel" name="phone" placeholder="휴대폰 번호" required className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        <label className="flex items-start gap-2 text-xs cursor-pointer pt-2">
          <input type="checkbox" required className="mt-0.5 accent-foreground" />
          <span><Link href="/terms" className="underline">이용약관</Link>과 <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.</span>
        </label>
        <button type="submit" className="w-full py-3 bg-foreground text-white font-bold rounded mt-2">
          회원가입하기
        </button>
      </form>
    </div>
  );
}
