import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "용품도매장터",
  description: "마사지 관련 용품 및 도매 거래",
};

const CATEGORIES: { name: string; count: number; icon: keyof typeof Icon }[] = [
  { name: "마사지베드", count: 24, icon: "Bed" },
  { name: "마사지오일", count: 38, icon: "Drop" },
  { name: "타올/리넨", count: 52, icon: "Scroll" },
  { name: "안마기/기기", count: 18, icon: "Dumbbell" },
  { name: "인테리어소품", count: 27, icon: "Plant" },
  { name: "유니폼/위생", count: 15, icon: "Shirt" },
  { name: "관리/세정용품", count: 33, icon: "Bottle" },
  { name: "기타용품", count: 19, icon: "Box" },
];

const ITEMS = [
  { id: 1, title: "프리미엄 마사지오일 1L 도매가", supplier: "(주)뷰티오일", price: 18000, original: 25000, region: "전국 배송", badge: "도매" },
  { id: 2, title: "전동베드 신상 50% 할인", supplier: "샵퍼니쳐", price: 850000, original: 1700000, region: "수도권 무료설치", badge: "특가" },
  { id: 3, title: "프리미엄 타올 100장 패키지", supplier: "타올팩토리", price: 65000, original: 85000, region: "전국 배송", badge: "베스트" },
  { id: 4, title: "샵 인테리어 소품 풀세트", supplier: "샵디자인", price: 480000, original: 650000, region: "전국 배송", badge: "신상" },
  { id: 5, title: "타올워머 2단 신제품", supplier: "쿡온", price: 230000, original: 290000, region: "전국 배송", badge: "도매" },
  { id: 6, title: "에센셜오일 모음 (10종)", supplier: "오일팜", price: 95000, original: 130000, region: "전국 배송", badge: "특가" },
];

export default function SuppliesPage() {
  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight">용품도매장터</h1>
          <p className="text-xs lg:text-sm text-muted mt-1">
            마사지 관련 용품과 도매 상품을 한눈에
          </p>
        </div>
        <Link href="/supplies/inquiry" className="px-4 py-2 border border-border text-xs lg:text-sm font-bold rounded hover:border-foreground">
          입점 문의
        </Link>
      </div>

      <section className="bg-white rounded-md border border-border p-3 lg:p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">카테고리별 용품</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {CATEGORIES.map((c) => {
            const IconComp = Icon[c.icon] as (props: { size?: number; className?: string }) => React.ReactElement;
            return (
              <Link
                key={c.name}
                href={`/supplies?cat=${encodeURIComponent(c.name)}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded border border-border hover:border-foreground hover:bg-zinc-50"
              >
                <IconComp size={22} className="text-foreground" />
                <span className="text-[11px] font-semibold text-center line-clamp-1">{c.name}</span>
                <span className="text-[10px] text-muted">{c.count}건</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-base lg:text-lg font-black mb-3 tracking-tight inline-flex items-center gap-1.5">
          <Icon.Fire size={18} strokeWidth={1.8} />
          이번주 인기 도매 상품
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/supplies/${item.id}`}
              className="bg-white rounded-md border border-border overflow-hidden hover:border-foreground transition-colors"
            >
              <div className="relative aspect-4/3 bg-zinc-50 border-b border-border">
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-foreground text-white text-[10px] font-bold rounded">
                  {item.badge}
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <Icon.Box size={40} strokeWidth={1.4} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-muted mb-1">{item.supplier}</p>
                <h3 className="font-bold text-sm line-clamp-2 mb-2 h-10">{item.title}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xs text-muted line-through">{item.original.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-foreground">{item.price.toLocaleString()}원</span>
                  <span className="text-xs text-urgent font-bold">
                    {Math.round((1 - item.price / item.original) * 100)}%
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1 inline-flex items-center gap-1">
                  <Icon.Truck size={11} />
                  {item.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="bg-white border border-border rounded-md p-4 lg:p-6 text-center">
        <h3 className="text-base font-bold mb-2">용품 도매 입점 문의</h3>
        <p className="text-sm text-muted mb-4">
          마사지 관련 용품을 도매로 판매하고 계신가요?
          <br />
          샵대장 도매장터에 입점해보세요.
        </p>
        <Link href="/supplies/inquiry" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-foreground text-white text-sm font-bold rounded">
          입점 문의하기
          <Icon.ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}
