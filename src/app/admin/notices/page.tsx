import { SAMPLE_NOTICES } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { formatDate } from "@/lib/format";

export const metadata = { title: "공지 관리", robots: "noindex" };

export default function AdminNoticesPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">공지 관리</h1>
        <button type="button" className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded">
          <Icon.Plus size={12} strokeWidth={2.5} />
          새 공지 작성
        </button>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[60px_60px_1fr_120px_80px_140px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
          <div className="text-center">번호</div>
          <div className="text-center">고정</div>
          <div>제목</div>
          <div>등록일</div>
          <div className="text-center">조회</div>
          <div className="text-center">처리</div>
        </div>
        <ul className="divide-y divide-border">
          {SAMPLE_NOTICES.map((n, i) => (
            <li key={n.id} className="grid grid-cols-1 md:grid-cols-[60px_60px_1fr_120px_80px_140px] gap-2 px-3 py-3 text-sm items-center">
              <div className="hidden md:block text-center text-xs text-muted">{SAMPLE_NOTICES.length - i}</div>
              <div className="hidden md:flex justify-center">
                {n.isPinned ? <Icon.Pin size={14} className="text-foreground" /> : <span className="text-muted">—</span>}
              </div>
              <div className="text-sm font-bold line-clamp-1">{n.title}</div>
              <div className="text-xs text-muted hidden md:block">{formatDate(n.createdAt)}</div>
              <div className="text-xs text-center hidden md:block">{n.views.toLocaleString()}</div>
              <div className="grid grid-cols-3 gap-1">
                <button type="button" className="py-1 text-[11px] border border-border rounded">수정</button>
                <button type="button" className="py-1 text-[11px] border border-border rounded">{n.isPinned ? "해제" : "고정"}</button>
                <button type="button" className="py-1 text-[11px] border border-urgent text-urgent rounded">삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
