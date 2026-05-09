import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchNoticeById, fetchNotices } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/Icon";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = await fetchNoticeById(Number(id));
  if (!notice) notFound();

  const all = await fetchNotices();
  const idx = all.findIndex((n) => n.id === Number(id));
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="container-custom py-4 lg:py-6 max-w-3xl">
      <Link href="/notice" className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <Icon.ChevronLeft size={12} />
        목록으로
      </Link>

      <article className="bg-white rounded-md border border-border mt-3 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-border bg-zinc-50">
          {notice.isPinned && (
            <span className="inline-block px-2 py-0.5 bg-foreground text-white text-[10px] font-bold rounded mb-2">
              공지
            </span>
          )}
          <h1 className="text-lg lg:text-xl font-black tracking-tight">{notice.title}</h1>
          <p className="text-[11px] text-muted mt-1">
            {formatDate(notice.createdAt)} · 조회 {notice.views.toLocaleString()}
          </p>
        </div>
        <div className="px-4 lg:px-6 py-6 text-sm leading-relaxed whitespace-pre-line min-h-50">
          {notice.content}
        </div>
      </article>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {prev ? (
          <Link href={`/notice/${prev.id}`} className="bg-white border border-border rounded p-3 hover:border-foreground">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Icon.ChevronLeft size={11} />
              이전글
            </span>
            <p className="text-sm font-medium line-clamp-1 mt-0.5">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/notice/${next.id}`} className="bg-white border border-border rounded p-3 hover:border-foreground text-right">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              다음글
              <Icon.ChevronRight size={11} />
            </span>
            <p className="text-sm font-medium line-clamp-1 mt-0.5">{next.title}</p>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
