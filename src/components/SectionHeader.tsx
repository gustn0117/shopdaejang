import Link from "next/link";

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
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded">
            {badge}
          </span>
        )}
        <h2 className="text-lg lg:text-2xl font-black text-foreground">
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
          className="text-xs lg:text-sm text-muted hover:text-primary font-medium flex items-center gap-1"
        >
          더보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
