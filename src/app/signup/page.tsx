import Link from "next/link";
import Image from "next/image";
import { signUpWithPassword } from "../login/actions";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { generateCaptcha } from "@/lib/captcha";
import { Icon } from "@/components/Icon";

export const metadata = { title: "회원가입" };
export const dynamic = "force-dynamic";

type SP = Promise<{ error?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const captcha = generateCaptcha();

  return (
    <div className="container-custom py-10 lg:py-20 max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center" aria-label="샵대장 홈">
          <Image src="/logo.png" alt="샵대장" width={256} height={256} priority className="w-40 h-40 object-contain" />
        </Link>
        <h1 className="text-lg font-bold mt-6 tracking-tight">회원가입</h1>
        <p className="text-sm text-muted mt-1">가입 후 마이페이지에서 매물을 등록할 수 있습니다.</p>
        {sp.error && (
          <p className="text-xs text-urgent mt-3 bg-white border border-urgent/30 rounded px-3 py-2">{sp.error}</p>
        )}
      </div>
      <form action={signUpWithPassword} className="space-y-3">
        <input type="hidden" name="captcha_a" value={captcha.a} />
        <input type="hidden" name="captcha_b" value={captcha.b} />
        <input type="hidden" name="captcha_token" value={captcha.token} />

        <div>
          <Field name="name" type="text" placeholder="이름" />
        </div>

        <div>
          <Field name="email" type="email" placeholder="이메일" autoComplete="email" />
          <p className="text-[11px] text-muted mt-1 px-1 leading-relaxed">
            비밀번호 찾기 등에 사용되므로 정확하게 입력해주세요.
          </p>
        </div>

        <div>
          <Field
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div>
          <Field name="phone" type="tel" placeholder="휴대폰 번호 (예: 010-1234-5678)" />
          <p className="text-[11px] text-muted mt-1 px-1 leading-relaxed">
            비밀번호 찾기 등에 사용되므로 정확하게 입력해주세요.
          </p>
        </div>

        <div className="bg-zinc-50 border border-border rounded-md p-3 flex items-center gap-3">
          <Icon.Check size={16} className="text-foreground shrink-0" />
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm font-bold text-foreground tabular">
              {captcha.a} + {captcha.b} =
            </span>
            <input
              name="captcha_answer"
              type="number"
              required
              inputMode="numeric"
              className="flex-1 min-w-0 px-3 py-2 text-sm bg-white border border-border rounded focus:outline-none focus:border-foreground tabular"
              placeholder="답"
              autoComplete="off"
            />
          </div>
          <span className="text-[10px] text-muted shrink-0">자동등록방지</span>
        </div>

        <label className="flex items-start gap-2 text-xs cursor-pointer pt-1">
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

      <SocialLoginButtons redirect="/mypage" />

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
