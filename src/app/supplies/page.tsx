import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "용품도매장터",
  description: "마사지 관련 용품 및 도매 거래",
};

const CATEGORIES: { name: string; icon: keyof typeof Icon }[] = [
  { name: "마사지베드", icon: "Bed" },
  { name: "마사지오일", icon: "Drop" },
  { name: "타올/리넨", icon: "Scroll" },
  { name: "안마기/기기", icon: "Dumbbell" },
  { name: "인테리어소품", icon: "Plant" },
  { name: "유니폼/위생", icon: "Shirt" },
  { name: "관리/세정용품", icon: "Bottle" },
  { name: "기타용품", icon: "Box" },
];

const ITEMS: {
  id: number;
  title: string;
  supplier: string;
  price: number;
  original: number;
  region: string;
  badge: string;
}[] = [];

export default function SuppliesPage() {
  return (
    <div className="container-custom py-6 lg:py-10 space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
            Supplies Wholesale
          </p>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">용품도매장터</h1>
          <p className="text-sm text-muted mt-2">
            마사지 관련 용품과 도매 상품을 한눈에
          </p>
        </div>
        <Link
          href="/supplies/inquiry"
          className="px-4 py-2.5 border border-border text-sm font-semibold rounded-md hover:border-foreground"
        >
          입점 문의
        </Link>
      </div>

      <section>
        <h2 className="text-base font-bold tracking-tight mb-4">카테고리</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((c) => {
            const IconComp = Icon[c.icon] as (props: { size?: number; className?: string }) => React.ReactElement;
            return (
              <Link
                key={c.name}
                href={`/supplies?cat=${encodeURIComponent(c.name)}`}
                className="flex flex-col items-center gap-2 p-4 rounded-md border border-border bg-white hover:border-foreground hover:bg-primary-soft transition-colors"
              >
                <IconComp size={22} className="text-foreground" />
                <span className="text-[12px] font-medium text-center line-clamp-1">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted mb-1.5">
              This Week
            </p>
            <h2 className="text-lg lg:text-xl font-black tracking-tight inline-flex items-center gap-1.5">
              <Icon.Fire size={18} strokeWidth={1.8} />
              인기 도매 상품
            </h2>
          </div>
        </div>
        {ITEMS.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <Icon.Box size={28} className="mx-auto mb-3 text-muted" />
            <p className="text-sm font-semibold">등록된 도매 상품이 없습니다.</p>
            <p className="text-xs text-muted mt-1">입점 문의 후 상품이 등록되면 이곳에 노출됩니다.</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/supplies/${item.id}`}
              className="surface-card overflow-hidden hover:border-foreground transition-colors"
            >
              <div className="relative aspect-4/3 bg-primary-soft border-b border-border">
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-foreground text-white text-[10px] font-bold rounded">
                  {item.badge}
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <Icon.Box size={40} strokeWidth={1.4} />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-muted mb-1.5">{item.supplier}</p>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10 leading-tight">{item.title}</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-foreground tabular">{item.price.toLocaleString()}원</span>
                  <span className="text-xs text-urgent font-bold tabular">
                    {Math.round((1 - item.price / item.original) * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-muted line-through mt-0.5 tabular">{item.original.toLocaleString()}원</p>
                <p className="text-[10px] text-muted mt-2 inline-flex items-center gap-1">
                  <Icon.Truck size={11} />
                  {item.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
        )}
      </section>

      <div className="bg-white border border-border rounded-md p-6 lg:p-10 text-center">
        <h3 className="text-lg font-bold mb-2 tracking-tight">용품 도매 입점 문의</h3>
        <p className="text-sm text-muted mb-5 leading-relaxed">
          마사지 관련 용품을 도매로 판매하고 계신가요?
          <br />
          샵대장 도매장터에 입점해보세요.
        </p>
        <Link
          href="/supplies/inquiry"
          className="inline-flex items-center gap-1.5 px-5 py-3 bg-foreground text-white text-sm font-semibold rounded-md"
        >
          입점 문의하기
          <Icon.ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}
