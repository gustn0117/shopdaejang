import Link from "next/link";
import { notFound } from "next/navigation";
import { SAMPLE_NOTICES } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/Icon";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = SAMPLE_NOTICES.find((n) => n.id === Number(id));
  if (!notice) notFound();

  const idx = SAMPLE_NOTICES.findIndex((n) => n.id === Number(id));
  const prev = idx > 0 ? SAMPLE_NOTICES[idx - 1] : null;
  const next = idx < SAMPLE_NOTICES.length - 1 ? SAMPLE_NOTICES[idx + 1] : null;

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
          {"\n\n"}
          상세 내용은 운영진의 검토 후 갱신될 수 있습니다.
          관련 문의는 고객센터(1588-0000) 또는 카카오톡 채널로 연락 부탁드립니다.
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
