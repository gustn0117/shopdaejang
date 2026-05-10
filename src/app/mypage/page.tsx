import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import { TierBadge } from "@/components/TierBadge";
import type { Listing } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "마이페이지" };

async function fetchMyStats(userId: string) {
  const admin = createAdminClient();
  const [total, approved, pending, favs] = await Promise.all([
    admin.from("listings").select("id", { count: "exact", head: true }).eq("user_id", userId),
    admin.from("listings").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "approved"),
    admin.from("listings").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "pending"),
    admin.from("favorites").select("listing_id", { count: "exact", head: true }).eq("user_id", userId),
  ]);
  return {
    total: total.count ?? 0,
    approved: approved.count ?? 0,
    pending: pending.count ?? 0,
    favs: favs.count ?? 0,
  };
}

async function fetchRecentListings(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id,title,tier,status,views,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data ?? []) as Array<{
    id: number;
    title: string;
    tier: Listing["tier"];
    status: Listing["status"];
    views: number;
    created_at: string;
  }>;
}

async function fetchRecentPayments(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("id,item,amount,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data ?? []) as Array<{
    id: string;
    item: string;
    amount: number;
    created_at: string;
  }>;
}

const STATUS_LABEL: Record<Listing["status"], { label: string; className: string }> = {
  approved: { label: "노출중", className: "border-free text-free" },
  pending: { label: "승인대기", className: "border-foreground text-foreground" },
  rejected: { label: "반려", className: "border-urgent text-urgent" },
  expired: { label: "기간만료", className: "border-border-strong text-muted" },
  sold: { label: "판매완료", className: "border-premium text-premium" },
};

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "회원";

  const [stats, recentListings, recentPayments] = user
    ? await Promise.all([
        fetchMyStats(user.id),
        fetchRecentListings(user.id),
        fetchRecentPayments(user.id),
      ])
    : [{ total: 0, approved: 0, pending: 0, favs: 0 }, [], []];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
          My Page
        </p>
        <h1 className="h-display text-2xl lg:text-3xl">
          안녕하세요, <span className="text-muted-strong">{name}</span>님
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "내 매물", value: stats.total, href: "/mypage/listings" },
          { label: "노출중", value: stats.approved, href: "/mypage/listings?status=approved" },
          { label: "승인대기", value: stats.pending, href: "/mypage/listings?status=pending" },
          { label: "찜한매물", value: stats.favs, href: "/mypage/favorites" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="surface-card p-4 lg:p-5 hover:border-foreground transition-colors"
          >
            <p className="text-[11px] text-muted mb-1.5">{s.label}</p>
            <p className="text-xl lg:text-2xl font-black tabular tracking-tight">
              {s.value.toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-muted">
              자세히
              <Icon.ChevronRight size={11} />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm tracking-tight">최근 매물</h2>
            <Link
              href="/mypage/listings"
              className="inline-flex items-center gap-0.5 text-[12px] text-muted hover:text-foreground"
            >
              전체보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          {recentListings.length > 0 ? (
            <ul className="space-y-2">
              {recentListings.map((l) => {
                const s = STATUS_LABEL[l.status] ?? STATUS_LABEL.pending;
                return (
                  <li key={l.id} className="border border-border rounded p-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <TierBadge tier={l.tier} size="xs" />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${s.className}`}>
                        {s.label}
                      </span>
                    </div>
                    <Link
                      href={`/listings/${l.id}`}
                      className="text-[13px] font-semibold line-clamp-1 hover:text-foreground/70"
                    >
                      {l.title}
                    </Link>
                    <p className="text-[11px] text-muted mt-1 tabular">
                      조회 {l.views.toLocaleString()} · {formatRelativeDate(l.created_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              등록한 매물이 없습니다. 우측 상단에서 새 매물을 등록해보세요.
            </p>
          )}
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm tracking-tight">최근 결제내역</h2>
            <Link
              href="/mypage/payments"
              className="inline-flex items-center gap-0.5 text-[12px] text-muted hover:text-foreground"
            >
              전체보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          {recentPayments.length > 0 ? (
            <ul className="space-y-2">
              {recentPayments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between border border-border rounded p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold line-clamp-1">{p.item}</p>
                    <p className="text-[11px] text-muted tabular">
                      {formatRelativeDate(p.created_at)}
                    </p>
                  </div>
                  <span className="font-black text-sm tabular shrink-0">
                    {p.amount.toLocaleString()}원
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">결제 내역이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-md p-5">
        <p className="text-sm font-bold mb-2 inline-flex items-center gap-2">
          <Icon.Megaphone size={13} strokeWidth={2} />
          알림
        </p>
        <p className="text-[12px] text-muted leading-relaxed">
          광고 만료 7일 전, 새로운 찜 등록, 매물 승인 결과 등 주요 알림을 이곳에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
