import Link from "next/link";
import { Icon } from "@/components/Icon";
import { adminSignOut } from "./login/actions";

const NAV: { href: string; label: string; icon: keyof typeof Icon; badge?: number }[] = [
  { href: "/admin", label: "대시보드", icon: "Grid" },
  { href: "/admin/listings", label: "매물 승인", icon: "Check" },
  { href: "/admin/users", label: "회원 관리", icon: "Users" },
  { href: "/admin/payments", label: "결제 관리", icon: "Card" },
  { href: "/admin/reports", label: "신고 관리", icon: "Flag" },
  { href: "/admin/notices", label: "공지 관리", icon: "Megaphone" },
  { href: "/admin/ad-config", label: "광고 노출순서", icon: "Bolt" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="bg-foreground text-white rounded-md px-5 py-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 border border-white/30 text-[11px] font-bold rounded tracking-wide">ADMIN</span>
          <span className="font-bold text-sm tracking-tight">샵대장 관리자</span>
        </div>
        <div className="flex items-center gap-3">
          <form action={adminSignOut}>
            <button type="submit" className="text-xs text-white/70 hover:text-white">
              로그아웃
            </button>
          </form>
          <span className="text-white/30">|</span>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white">
            사이트로
            <Icon.ChevronRight size={11} />
          </Link>
        </div>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start">
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
                  <span className="flex-1">{item.label}</span>
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
