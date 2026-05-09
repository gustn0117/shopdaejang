import Link from "next/link";
import { Icon } from "@/components/Icon";

const NAV: { href: string; label: string; icon: keyof typeof Icon; badge?: number }[] = [
  { href: "/admin", label: "대시보드", icon: "Grid" },
  { href: "/admin/listings", label: "매물 승인", icon: "Check", badge: 12 },
  { href: "/admin/users", label: "회원 관리", icon: "Users" },
  { href: "/admin/payments", label: "결제 관리", icon: "Card" },
  { href: "/admin/reports", label: "신고 관리", icon: "Flag", badge: 3 },
  { href: "/admin/notices", label: "공지 관리", icon: "Megaphone" },
  { href: "/admin/ad-config", label: "광고 노출순서", icon: "Bolt" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="bg-foreground text-white rounded-md px-4 py-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 border border-white/30 text-xs font-bold rounded">ADMIN</span>
          <span className="font-bold">샵대장 관리자</span>
        </div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white">
          사이트로
          <Icon.ChevronRight size={11} />
        </Link>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-3">
        <aside className="bg-white rounded-md border border-border p-2 lg:sticky lg:top-24 self-start">
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
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-urgent text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
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
