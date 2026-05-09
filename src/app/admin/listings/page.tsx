import { SAMPLE_LISTINGS } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "매물 승인", robots: "noindex" };

export default function AdminListingsPage() {
  const pending = SAMPLE_LISTINGS.slice(0, 12).map((l) => ({
    ...l,
    status: "pending" as const,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">매물 승인 관리</h1>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted">총 <strong className="text-foreground">{pending.length}</strong>건 검토 대기</span>
        </div>
      </div>

      <div className="bg-white rounded-md border border-border p-2 flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { v: "pending", l: `승인대기 (${pending.length})`, active: true },
          { v: "approved", l: "승인완료" },
          { v: "rejected", l: "반려" },
          { v: "all", l: "전체" },
        ].map((t) => (
          <button
            key={t.v}
            type="button"
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded ${
              t.active ? "bg-foreground text-white" : "text-muted hover:bg-zinc-50"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden lg:grid grid-cols-[40px_80px_1fr_120px_100px_100px_180px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
          <div><input type="checkbox" className="accent-foreground" /></div>
          <div>광고</div>
          <div>매물 정보</div>
          <div>등록자</div>
          <div>등록일</div>
          <div>광고기간</div>
          <div className="text-center">처리</div>
        </div>
        <ul className="divide-y divide-border">
          {pending.map((l) => (
            <li key={l.id} className="px-3 py-3 grid grid-cols-1 lg:grid-cols-[40px_80px_1fr_120px_100px_100px_180px] gap-2 items-center text-sm">
              <div className="hidden lg:block"><input type="checkbox" className="accent-foreground" /></div>
              <div className="hidden lg:block"><TierBadge tier={l.tier} size="xs" /></div>
              <div className="flex gap-2 items-center min-w-0">
                <div
                  className="w-12 h-12 lg:w-10 lg:h-10 rounded shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${l.thumbnail})` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="lg:hidden mb-1"><TierBadge tier={l.tier} size="xs" /></div>
                  <p className="text-xs font-bold line-clamp-1">{l.title}</p>
                  <p className="text-[11px] text-muted">{l.region} · {l.category} · {l.area}평</p>
                </div>
              </div>
              <div className="text-xs text-muted hidden lg:block">user{l.id % 100}</div>
              <div className="text-xs text-muted hidden lg:block">{formatRelativeDate(l.createdAt)}</div>
              <div className="text-xs hidden lg:block">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  l.tier === "free" ? "border-free text-free" : "border-premium text-premium"
                }`}>
                  {l.tier === "free" ? "무료 10일" : "결제완료"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button type="button" className="py-1.5 text-xs font-bold bg-foreground text-white rounded">승인</button>
                <button type="button" className="py-1.5 text-xs font-bold border border-urgent text-urgent rounded">반려</button>
                <button type="button" className="py-1.5 text-xs font-bold border border-border rounded">상세</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-border rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-foreground" />
          <span className="text-xs">전체 선택</span>
        </div>
        <div className="flex gap-1">
          <button type="button" className="px-3 py-1.5 text-xs font-bold bg-foreground text-white rounded">선택 승인</button>
          <button type="button" className="px-3 py-1.5 text-xs font-bold border border-urgent text-urgent rounded">선택 반려</button>
        </div>
      </div>
    </div>
  );
}
