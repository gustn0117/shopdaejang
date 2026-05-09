import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatKRW, formatRelativeDate } from "@/lib/format";
import { TierBadge } from "./TierBadge";
import { Thumbnail } from "./Thumbnail";

export function UrgentCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-md overflow-hidden border border-border hover:border-foreground transition-colors"
    >
      <div className="relative aspect-4/3 bg-zinc-100 overflow-hidden">
        <Thumbnail
          src={listing.thumbnail}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <TierBadge tier="urgent" />
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-[11px] text-muted mb-1.5 line-clamp-1">
          {listing.region} · {listing.category} · {listing.area}평
        </p>
        <h3 className="font-semibold text-[14px] line-clamp-1 mb-3 text-foreground group-hover:text-foreground/70">
          {listing.title}
        </h3>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-black text-base text-foreground tabular">
            {formatKRW(listing.deposit + listing.premium)}
          </span>
          <span className="text-[10px] text-muted">합계</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted tabular">
          <span>월 {listing.monthlyRent.toLocaleString()}</span>
          <span>조회 {listing.views.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export function PremiumCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex gap-3 bg-white rounded-md p-3 border border-border hover:border-foreground transition-colors"
    >
      <div className="relative w-24 h-24 lg:w-28 lg:h-28 shrink-0 bg-zinc-100 rounded overflow-hidden">
        <Thumbnail
          src={listing.thumbnail}
          alt={listing.title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <TierBadge tier="premium" size="xs" />
          <span className="text-[11px] text-muted">{listing.category} · {listing.area}평</span>
        </div>
        <h3 className="font-semibold text-[14px] lg:text-[15px] line-clamp-1 mb-1 group-hover:text-foreground/70">
          {listing.title}
        </h3>
        <p className="text-[12px] text-muted line-clamp-1 mb-2">
          {listing.region}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap text-[11px] tabular">
          <span className="text-muted">보 {listing.deposit.toLocaleString()}</span>
          <span className="text-muted">월 {listing.monthlyRent.toLocaleString()}</span>
          <span className="text-muted">권 {listing.premium.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="font-black text-sm text-foreground tabular">
            합계 {formatKRW(listing.deposit + listing.premium)}
          </span>
          <span className="text-[10px] text-muted">
            {formatRelativeDate(listing.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NormalRow({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-3 px-4 py-3 bg-white border-b border-border last:border-0 hover:bg-primary-soft transition-colors"
    >
      <TierBadge tier={listing.tier} size="xs" />
      <span className="text-xs text-muted shrink-0 w-20 truncate">
        {listing.region}
      </span>
      <span className="text-xs text-foreground font-medium shrink-0 w-14">
        {listing.category}
      </span>
      <h3 className="flex-1 text-[13px] font-medium line-clamp-1 group-hover:text-foreground/70">
        {listing.title}
      </h3>
      <span className="hidden sm:inline text-xs text-muted shrink-0 w-12 text-right tabular">
        {listing.area}평
      </span>
      <span className="hidden md:inline text-xs text-muted shrink-0 w-16 text-right tabular">
        월 {listing.monthlyRent.toLocaleString()}
      </span>
      <span className="font-bold text-xs text-foreground shrink-0 w-16 text-right tabular">
        {formatKRW(listing.deposit + listing.premium)}
      </span>
      <span className="hidden sm:inline text-[11px] text-muted shrink-0 w-14 text-right">
        {formatRelativeDate(listing.createdAt)}
      </span>
    </Link>
  );
}

export function FreeRow({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-2 px-4 py-2.5 bg-white border-b border-border last:border-0 hover:bg-primary-soft transition-colors"
    >
      <TierBadge tier="free" size="xs" />
      <span className="text-[11px] text-muted shrink-0 w-20 truncate">
        {listing.region}
      </span>
      <span className="text-[11px] text-foreground shrink-0 w-14">
        {listing.category}
      </span>
      <h3 className="flex-1 text-xs lg:text-[13px] line-clamp-1 group-hover:text-foreground/70">
        {listing.title}
      </h3>
      <span className="hidden md:inline text-[11px] text-muted shrink-0 tabular">
        조회 {listing.views.toLocaleString()}
      </span>
      <span className="text-[11px] text-muted shrink-0 w-14 text-right">
        {formatRelativeDate(listing.createdAt)}
      </span>
    </Link>
  );
}
