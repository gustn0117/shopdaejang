import Link from "next/link";
import { Icon } from "@/components/Icon";
import { createAdminClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "관리자 대시보드", robots: "noindex" };
export const dynamic = "force-dynamic";

async function fetchStats() {
  const admin = createAdminClient();
  const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    totalUsers,
    newUsersToday,
    totalListings,
    listingsToday,
    pending,
    paymentsToday,
  ] = await Promise.all([
    admin.auth.admin.listUsers().then((r) => r.data?.users?.length ?? 0),
    admin.auth.admin
      .listUsers()
      .then(
        (r) =>
          r.data?.users?.filter((u) => new Date(u.created_at) >= new Date(since24))
            .length ?? 0
      ),
    admin.from("listings").select("id", { count: "exact", head: true }),
    admin
      .from("listings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since24),
    admin
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("payments")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", since24),
  ]);

  const todayPaid = (paymentsToday.data ?? []).reduce(
    (sum: number, p: { amount: number }) => sum + Number(p.amount),
    0
  );

  return {
    totalUsers,
    newUsersToday,
    totalListings: totalListings.count ?? 0,
    listingsToday: listingsToday.count ?? 0,
    pending: pending.count ?? 0,
    todayPaid,
  };
}

type ActivityItem = {
  type: "listing" | "payment" | "report";
  label: string;
  text: string;
  meta: string;
  timestamp: string;
};

async function fetchRecentActivity(): Promise<ActivityItem[]> {
  const admin = createAdminClient();
  const [listings, payments, reports] = await Promise.all([
    admin
      .from("listings")
      .select("id,title,status,created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    admin
      .from("payments")
      .select("id,item,amount,created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    admin
      .from("reports")
      .select("id,type,target_id,created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const items: ActivityItem[] = [];

  for (const l of (listings.data ?? []) as Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
  }>) {
    items.push({
      type: "listing",
      label: l.status === "approved" ? "승인" : "매물",
      text: l.title,
      meta: `#${l.id}`,
      timestamp: l.created_at,
    });
  }

  for (const p of (payments.data ?? []) as Array<{
    id: string;
    item: string;
    amount: number;
    created_at: string;
  }>) {
    items.push({
      type: "payment",
      label: "결제",
      text: `${p.item} (${p.amount.toLocaleString()}원)`,
      meta: p.id,
      timestamp: p.created_at,
    });
  }

  for (const r of (reports.data ?? []) as Array<{
    id: number;
    type: string;
    target_id: number;
    created_at: string;
  }>) {
    items.push({
      type: "report",
      label: "신고",
      text: `${r.type} (#${r.target_id})`,
      meta: `R-${r.id}`,
      timestamp: r.created_at,
    });
  }

  return items
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 6);
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    fetchStats(),
    fetchRecentActivity(),
  ]);

  const cards = [
    { label: "총 회원수", value: stats.totalUsers.toLocaleString(), suffix: "명" },
    { label: "오늘 신규 가입", value: stats.newUsersToday.toLocaleString(), suffix: "명" },
    { label: "전체 매물", value: stats.totalListings.toLocaleString(), suffix: "건" },
    { label: "오늘 등록", value: stats.listingsToday.toLocaleString(), suffix: "건" },
    { label: "승인 대기", value: stats.pending.toLocaleString(), suffix: "건" },
    { label: "오늘 결제", value: stats.todayPaid.toLocaleString(), suffix: "원" },
  ];

  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">관리자 대시보드</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
        {cards.map((s) => (
          <div key={s.label} className="bg-white rounded-md border border-border p-3 lg:p-4">
            <p className="text-[11px] text-muted">{s.label}</p>
            <p className="text-lg lg:text-2xl font-black mt-1 tabular">
              {s.value}
              <span className="text-sm font-semibold text-muted ml-1">{s.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-md border border-border p-4">
          <h2 className="font-bold text-sm mb-3">긴급 처리 항목</h2>
          <div className="space-y-2">
            {stats.pending > 0 ? (
              <Link
                href="/admin/listings"
                className="flex items-center justify-between p-3 border border-border rounded hover:bg-zinc-50"
              >
                <div>
                  <p className="text-sm font-bold">매물 승인 대기</p>
                  <p className="text-xs text-muted tabular">
                    {stats.pending}건이 검토를 기다리고 있습니다
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-foreground text-white text-xs font-bold rounded">
                  처리하기
                  <Icon.ChevronRight size={11} />
                </span>
              </Link>
            ) : (
              <p className="text-[13px] text-muted py-3">처리 대기 항목이 없습니다.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md border border-border p-4">
          <h2 className="font-bold text-sm mb-3">최근 활동</h2>
          {activity.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {activity.map((a, i) => (
                <li
                  key={`${a.type}-${a.meta}-${i}`}
                  className="flex items-start gap-2 pb-2 border-b border-border last:border-0"
                >
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 border bg-white ${
                      a.type === "listing"
                        ? "border-foreground text-foreground"
                        : a.type === "payment"
                        ? "border-free text-free"
                        : "border-urgent text-urgent"
                    }`}
                  >
                    {a.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs line-clamp-1">{a.text}</p>
                    <p className="text-[10px] text-muted mt-0.5 tabular">
                      {formatRelativeDate(a.timestamp)} · {a.meta}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-muted py-3">최근 활동이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
