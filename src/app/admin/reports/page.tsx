import { Icon } from "@/components/Icon";
import { createAdminClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "신고 관리", robots: "noindex" };
export const dynamic = "force-dynamic";

async function fetchReports() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("reports")
    .select("id, type, target_type, target_id, reporter_id, reason, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Array<{
    id: number;
    type: string;
    target_type: string;
    target_id: number;
    reporter_id: string | null;
    reason: string | null;
    status: string;
    created_at: string;
  }>;
}

export default async function AdminReportsPage() {
  const reports = await fetchReports();
  const pending = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">신고 관리</h1>
        {pending > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-urgent">
            <Icon.Warning size={12} strokeWidth={2.2} />
            미처리 <span className="tabular">{pending}</span>건
          </span>
        ) : (
          <span className="text-xs text-muted">미처리 없음</span>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-md border border-border p-12 text-center">
          <Icon.Flag size={28} className="mx-auto mb-3 text-muted" />
          <p className="text-sm font-semibold">아직 접수된 신고가 없습니다.</p>
          <p className="text-xs text-muted mt-1">사용자가 매물·중고를 신고하면 이곳에 표시됩니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-border overflow-hidden">
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li key={r.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-urgent text-urgent bg-white">
                        {r.type}
                      </span>
                      <span className="text-xs font-bold">
                        {r.target_type} #{r.target_id}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80">{r.reason || "사유 미기재"}</p>
                    <p className="text-[11px] text-muted mt-1 tabular">
                      {formatRelativeDate(r.created_at)} · 신고자: {r.reporter_id?.slice(0, 8) ?? "익명"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {r.status === "pending" ? (
                      <>
                        <button type="button" className="px-3 py-1 text-xs font-bold bg-foreground text-white rounded">
                          처리
                        </button>
                        <button type="button" className="px-3 py-1 text-xs font-bold border border-border rounded">
                          반려
                        </button>
                      </>
                    ) : (
                      <span className="px-2 py-1 text-[10px] font-bold border border-free text-free bg-white rounded">
                        {r.status === "resolved" ? "처리완료" : "반려"}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
