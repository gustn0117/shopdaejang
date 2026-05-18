"use client";

import { Icon } from "./Icon";
import { FavoriteButton } from "./FavoriteButton";

export function MobileCtaBar({
  listingId,
  initialFavorited,
  initialCount,
  phone,
  useSecretNumber,
}: {
  listingId: number;
  initialFavorited: boolean;
  initialCount: number;
  phone: string;
  useSecretNumber: boolean;
}) {
  return (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-border safe-bottom">
      <div className="container-custom py-2 flex items-center gap-2">
        <FavoriteButton
          listingId={listingId}
          initialFavorited={initialFavorited}
          initialCount={initialCount}
        />
        <a
          href={`tel:${phone}`}
          className="flex-1 inline-flex flex-col items-center justify-center py-1.5 bg-foreground text-white font-bold rounded text-sm leading-tight"
        >
          <span className="inline-flex items-center gap-1">
            <Icon.Phone size={12} strokeWidth={2.4} />
            전화하기
            {useSecretNumber && (
              <span className="text-[9px] border border-white/30 px-1 py-px rounded">
                안심
              </span>
            )}
          </span>
          <span className="text-[11px] font-black tabular tracking-tight">{phone}</span>
        </a>
        <a
          href={`sms:${phone}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-foreground text-foreground font-bold rounded text-sm"
        >
          <Icon.Chat size={14} strokeWidth={2.2} />
          문자
        </a>
      </div>
    </div>
  );
}
