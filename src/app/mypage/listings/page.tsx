import Link from "next/link";
import { SAMPLE_LISTINGS } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";
import { formatRelativeDate } from "@/lib/format";

export const metadata = { title: "매물관리" };

const STATUS_LABELS = {
  approved: { label: "노출중", className: "bg-emerald-100 text-emerald-700" },
  pending: { label: "승인대기", className: "bg-amber-100 text-amber-700" },
  rejected: { label: "반려", className: "bg-red-100 text-red-700" },
  expired: { label: "기간만료", className: "bg-zinc-100 text-zinc-700" },
  sold: { label: "판매완료", className: "bg-blue-100 text-blue-700" },
};

type SP = Promise<{ status?: string }>;

export default async function MyListingsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  // simulate user's listings
  const my = [
    { ...SAMPLE_LISTINGS[0], status: "approved" as const },
    { ...SAMPLE_LISTINGS[5], status: "pending" as const },
    { ...SAMPLE_LISTINGS[10], status: "approved" as const },
    { ...SAMPLE_LISTINGS[15], status: "expired" as const },
    { ...SAMPLE_LISTINGS[20], status: "sold" as const },
  ];

  const filtered = sp.status ? my.filter((l) => l.status === sp.status) : my;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black">매물관리</h1>
        <Link href="/mypage/register" className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded">
          + 새 매물 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border p-2 flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { v: "", l: `전체 (${my.length})` },
          { v: "approved", l: `노출중 (${my.filter((m) => m.status === "approved").length})` },
          { v: "pending", l: `승인대기 (${my.filter((m) => m.status === "pending").length})` },
          { v: "expired", l: `기간만료 (${my.filter((m) => m.status === "expired").length})` },
          { v: "sold", l: `판매완료 (${my.filter((m) => m.status === "sold").length})` },
        ].map((t) => (
          <Link
            key={t.v}
            href={t.v ? `/mypage/listings?status=${t.v}` : "/mypage/listings"}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded ${
              (sp.status ?? "") === t.v ? "bg-primary text-white" : "text-muted hover:bg-zinc-50"
            }`}
          >
            {t.l}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((l) => {
          const s = STATUS_LABELS[l.status];
          return (
            <div key={l.id} className="bg-white rounded-xl border border-border p-3 flex flex-col sm:flex-row gap-3">
              <div className="flex gap-3 flex-1 min-w-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${l.thumbnail})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <TierBadge tier={l.tier} size="xs" />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.className}`}>
                      {s.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1">{l.title}</h3>
                  <p className="text-[11px] text-muted mt-0.5">
                    {l.region} · {l.category} · {l.area}평
                  </p>
                  <p className="text-[11px] text-muted">
                    등록 {formatRelativeDate(l.createdAt)} · 조회 {l.views.toLocaleString()} · 찜 {l.favorites}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col gap-1 sm:gap-1 sm:w-24">
                <Link href={`/listings/${l.id}`} className="flex-1 sm:flex-none px-2 py-1.5 text-xs text-center border border-border rounded font-semibold hover:border-primary hover:text-primary">
                  미리보기
                </Link>
                <button className="flex-1 sm:flex-none px-2 py-1.5 text-xs border border-border rounded font-semibold hover:border-primary hover:text-primary">
                  수정
                </button>
                {l.status === "approved" && (
                  <button className="flex-1 sm:flex-none px-2 py-1.5 text-xs bg-primary text-white rounded font-bold">
                    연장결제
                  </button>
                )}
                {l.status === "expired" && (
                  <button className="flex-1 sm:flex-none px-2 py-1.5 text-xs bg-primary text-white rounded font-bold">
                    재광고
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-muted">
          해당 상태의 매물이 없습니다.
        </div>
      )}
    </div>
  );
}
