import Link from "next/link";
import { Icon } from "./Icon";

export function SimplePage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-custom py-6 lg:py-10 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground mb-3">
        <Icon.ChevronLeft size={12} />
        홈으로
      </Link>
      <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{title}</h1>
      {description && <p className="text-sm text-muted mt-2">{description}</p>}
      <div className="mt-6 bg-white rounded-md border border-border p-5 lg:p-8 text-sm text-foreground/85 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
