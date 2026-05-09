import Link from "next/link";
import { Icon } from "./Icon";

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  href,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-4 lg:mb-5">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted mb-1.5">
            {eyebrow}
          </p>
        )}
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg lg:text-xl font-black text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="hidden sm:inline text-[12px] text-muted">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs lg:text-[13px] text-muted hover:text-foreground font-medium flex items-center gap-1"
        >
          전체보기
          <Icon.ArrowRight size={12} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
