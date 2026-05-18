import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import { DeleteListingButton } from "@/components/DeleteListingButton";

export const metadata = { title: "매물관리" };

type SP = Promise<{ status?: string }>;

const TIERS: { key: "urgent" | "premium" | "normal" | "free"; label: string; badge: string }[] = [
  { key: "urgent", label: "긴급급매물", badge: "badge-urgent" },
  { key: "premium", label: "프리미엄매물", badge: "badge-premium" },
  { key: "normal", label: "일반매물", badge: "badge-normal" },
  { key: "free", label: "무료매물", badge: "badge-free" },
];

type MyListing = {
  id: number;
  title: string;
  tier: "urgent" | "premium" | "normal" | "free";
  status: string;
  region: string;
  category: string;
  area: number;
  views: number;
  favorites: number;
  created_at: string;
  ad_expires_at: string | null;
};

export default async function MyListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let my: MyListing[] = [];
  if (user) {
    let q = supabase
      .from("listings")
      .select("id,title,tier,status,sido,sigungu,dong,category,area,views,favorites,created_at,ad_expires_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (sp.status) q = q.eq("status", sp.status);
    const { data } = await q;
    my = (data ?? []).map((r) => ({
      id: r.id as number,
      title: r.title as string,
      tier: r.tier as MyListing["tier"],
      status: r.status as string,
      region: `${r.sido} ${r.sigungu}${r.dong ? " " + r.dong : ""}`,
      category: r.category as string,
      area: Number(r.area),
      views: Number(r.views),
      favorites: Number(r.favorites),
      created_at: r.created_at as string,
      ad_expires_at: (r.ad_expires_at as string) ?? null,
    }));
  }

  const counts = {
    all: my.length,
    approved: my.filter((m) => m.status === "approved").length,
    pending: my.filter((m) => m.status === "pending").length,
    expired: my.filter((m) => m.status === "expired").length,
    sold: my.filter((m) => m.status === "sold").length,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">매물관리</h1>
        <Link
          href="/mypage/register"
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-white text-xs font-bold rounded"
        >
          <Icon.Plus size={12} strokeWidth={2.5} />새 매물 등록
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

      {/* 데스크탑: 테이블 */}
      <div className="hidden lg:block bg-white rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-border">
            <tr className="text-xs font-bold text-muted">
              <th className="px-3 py-3 text-center w-20">매물번호</th>
              <th className="px-3 py-3 text-left">제목</th>
              <th className="px-3 py-3 text-left w-72">광고현황</th>
              <th className="px-3 py-3 text-center w-32">기간연장</th>
              <th className="px-3 py-3 text-center w-32">수정 / 삭제</th>
            </tr>
          </thead>
          <tbody>
            {my.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-zinc-50/50">
                <td className="px-3 py-3 text-center tabular text-xs font-semibold text-muted">
                  #{l.id}
                </td>
                <td className="px-3 py-3 min-w-0">
                  <Link
                    href={`/listings/${l.id}`}
                    className="font-bold text-[13px] line-clamp-1 hover:text-foreground/70 block"
                  >
                    {l.title}
                  </Link>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                    {l.region} · {l.category} · {l.area}평 · 조회 {l.views.toLocaleString()}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <AdStatusGrid currentTier={l.tier} currentStatus={l.status} expiresAt={l.ad_expires_at} />
                </td>
                <td className="px-3 py-3 text-center">
                  <Link
                    href={`/mypage/listings/${l.id}/renew`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded bg-[#2952d6] text-white hover:bg-[#1f3fa8]"
                  >
                    <Icon.Plus size={11} strokeWidth={2.5} />
                    등록&연장
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/mypage/listings/${l.id}/edit`}
                      className="px-2.5 py-1.5 text-xs font-semibold border border-border rounded hover:border-foreground"
                    >
                      수정
                    </Link>
                    <DeleteListingButton id={l.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {my.length === 0 && (
          <div className="p-12 text-center text-sm text-muted">
            {user ? "등록한 매물이 없습니다." : "로그인 후 이용해주세요."}
          </div>
        )}
      </div>

      {/* 모바일: 카드 */}
      <div className="lg:hidden space-y-2">
        {my.map((l) => (
          <div key={l.id} className="bg-white rounded-md border border-border p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] tabular text-muted font-semibold">#{l.id}</span>
              <Link
                href={`/mypage/listings/${l.id}/renew`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded bg-[#2952d6] text-white"
              >
                <Icon.Plus size={10} strokeWidth={2.5} />
                등록&연장
              </Link>
            </div>
            <Link href={`/listings/${l.id}`} className="font-bold text-sm line-clamp-1 block mb-1">
              {l.title}
            </Link>
            <p className="text-[11px] text-muted mb-2">
              {l.region} · {l.category} · {l.area}평
            </p>
            <div className="mb-2">
              <AdStatusGrid currentTier={l.tier} currentStatus={l.status} expiresAt={l.ad_expires_at} />
            </div>
            <div className="flex gap-1">
              <Link
                href={`/listings/${l.id}`}
                className="flex-1 text-xs text-center py-1.5 border border-border rounded font-semibold"
              >
                미리보기
              </Link>
              <Link
                href={`/mypage/listings/${l.id}/edit`}
                className="flex-1 text-xs text-center py-1.5 border border-border rounded font-semibold"
              >
                수정
              </Link>
              <DeleteListingButton id={l.id} />
            </div>
          </div>
        ))}
        {my.length === 0 && (
          <div className="bg-white rounded-md border border-border p-12 text-center text-sm text-muted">
            {user ? "등록한 매물이 없습니다." : "로그인 후 이용해주세요."}
          </div>
        )}
      </div>
    </div>
  );
}

function AdStatusGrid({
  currentTier,
  currentStatus,
  expiresAt,
}: {
  currentTier: "urgent" | "premium" | "normal" | "free";
  currentStatus: string;
  expiresAt: string | null;
}) {
  const now = Date.now();
  const expired = expiresAt ? new Date(expiresAt).getTime() < now : currentStatus === "expired";
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
      {TIERS.map((t) => {
        const isCurrent = t.key === currentTier;
        let label = "종료";
        let cls = "text-muted";
        if (isCurrent) {
          if (currentStatus === "approved" && !expired) {
            label = expiresAt
              ? `~${new Date(expiresAt).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}`
              : "노출중";
            cls = "text-[#2952d6] font-bold";
          } else if (currentStatus === "pending") {
            label = "승인대기";
            cls = "text-foreground font-semibold";
          } else if (currentStatus === "sold") {
            label = "판매완료";
            cls = "text-premium font-bold";
          }
        }
        return (
          <div key={t.key} className="flex items-center justify-between text-[11px]">
            <span className="text-foreground/80">· {t.label}</span>
            <span className={cls}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
