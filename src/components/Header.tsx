"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/listings", label: "매물검색" },
  { href: "/map", label: "지도검색" },
  { href: "/used", label: "중고장터" },
  { href: "/supplies", label: "용품도매" },
  { href: "/notice", label: "공지사항" },
  { href: "/ad-info", label: "광고안내" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="container-custom">
        <div className="hidden lg:flex items-center justify-end gap-4 py-2 text-xs text-muted">
          <Link href="/login" className="hover:text-foreground">
            로그인
          </Link>
          <span className="text-border">|</span>
          <Link href="/mypage" className="hover:text-foreground">
            마이페이지
          </Link>
          <span className="text-border">|</span>
          <Link href="/mypage/register" className="hover:text-foreground">
            매물등록
          </Link>
          <span className="text-border">|</span>
          <Link href="/notice" className="hover:text-foreground">
            고객센터
          </Link>
        </div>

        <div className="flex items-center justify-between py-3 lg:py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-md bg-foreground flex items-center justify-center text-white font-black text-base lg:text-lg">
                샵
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg lg:text-xl font-black text-foreground">
                  샵대장
                </span>
                <span className="hidden lg:inline text-[10px] text-muted">
                  마사지샵 직거래 전문 사이트
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/mypage/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-white text-sm font-bold rounded-md hover:bg-foreground/90 transition-colors"
            >
              <Icon.Plus size={14} strokeWidth={2.5} />
              매물등록
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="lg:hidden p-2 text-foreground"
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? <Icon.X size={22} /> : <Icon.Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-3 animate-fade-up">
            <nav className="flex flex-col gap-1 pt-2 border-t border-border">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-base font-medium text-foreground hover:bg-zinc-50 rounded-md"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-2 grid grid-cols-2 gap-1">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-sm text-center font-medium text-foreground border border-border rounded-md"
                >
                  로그인
                </Link>
                <Link
                  href="/mypage"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-sm text-center font-medium text-white bg-foreground rounded-md"
                >
                  마이페이지
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
