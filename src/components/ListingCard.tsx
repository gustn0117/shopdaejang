import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { formatKRW, formatRelativeDate } from "@/lib/format";
import { TierBadge } from "./TierBadge";

export function UrgentCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[4/3] bg-zinc-200 overflow-hidden">
        <Image
          src={listing.thumbnail}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <TierBadge tier="urgent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-xs font-semibold">
            {listing.region} · {listing.category} · {listing.area}평
          </p>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm line-clamp-1 mb-2 text-foreground group-hover:text-primary">
          {listing.title}
        </h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xs text-muted">합계</span>
          <span className="font-black text-base text-urgent">
            {formatKRW(listing.deposit + listing.premium)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>월{listing.monthlyRent.toLocaleString()}</span>
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
      className="group flex gap-3 bg-white rounded-lg p-3 border border-border hover:shadow-md transition-all"
    >
      <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 bg-zinc-200 rounded-lg overflow-hidden">
        <Image
          src={listing.thumbnail}
          alt={listing.title}
          fill
          sizes="120px"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <TierBadge tier="premium" size="xs" />
          <span className="text-[11px] text-muted">{listing.category} · {listing.area}평</span>
        </div>
        <h3 className="font-bold text-sm lg:text-base line-clamp-1 mb-1 group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="text-xs text-muted line-clamp-1 mb-2">
          {listing.region} · {listing.description}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap text-xs">
          <span className="text-muted">보{listing.deposit.toLocaleString()}</span>
          <span className="text-muted">월{listing.monthlyRent.toLocaleString()}</span>
          <span className="text-muted">권{listing.premium.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="font-black text-sm text-primary">
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
      className="group flex items-center gap-3 px-3 py-3 bg-white border-b border-border hover:bg-primary-light"
    >
      <TierBadge tier={listing.tier} size="xs" />
      <span className="text-xs text-muted shrink-0 w-20 truncate">
        {listing.region}
      </span>
      <span className="text-xs text-primary font-semibold shrink-0 w-14">
        {listing.category}
      </span>
      <h3 className="flex-1 text-sm font-medium line-clamp-1 group-hover:text-primary">
        {listing.title}
      </h3>
      <span className="hidden sm:inline text-xs text-muted shrink-0 w-12 text-right">
        {listing.area}평
      </span>
      <span className="hidden md:inline text-xs text-muted shrink-0 w-16 text-right">
        월 {listing.monthlyRent.toLocaleString()}
      </span>
      <span className="font-bold text-xs text-foreground shrink-0 w-16 text-right">
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
      className="group flex items-center gap-2 px-3 py-2.5 bg-white border-b border-border hover:bg-primary-light"
    >
      <TierBadge tier="free" size="xs" />
      <span className="text-[11px] text-muted shrink-0 w-20 truncate">
        {listing.region}
      </span>
      <span className="text-[11px] text-primary shrink-0 w-14">
        {listing.category}
      </span>
      <h3 className="flex-1 text-xs lg:text-sm line-clamp-1 group-hover:text-primary">
        {listing.title}
      </h3>
      <span className="hidden md:inline text-[11px] text-muted shrink-0">
        조회 {listing.views.toLocaleString()}
      </span>
      <span className="text-[11px] text-muted shrink-0 w-14 text-right">
        {formatRelativeDate(listing.createdAt)}
      </span>
    </Link>
  );
}
