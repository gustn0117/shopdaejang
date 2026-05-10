"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-16 lg:py-24 text-center">
      <p className="text-7xl lg:text-9xl font-black text-foreground/10 tabular">500</p>
      <h1 className="text-xl lg:text-2xl font-black mt-4 tracking-tight">
        일시적인 오류가 발생했습니다
      </h1>
      <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
        잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 연락해주세요.
      </p>
      <div className="flex gap-2 justify-center mt-6">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 bg-foreground text-white font-bold rounded hover:bg-foreground-soft"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-border font-bold rounded hover:border-foreground"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
