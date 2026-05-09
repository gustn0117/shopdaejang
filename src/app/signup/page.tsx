import Link from "next/link";
import { signUpWithPassword } from "../login/actions";

export const metadata = { title: "회원가입" };

type SP = Promise<{ error?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="container-custom py-10 lg:py-20 max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block text-2xl font-black tracking-tight text-foreground">
          샵대장
        </Link>
        <h1 className="text-lg font-bold mt-6 tracking-tight">회원가입</h1>
        <p className="text-sm text-muted mt-1">가입 후 마이페이지에서 매물을 등록할 수 있습니다.</p>
        {sp.error && (
          <p className="text-xs text-urgent mt-3 bg-white border border-urgent/30 rounded px-3 py-2">{sp.error}</p>
        )}
      </div>
      <form action={signUpWithPassword} className="space-y-2">
        <Field name="name" type="text" placeholder="이름" />
        <Field name="email" type="email" placeholder="이메일" autoComplete="email" />
        <Field name="password" type="password" placeholder="비밀번호 (6자 이상)" minLength={6} autoComplete="new-password" />
        <Field name="phone" type="tel" placeholder="휴대폰 번호" />
        <label className="flex items-start gap-2 text-xs cursor-pointer pt-3">
          <input type="checkbox" required className="mt-0.5 accent-foreground" />
          <span className="text-muted">
            <Link href="/terms" className="underline">이용약관</Link>과{" "}
            <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.
          </span>
        </label>
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-foreground text-white font-semibold rounded-md hover:bg-foreground-soft transition-colors"
        >
          회원가입하기
        </button>
      </form>
      <p className="text-center text-xs text-muted mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-foreground font-semibold hover:underline">
          로그인
        </Link>
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
