"use client";

import { useEffect } from "react";

const COOKIE = "recent_listings";
const MAX_ENTRIES = 8;

export function RecentTracker({ id }: { id: number }) {
  useEffect(() => {
    const raw = readCookie(COOKIE);
    const ids = (raw ? raw.split(",").map((s) => Number(s)).filter(Boolean) : []) as number[];
    const next = [id, ...ids.filter((i) => i !== id)].slice(0, MAX_ENTRIES);
    document.cookie = `${COOKIE}=${next.join(",")}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, [id]);
  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
