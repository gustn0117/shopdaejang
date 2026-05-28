import { createHmac } from "crypto";

// 환경변수 미설정 시 빌트인 시크릿 사용 (자동등록방지용 — 보안 등급 낮음, OK)
const SECRET =
  process.env.CAPTCHA_SECRET ?? "shopdaejang-captcha-default-do-not-use-for-secrets";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export type CaptchaChallenge = { a: number; b: number; token: string };

export function generateCaptcha(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 9) + 1; // 1~9
  const b = Math.floor(Math.random() * 9) + 1; // 1~9
  const token = sign(`${a}+${b}=${a + b}`);
  return { a, b, token };
}

export function verifyCaptcha(
  a: number,
  b: number,
  answer: number,
  token: string
): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(answer)) {
    return false;
  }
  if (answer !== a + b) return false;
  const expected = sign(`${a}+${b}=${a + b}`);
  return token === expected;
}
