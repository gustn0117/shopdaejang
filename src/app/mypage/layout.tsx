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
    <div className="container-custom py-4 lg:py-6">
      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <aside className="bg-white rounded-md border border-border p-3 lg:sticky lg:top-24 self-start hidden lg:block">
          <div className="flex items-center gap-2 p-2 border-b border-border mb-2">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-foreground font-black">
              샵
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">샵대장님</p>
              <p className="text-[11px] text-muted">일반회원</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            {NAV.map((item) => {
              const IconComp = Icon[item.icon] as (props: { size?: number }) => React.ReactElement;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 rounded"
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
