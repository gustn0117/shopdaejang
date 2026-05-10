import Link from "next/link";
import { Icon } from "./Icon";

export function Pagination({
  current,
  total,
  pageSize,
  buildHref,
}: {
  current: number;
  total: number;
  pageSize: number;
  buildHref: (page: number) => string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  // Window of pages around current
  const range: number[] = [];
  const window = 2;
  const start = Math.max(1, current - window);
  const end = Math.min(pageCount, current + window);
  for (let i = start; i <= end; i++) range.push(i);

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1 mt-8">
      <PageLink
        href={buildHref(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="이전 페이지"
      >
        <Icon.ChevronLeft size={14} />
      </PageLink>
      {start > 1 && (
        <>
          <PageLink href={buildHref(1)} active={current === 1}>
            1
          </PageLink>
          {start > 2 && <span className="px-2 text-muted text-xs">···</span>}
        </>
      )}
      {range.map((p) => (
        <PageLink key={p} href={buildHref(p)} active={p === current}>
          {p}
        </PageLink>
      ))}
      {end < pageCount && (
        <>
          {end < pageCount - 1 && <span className="px-2 text-muted text-xs">···</span>}
          <PageLink href={buildHref(pageCount)} active={current === pageCount}>
            {pageCount}
          </PageLink>
        </>
      )}
      <PageLink
        href={buildHref(Math.min(pageCount, current + 1))}
        disabled={current === pageCount}
        aria-label="다음 페이지"
      >
        <Icon.ChevronRight size={14} />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const className = `inline-flex items-center justify-center min-w-9 h-9 px-2 rounded text-xs font-bold tabular ${
    disabled
      ? "text-muted/40 pointer-events-none"
      : active
      ? "bg-foreground text-white"
      : "border border-border text-foreground hover:border-foreground"
  }`;
  if (disabled) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
