"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/listings/actions";

function HeartIcon({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

type Props = {
  listingId: number;
  initialFavorited: boolean;
  initialCount: number;
  variant?: "icon" | "block";
};

export function FavoriteButton({
  listingId,
  initialFavorited,
  initialCount,
  variant = "icon",
}: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [pending, start] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    start(async () => {
      const result = await toggleFavorite(listingId);
      if (!result.ok) {
        if (result.reason === "auth") {
          router.push(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          );
        }
        return;
      }
      setFavorited(result.favorited);
      setCount((c) => Math.max(0, c + (result.favorited ? 1 : -1)));
    });
  }

  if (variant === "block") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 w-full py-2.5 border font-semibold rounded transition-colors disabled:opacity-50 ${
          favorited
            ? "border-foreground bg-foreground text-white"
            : "border-border text-foreground hover:bg-zinc-50"
        }`}
        aria-pressed={favorited}
        aria-label={favorited ? "찜 해제" : "찜하기"}
      >
        <HeartIcon filled={favorited} size={14} />
        {favorited ? "찜 해제" : "찜하기"}
        <span className="tabular text-xs opacity-70">({count.toLocaleString()})</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 border rounded text-xs font-semibold transition-colors disabled:opacity-50 ${
        favorited
          ? "border-foreground bg-foreground text-white"
          : "border-border text-muted hover:text-foreground hover:border-foreground"
      }`}
      aria-pressed={favorited}
      aria-label={favorited ? "찜 해제" : "찜하기"}
    >
      <HeartIcon filled={favorited} size={12} />
      찜 <span className="tabular">{count.toLocaleString()}</span>
    </button>
  );
}
