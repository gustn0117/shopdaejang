import Link from "next/link";
import { fetchUsedGoods } from "@/lib/db";
import { formatRelativeDate, formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { Thumbnail } from "@/components/Thumbnail";

export const metadata = {
  title: "업주 직거래 중고장터",
  description: "마사지샵 운영 업주들이 용품과 집기를 직거래하는 공간",
};

type SP = Promise<{ category?: string; status?: string }>;

export default async function UsedPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const items = await fetchUsedGoods({
    category: sp.category && sp.category !== "all" ? sp.category : undefined,
    activeOnly: sp.status === "active",
  });

  const TABS = [
    { v: "all", l: "전체" },
    { v: "팝니다", l: "팝니다" },
    { v: "삽니다", l: "삽니다" },
  ];

  return (
    <div className="container-custom py-6 lg:py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
            Used Market
          </p>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">업주 직거래 중고장터</h1>
          <p className="text-sm text-muted mt-2">
            마사지샵 용품과 집기를 업주들끼리 직거래하세요
          </p>
        </div>
        <Link
          href="/used/write"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-foreground text-white text-sm font-semibold rounded-md hover:bg-foreground-soft"
        >
          <Icon.Plus size={14} strokeWidth={2.4} />
          글쓰기
        </Link>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1">
            {TABS.map((t) => {
              const active = (sp.category ?? "all") === t.v;
              return (
                <Link
                  key={t.v}
                  href={t.v === "all" ? "/used" : `/used?category=${t.v}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                    active ? "bg-foreground text-white" : "text-muted hover:bg-primary-soft"
                  }`}
                >
                  {t.l}
                </Link>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-[12px] cursor-pointer text-muted">
            <input type="checkbox" className="accent-foreground" />
            판매완료 제외
          </label>
        </div>

        {items.length > 0 ? (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/used/${item.id}`} className="flex gap-4 p-4 hover:bg-primary-soft transition-colors">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md bg-zinc-100 overflow-hidden">
                    <Thumbnail src={item.thumbnail} alt={item.title} fill sizes="120px" className="object-cover" />
                    {item.isCompleted && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-black">판매완료</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        item.category === "팝니다" ? "bg-foreground text-white" : "bg-premium text-white"
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[11px] text-muted truncate">{item.region}</span>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-1 mb-1">{item.title}</h3>
                    <p className="text-[12px] text-muted line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-foreground tabular">
                        {formatPrice(item.price)}원
                      </span>
                      <span className="text-[11px] text-muted tabular">
                        조회 {item.views} · {formatRelativeDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-sm text-muted">
            등록된 매물이 없습니다.
          </div>
        )}
      </div>

      <div className="mt-6 text-[12px] text-muted bg-white border border-border rounded-md p-4">
        <p className="font-bold mb-2 flex items-center gap-1.5 text-foreground">
          <Icon.Bulb size={13} strokeWidth={2.2} />
          안전 거래 팁
        </p>
        <ul className="space-y-1 leading-relaxed">
          <li>· 직접 만나서 물건을 확인하고 거래하세요</li>
          <li>· 입금 전 판매자 신원과 매물 상태를 꼼꼼히 확인하세요</li>
          <li>· 의심스러운 거래는 신고 부탁드립니다</li>
        </ul>
      </div>
    </div>
  );
}
