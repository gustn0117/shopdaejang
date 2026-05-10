"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";

export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/listings?q=${encodeURIComponent(trimmed)}` : "/listings");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="hidden md:flex items-center gap-1.5 px-3 h-9 bg-white border border-border rounded-md focus-within:border-foreground transition-colors w-72"
    >
      <Icon.Search size={14} className="text-muted shrink-0" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="지역, 업종, 매물명으로 검색"
        className="flex-1 bg-transparent text-[13px] focus:outline-none placeholder:text-muted/60"
      />
    </form>
  );
}
