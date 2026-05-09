import Link from "next/link";
import Image from "next/image";
import { SAMPLE_USED_GOODS } from "@/lib/data";
import { formatRelativeDate, formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "업주 직거래 중고장터",
  description: "마사지샵 운영 업주들이 용품과 집기를 직거래하는 공간",
};

type SP = Promise<{ category?: string; status?: string }>;

export default async function UsedPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  let items = [...SAMPLE_USED_GOODS];
  if (sp.category && sp.category !== "all") {
    items = items.filter((i) => i.category === sp.category);
  }
  if (sp.status === "active") {
    items = items.filter((i) => !i.isCompleted);
  }

  const TABS = [
    { v: "all", l: "전체" },
    { v: "팝니다", l: "팝니다" },
    { v: "삽니다", l: "삽니다" },
  ];

  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight">업주 직거래 중고장터</h1>
          <p className="text-xs lg:text-sm text-muted mt-1">
            마사지샵 용품과 집기를 업주들끼리 직거래하세요
          </p>
        </div>
        <Link href="/used/write" className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-white text-xs lg:text-sm font-bold rounded">
          <Icon.Plus size={14} strokeWidth={2.4} />
          글쓰기
        </Link>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="border-b border-border px-3 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1">
            {TABS.map((t) => {
              const active = (sp.category ?? "all") === t.v;
              return (
                <Link
                  key={t.v}
                  href={t.v === "all" ? "/used" : `/used?category=${t.v}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${
                    active ? "bg-foreground text-white" : "bg-zinc-100 text-muted hover:bg-zinc-200"
                  }`}
                >
                  {t.l}
                </Link>
              );
            })}
          </div>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input type="checkbox" className="accent-foreground" />
            판매완료 제외
          </label>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/used/${item.id}`} className="flex gap-3 p-3 hover:bg-zinc-50">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded bg-zinc-100 overflow-hidden">
                  <Image src={item.thumbnail} alt={item.title} fill sizes="100px" className="object-cover" unoptimized />
                  {item.isCompleted && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-black">판매완료</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      item.category === "팝니다" ? "bg-foreground text-white" : "bg-premium text-white"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted truncate">{item.region}</span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-muted line-clamp-1 mb-1.5">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-foreground">
                      {formatPrice(item.price)}원
                    </span>
                    <span className="text-[11px] text-muted">
                      조회 {item.views} · {formatRelativeDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-[11px] text-muted bg-zinc-50 border border-border rounded p-3">
        <p className="font-bold mb-1 flex items-center gap-1.5 text-foreground">
          <Icon.Bulb size={12} strokeWidth={2.2} />
          안전 거래 팁
        </p>
        <p>· 직접 만나서 물건을 확인하고 거래하세요</p>
        <p>· 입금 전 판매자 신원과 매물 상태를 꼼꼼히 확인하세요</p>
        <p>· 의심스러운 거래는 신고 부탁드립니다</p>
      </div>
    </div>
  );
}
