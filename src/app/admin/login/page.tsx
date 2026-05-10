import Link from "next/link";
import { adminSignIn } from "./actions";

export const metadata = { title: "관리자 로그인", robots: "noindex" };

type SP = Promise<{ error?: string; redirect?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="container-custom py-10 lg:py-20 max-w-sm">
      <div className="text-center mb-8">
        <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-3">
          Admin
        </p>
        <h1 className="text-xl font-black tracking-tight">관리자 로그인</h1>
        <p className="text-xs text-muted mt-2">관리자 비밀번호를 입력하세요.</p>
        {sp.error && (
          <p className="text-xs text-urgent mt-3 bg-white border border-urgent/30 rounded px-3 py-2">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>

      <form action={adminSignIn} className="space-y-2">
        <input type="hidden" name="redirect" value={sp.redirect ?? "/admin"} />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          autoFocus
          autoComplete="off"
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:border-foreground placeholder:text-muted/70"
        />
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-foreground text-white font-semibold rounded-md hover:bg-foreground-soft"
        >
          입장
        </button>
      </form>

      <p className="text-[11px] text-center text-muted mt-6">
        <Link href="/" className="hover:text-foreground">사이트로 돌아가기</Link>
      </p>
    </div>
  );
}
