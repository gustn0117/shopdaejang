import Link from "next/link";
import { Icon } from "./Icon";

export function SectionHeader({
  title,
  subtitle,
  badge,
  href,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-3 lg:mb-4">
      <div className="flex items-center gap-2 lg:gap-3">
        {badge && (
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold border border-foreground text-foreground rounded">
            {badge}
          </span>
        )}
        <h2 className="text-lg lg:text-xl font-black text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <span className="hidden sm:inline text-xs text-muted">
            {subtitle}
          </span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs lg:text-sm text-muted hover:text-foreground font-medium flex items-center gap-1"
        >
          더보기
          <Icon.ChevronRight size={12} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}
