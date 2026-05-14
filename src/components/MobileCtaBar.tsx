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
      <div className="container-custom py-2.5 flex items-center gap-2">
        <FavoriteButton
          listingId={listingId}
          initialFavorited={initialFavorited}
          initialCount={initialCount}
        />
        <a
          href={`tel:${phone}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-foreground text-white font-bold rounded text-sm"
        >
          <Icon.Phone size={14} strokeWidth={2.4} />
          전화하기
          {useSecretNumber && (
            <span className="text-[10px] border border-white/30 px-1.5 py-0.5 rounded ml-1">
              안심
            </span>
          )}
        </a>
        <a
          href={`sms:${phone}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-white border border-foreground text-foreground font-bold rounded text-sm"
        >
          <Icon.Chat size={14} strokeWidth={2.2} />
          문자
        </a>
      </div>
    </div>
  );
}
