import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { Icon } from "./Icon";
import { HeaderMobile } from "./HeaderMobile";
import { HeaderSearch } from "./HeaderSearch";

const NAV_ITEMS = [
  { href: "/listings", label: "매물검색" },
  { href: "/map", label: "지도" },
  { href: "/used", label: "중고장터" },
  { href: "/supplies", label: "용품도매" },
  { href: "/notice", label: "공지" },
  { href: "/ad-info", label: "광고안내" },
];

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container-custom">
        <div className="hidden lg:flex items-center justify-end gap-3 py-1.5 text-[11px] text-muted">
          {user ? (
            <>
              <span className="text-foreground/80">{user.user_metadata?.name ?? user.email}</span>
              <Link href="/mypage" className="hover:text-foreground">마이페이지</Link>
              <Link href="/mypage/register" className="hover:text-foreground">매물등록</Link>
              <form action={signOut}>
                <button type="submit" className="hover:text-foreground">로그아웃</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-foreground">로그인</Link>
              <Link href="/signup" className="hover:text-foreground">회원가입</Link>
              <Link href="/notice" className="hover:text-foreground">고객센터</Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-between py-3 lg:py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="inline-flex items-center gap-2 group" aria-label="샵대장 홈">
              <Image
                src="/logo.png"
                alt="샵대장"
                width={40}
                height={40}
                priority
                className="w-9 h-9 lg:w-10 lg:h-10 object-contain"
              />
              <span className="hidden sm:inline-flex flex-col leading-tight">
                <span className="text-base lg:text-lg font-black text-foreground tracking-tight">
                  샵대장
                </span>
                <span className="hidden lg:inline text-[10px] text-muted tracking-wide">
                  마사지샵 직거래 플랫폼
                </span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-[13px] font-medium text-foreground-soft hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <HeaderSearch />
            <Link
              href="/mypage/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-white text-[13px] font-semibold rounded-md hover:bg-foreground-soft transition-colors"
            >
              <Icon.Plus size={13} strokeWidth={2.5} />
              매물등록
            </Link>
            <HeaderMobile items={NAV_ITEMS} isAuthenticated={!!user} />
          </div>
        </div>
      </div>
    </header>
  );
}
