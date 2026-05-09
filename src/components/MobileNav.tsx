"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const ITEMS = [
  { href: "/", label: "홈", icon: <Icon.Home size={20} /> },
  { href: "/listings", label: "매물검색", icon: <Icon.Search size={20} /> },
  {
    href: "/mypage/register",
    label: "등록",
    icon: <Icon.Plus size={22} strokeWidth={2.4} />,
    primary: true,
  },
  { href: "/used", label: "중고", icon: <Icon.Bag size={20} /> },
  { href: "/mypage", label: "마이", icon: <Icon.User size={20} /> },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border safe-bottom">
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 gap-0.5 ${
                  item.primary
                    ? "text-foreground"
                    : isActive
                    ? "text-foreground"
                    : "text-muted"
                }`}
              >
                {item.primary ? (
                  <span className="w-11 h-11 rounded-full bg-foreground text-white flex items-center justify-center -mt-3">
                    {item.icon}
                  </span>
                ) : (
                  item.icon
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
