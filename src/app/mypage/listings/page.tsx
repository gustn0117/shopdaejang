import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TierBadge } from "@/components/TierBadge";
import { formatRelativeDate } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { STRIPED_BG } from "@/lib/placeholder";

export const metadata = { title: "매물관리" };

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  approved: { label: "노출중", className: "border-free text-free" },
  pending: { label: "승인대기", className: "border-foreground text-foreground" },
  rejected: { label: "반려", className: "border-urgent text-urgent" },
  expired: { label: "기간만료", className: "border-border-strong text-muted" },
  sold: { label: "판매완료", className: "border-premium text-premium" },
};

type SP = Promise<{ status?: string }>;

type MyListing = {
  id: number;
  title: string;
  thumbnail: string | null;
  tier: string;
  status: keyof typeof STATUS_LABELS;
  region: string;
  category: string;
  area: number;
  views: number;
  favorites: number;
  created_at: string;
};

export default async function MyListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let my: MyListing[] = [];
  if (user) {
    let q = supabase
      .from("listings")
      .select("id,title,thumbnail,tier,status,sido,sigungu,dong,category,area,views,favorites,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (sp.status) q = q.eq("status", sp.status);
    const { data } = await q;
    my = (data ?? []).map((r) => ({
      id: r.id as number,
      title: r.title as string,
      thumbnail: (r.thumbnail as string) ?? null,
      tier: r.tier as string,
      status: r.status as MyListing["status"],
      region: `${r.sido} ${r.sigungu}${r.dong ? " " + r.dong : ""}`,
      category: r.category as string,
      area: Number(r.area),
      views: Number(r.views),
      favorites: Number(r.favorites),
      created_at: r.created_at as string,
    }));
  }

  const counts = { all: my.length, approved: my.filter((m) => m.status === "approved").length, pending: my.filter((m) => m.status === "pending").length, expired: my.filter((m) => m.status === "expired").length, sold: my.filter((m) => m.status === "sold").length };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">매물관리</h1>
        <Link href="/mypage/register" className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded">
          <Icon.Plus size={12} strokeWidth={2.5} />
          새 매물 등록
        </Link>
      </div>

      <div className="bg-white rounded-md border border-border p-2 flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { v: "", l: `전체 (${counts.all})` },
          { v: "approved", l: `노출중 (${counts.approved})` },
          { v: "pending", l: `승인대기 (${counts.pending})` },
          { v: "expired", l: `기간만료 (${counts.expired})` },
          { v: "sold", l: `판매완료 (${counts.sold})` },
        ].map((t) => (
          <Link
            key={t.v}
            href={t.v ? `/mypage/listings?status=${t.v}` : "/mypage/listings"}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded ${
              (sp.status ?? "") === t.v ? "bg-foreground text-white" : "text-muted hover:bg-zinc-50"
            }`}
          >
            {t.l}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {my.map((l) => {
          const s = STATUS_LABELS[l.status] ?? STATUS_LABELS.pending;
          return (
            <div key={l.id} className="bg-white rounded-md border border-border p-3 flex flex-col sm:flex-row gap-3">
              <div className="flex gap-3 flex-1 min-w-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded bg-cover bg-center"
                  style={{
                    backgroundImage: l.thumbnail
                      ? `url(${l.thumbnail}), url("${STRIPED_BG}")`
                      : `url("${STRIPED_BG}")`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <TierBadge tier={l.tier as "urgent" | "premium" | "normal" | "free"} size="xs" />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${s.className}`}>
                      {s.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1">{l.title}</h3>
                  <p className="text-[11px] text-muted mt-0.5">
                    {l.region} · {l.category} · {l.area}평
                  </p>
                  <p className="text-[11px] text-muted">
                    등록 {formatRelativeDate(l.created_at)} · 조회 {l.views.toLocaleString()} · 찜 {l.favorites}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col gap-1 sm:w-24">
                <Link href={`/listings/${l.id}`} className="flex-1 sm:flex-none px-2 py-1.5 text-xs text-center border border-border rounded font-semibold hover:border-foreground">
                  미리보기
                </Link>
                <button type="button" className="flex-1 sm:flex-none px-2 py-1.5 text-xs border border-border rounded font-semibold hover:border-foreground">
                  수정
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {my.length === 0 && (
        <div className="bg-white rounded-md border border-border p-12 text-center text-sm text-muted">
          {user ? "등록한 매물이 없습니다. 우측 상단에서 새 매물을 등록해보세요." : "로그인 후 이용해주세요."}
        </div>
      )}
    </div>
  );
}
