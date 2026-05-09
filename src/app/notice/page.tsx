import Link from "next/link";
import { SAMPLE_NOTICES } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "공지사항",
  description: "샵대장 공지사항",
};

export default function NoticePage() {
  const notices = [...SAMPLE_NOTICES].sort(
    (a, b) =>
      Number(b.isPinned) - Number(a.isPinned) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container-custom py-4 lg:py-6 max-w-4xl">
      <h1 className="text-xl lg:text-2xl font-black mb-1">공지사항</h1>
      <p className="text-xs lg:text-sm text-muted mb-4">
        샵대장의 새로운 소식과 업데이트를 확인하세요
      </p>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="hidden sm:grid grid-cols-[80px_1fr_120px_80px] gap-3 px-4 py-3 bg-zinc-50 text-xs font-bold text-muted border-b border-border">
          <div className="text-center">번호</div>
          <div>제목</div>
          <div className="text-center">날짜</div>
          <div className="text-center">조회</div>
        </div>
        <ul className="divide-y divide-border">
          {notices.map((n, i) => (
            <li key={n.id}>
              <Link
                href={`/notice/${n.id}`}
                className="grid grid-cols-[1fr_60px] sm:grid-cols-[80px_1fr_120px_80px] gap-2 sm:gap-3 px-4 py-3 hover:bg-primary-light items-center"
              >
                <span className="hidden sm:block text-center text-xs text-muted">
                  {n.isPinned ? <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">공지</span> : (notices.length - i)}
                </span>
                <div className="min-w-0">
                  {n.isPinned && (
                    <span className="sm:hidden inline-block px-1.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded mr-1.5 align-middle">
                      공지
                    </span>
                  )}
                  <span className={`text-sm ${n.isPinned ? "font-bold" : "font-medium"} line-clamp-1`}>
                    {n.title}
                  </span>
                  <span className="sm:hidden block text-[11px] text-muted mt-0.5">
                    {formatDate(n.createdAt)} · 조회 {n.views.toLocaleString()}
                  </span>
                </div>
                <span className="hidden sm:block text-center text-xs text-muted">
                  {formatDate(n.createdAt)}
                </span>
                <span className="text-center text-xs text-muted">
                  <span className="sm:hidden">→</span>
                  <span className="hidden sm:inline">{n.views.toLocaleString()}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
