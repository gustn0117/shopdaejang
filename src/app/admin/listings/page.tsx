import Link from "next/link";
import { formatRelativeDate } from "@/lib/format";
import { RowActions } from "./RowActions";
import { TierSelect } from "./TierSelect";
import { STRIPED_BG } from "@/lib/placeholder";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "매물 승인", robots: "noindex" };
export const dynamic = "force-dynamic";

type Status = "pending" | "approved" | "rejected" | "all";

type SP = Promise<{ status?: string }>;

const TABS: { value: Status; label: string }[] = [
  { value: "pending", label: "승인대기" },
  { value: "approved", label: "승인완료" },
  { value: "rejected", label: "반려" },
  { value: "all", label: "전체" },
];

async function fetchCounts() {
  const admin = createAdminClient();
  const [p, a, r, all] = await Promise.all([
    admin.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("listings").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("listings").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("listings").select("id", { count: "exact", head: true }),
  ]);
  return {
    pending: p.count ?? 0,
    approved: a.count ?? 0,
    rejected: r.count ?? 0,
    all: all.count ?? 0,
  };
}

async function fetchRows(status: Status) {
  const admin = createAdminClient();
  let q = admin
    .from("listings")
    .select("id,title,thumbnail,tier,status,sido,sigungu,dong,category,area,user_id,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status !== "all") q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Array<{
    id: number;
    title: string;
    thumbnail: string | null;
    tier: "urgent" | "premium" | "normal" | "free";
    status: "pending" | "approved" | "rejected" | "expired" | "sold";
    sido: string;
    sigungu: string;
    dong: string | null;
    category: string;
    area: number;
    user_id: string | null;
    created_at: string;
  }>;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: "승인대기", cls: "border-foreground text-foreground" },
  approved: { label: "노출중", cls: "border-free text-free" },
  rejected: { label: "반려", cls: "border-urgent text-urgent" },
  expired: { label: "기간만료", cls: "border-border-strong text-muted" },
  sold: { label: "판매완료", cls: "border-premium text-premium" },
};

export default async function AdminListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = (TABS.find((t) => t.value === sp.status)?.value ?? "pending") as Status;

  const [counts, rows] = await Promise.all([fetchCounts(), fetchRows(status)]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">매물 승인 관리</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted tabular">
            {status === "pending"
              ? `검토 대기 ${counts.pending}건`
              : status === "approved"
              ? `노출중 ${counts.approved}건`
              : status === "rejected"
              ? `반려 ${counts.rejected}건`
              : `전체 ${counts.all}건`}
          </span>
          <Link
            href="/admin/listings/new"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded hover:bg-foreground/90"
          >
            + 직접 등록
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-md border border-border p-2 flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const active = status === t.value;
          const count =
            t.value === "pending"
              ? counts.pending
              : t.value === "approved"
              ? counts.approved
              : t.value === "rejected"
              ? counts.rejected
              : counts.all;
          return (
            <Link
              key={t.value}
              href={t.value === "pending" ? "/admin/listings" : `/admin/listings?status=${t.value}`}
              className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                active ? "bg-foreground text-white" : "text-muted hover:bg-zinc-50"
              }`}
            >
              {t.label} <span className="tabular opacity-80">({count})</span>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden lg:grid grid-cols-[40px_80px_1fr_120px_100px_100px_180px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
          <div>
            <input type="checkbox" className="accent-foreground" />
          </div>
          <div>광고</div>
          <div>매물 정보</div>
          <div>등록자</div>
          <div>등록일</div>
          <div>상태</div>
          <div className="text-center">처리</div>
        </div>
        {rows.length === 0 && (
          <div className="p-8 text-center text-sm text-muted">
            {status === "pending"
              ? "승인 대기 중인 매물이 없습니다."
              : status === "approved"
              ? "노출중인 매물이 없습니다."
              : status === "rejected"
              ? "반려된 매물이 없습니다."
              : "등록된 매물이 없습니다."}
          </div>
        )}
        <ul className="divide-y divide-border">
          {rows.map((l) => {
            const region = `${l.sido} ${l.sigungu}${l.dong ? " " + l.dong : ""}`;
            const badge = STATUS_BADGE[l.status] ?? STATUS_BADGE.pending;
            return (
              <li
                key={l.id}
                className="px-3 py-3 grid grid-cols-1 lg:grid-cols-[40px_80px_1fr_120px_100px_100px_180px] gap-2 items-center text-sm"
              >
                <div className="hidden lg:block">
                  <input type="checkbox" className="accent-foreground" />
                </div>
                <div className="hidden lg:block">
                  <TierSelect id={l.id} tier={l.tier} />
                </div>
                <div className="flex gap-2 items-center min-w-0">
                  <div
                    className="w-12 h-12 lg:w-10 lg:h-10 rounded shrink-0 bg-cover bg-center"
                    style={{
                      backgroundImage: l.thumbnail
                        ? `url(${l.thumbnail}), url("${STRIPED_BG}")`
                        : `url("${STRIPED_BG}")`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="lg:hidden mb-1">
                      <TierSelect id={l.id} tier={l.tier} />
                    </div>
                    <p className="text-xs font-bold line-clamp-1">{l.title}</p>
                    <p className="text-[11px] text-muted">
                      {region} · {l.category} · {l.area}평
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted hidden lg:block">
                  {l.user_id ? l.user_id.slice(0, 8) : "—"}
                </div>
                <div className="text-xs text-muted hidden lg:block">
                  {formatRelativeDate(l.created_at)}
                </div>
                <div className="text-xs hidden lg:block">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <RowActions id={l.id} status={l.status} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
