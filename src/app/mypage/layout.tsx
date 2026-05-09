import Link from "next/link";

const NAV = [
  { href: "/mypage", label: "마이페이지", icon: "🏠" },
  { href: "/mypage/listings", label: "매물관리", icon: "📋" },
  { href: "/mypage/favorites", label: "찜한매물", icon: "❤️" },
  { href: "/mypage/register", label: "매물등록", icon: "➕" },
  { href: "/mypage/payments", label: "결제내역", icon: "💳" },
  { href: "/mypage/settings", label: "회원정보", icon: "⚙️" },
];

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <aside className="bg-white rounded-xl border border-border p-3 lg:sticky lg:top-24 self-start hidden lg:block">
          <div className="flex items-center gap-2 p-2 border-b border-border mb-2">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-black">
              샵
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">샵대장님</p>
              <p className="text-[11px] text-muted">일반회원</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary-light hover:text-primary rounded-md"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
