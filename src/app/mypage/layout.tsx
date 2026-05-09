import Link from "next/link";
import { Icon } from "@/components/Icon";

const NAV: { href: string; label: string; icon: keyof typeof Icon }[] = [
  { href: "/mypage", label: "마이페이지", icon: "Home" },
  { href: "/mypage/listings", label: "매물관리", icon: "List" },
  { href: "/mypage/favorites", label: "찜한매물", icon: "Heart" },
  { href: "/mypage/register", label: "매물등록", icon: "Plus" },
  { href: "/mypage/payments", label: "결제내역", icon: "Card" },
  { href: "/mypage/settings", label: "회원정보", icon: "Settings" },
];

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
          <nav className="space-y-0.5">
            {NAV.map((item) => {
              const IconComp = Icon[item.icon] as (props: { size?: number }) => React.ReactElement;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-foreground-soft hover:text-foreground hover:bg-primary-soft rounded-md transition-colors"
                >
                  <IconComp size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
