import { Icon } from "@/components/Icon";

export const metadata = { title: "신고 관리", robots: "noindex" };

const REPORTS = [
  { id: "R-001", type: "사기 의심", target: "강남 마사지샵 #58921", reporter: "익명", reason: "보증금 입금 후 연락 두절", date: "2026-05-09 09:33", status: "대기" },
  { id: "R-002", type: "허위 매물", target: "수원 스웨디시 #58912", reporter: "user@example.com", reason: "기재된 면적과 실제 면적 차이", date: "2026-05-08 18:21", status: "대기" },
  { id: "R-003", type: "중복 매물", target: "부산 영도 #58901", reporter: "익명", reason: "동일 매물 2건 등록", date: "2026-05-08 14:08", status: "대기" },
  { id: "R-004", type: "기타", target: "광주 동구 #58870", reporter: "user2@example.com", reason: "광고와 다른 업종", date: "2026-05-07 11:50", status: "처리완료" },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">신고 관리</h1>
        <span className="inline-flex items-center gap-1.5 text-xs text-urgent">
          <Icon.Warning size={12} strokeWidth={2.2} />
          미처리 {REPORTS.filter((r) => r.status === "대기").length}건
        </span>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {REPORTS.map((r) => (
            <li key={r.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-urgent text-urgent bg-white">
                      {r.type}
                    </span>
                    <span className="text-xs font-bold">{r.target}</span>
                  </div>
                  <p className="text-xs text-foreground/80">{r.reason}</p>
                  <p className="text-[11px] text-muted mt-1">신고자: {r.reporter} · {r.date}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {r.status === "대기" ? (
                    <>
                      <button type="button" className="px-3 py-1 text-xs font-bold bg-foreground text-white rounded">처리</button>
                      <button type="button" className="px-3 py-1 text-xs font-bold border border-border rounded">반려</button>
                    </>
                  ) : (
                    <span className="px-2 py-1 text-[10px] font-bold border border-free text-free bg-white rounded">처리완료</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
