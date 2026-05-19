"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

type NavItem = { href: string; label: string };

export function HeaderMobile({
  items,
  isAuthenticated,
}: {
  items: NavItem[];
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden p-2 text-foreground"
        aria-label="메뉴 열기"
      >
        {open ? <Icon.X size={22} /> : <Icon.Menu size={22} />}
      </button>
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-border shadow-sm animate-fade-up z-30">
          <nav className="container-custom flex flex-col gap-1 py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-foreground hover:bg-zinc-50 rounded"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2 grid grid-cols-2 gap-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/mypage"
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-sm text-center font-medium text-white bg-foreground rounded"
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/mypage/register"
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-sm text-center font-medium text-foreground border border-border rounded"
                  >
                    매물등록
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-sm text-center font-medium text-foreground border border-border rounded"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-sm text-center font-medium text-foreground border border-border rounded"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
            {!isAuthenticated && (
              <div className="mt-1">
                <Link
                  href="/mypage/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold text-white bg-foreground rounded"
                >
                  <Icon.Plus size={14} strokeWidth={2.4} />
                  광고 등록하기
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
