import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchUsedGoodById } from "@/lib/db";
import { formatPrice, formatRelativeDate } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { Thumbnail } from "@/components/Thumbnail";

export default async function UsedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await fetchUsedGoodById(Number(id));
  if (!item) notFound();

  return (
    <div className="container-custom py-4 lg:py-6 max-w-3xl">
      <Link href="/used" className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground">
        <Icon.ChevronLeft size={12} />
        중고장터 목록
      </Link>

      <div className="bg-white rounded-md border border-border overflow-hidden mt-3">
        <div className="relative aspect-square sm:aspect-16/10 bg-zinc-100">
          <Thumbnail src={item.thumbnail} alt={item.title} fill sizes="800px" className="object-cover" />
          {item.isCompleted && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 text-white text-xs font-black rounded">
              판매완료
            </div>
          )}
        </div>
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-1 mb-2">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              item.category === "팝니다" ? "bg-foreground text-white" : "bg-premium text-white"
            }`}>{item.category}</span>
            <span className="text-xs text-muted">{item.region}</span>
            <span className="text-xs text-muted ml-auto">{formatRelativeDate(item.createdAt)}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black mb-2 tracking-tight">{item.title}</h1>
          <p className="text-2xl lg:text-3xl font-black text-foreground mb-4">
            {formatPrice(item.price)}원
          </p>
          <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-t border-border pt-4">
            {item.description}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="inline-flex items-center justify-center gap-1.5 py-3 bg-foreground text-white font-bold rounded">
          <Icon.Phone size={14} strokeWidth={2.4} />
          전화걸기
        </button>
        <button type="button" className="inline-flex items-center justify-center gap-1.5 py-3 bg-[#FEE500] text-black font-bold rounded">
          <Icon.Chat size={14} strokeWidth={2.2} />
          카톡 채팅
        </button>
      </div>

      <div className="mt-3 text-center">
        <button type="button" className="inline-flex items-center gap-1 text-xs text-muted hover:text-urgent">
          <Icon.Flag size={12} />
          신고하기
        </button>
      </div>
    </div>
  );
}
