import Link from "next/link";

const NAV = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/listings", label: "매물 승인", icon: "✅", badge: 12 },
  { href: "/admin/users", label: "회원 관리", icon: "👥" },
  { href: "/admin/payments", label: "결제 관리", icon: "💳" },
  { href: "/admin/reports", label: "신고 관리", icon: "🚨", badge: 3 },
  { href: "/admin/notices", label: "공지 관리", icon: "📢" },
  { href: "/admin/ad-config", label: "광고 노출순서", icon: "⚡" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="bg-zinc-900 text-white rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded">ADMIN</span>
          <span className="font-bold">샵대장 관리자</span>
        </div>
        <Link href="/" className="text-xs text-zinc-300 hover:text-white">사이트로 →</Link>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-3">
        <aside className="bg-white rounded-xl border border-border p-2 lg:sticky lg:top-24 self-start">
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary-light hover:text-primary rounded-md"
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
