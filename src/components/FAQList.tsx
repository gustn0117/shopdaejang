"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/types";
import { Icon } from "./Icon";

export function FAQList({ faqs, categories }: { faqs: FAQ[]; categories: string[] }) {
  const [activeCat, setActiveCat] = useState("전체");
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    if (activeCat !== "전체" && f.category !== activeCat) return false;
    if (search && !f.question.toLowerCase().includes(search.toLowerCase()) && !f.answer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="bg-white rounded-md border border-border p-3 mb-3">
        <div className="relative">
          <Icon.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="키워드로 검색"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div className="flex gap-1 mb-3 overflow-x-auto no-scrollbar">
        {["전체", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCat(c)}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded ${
              activeCat === c
                ? "bg-foreground text-white"
                : "bg-white border border-border text-muted hover:border-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden divide-y divide-border">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted">
            검색 결과가 없습니다
          </div>
        )}
        {filtered.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div key={f.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : f.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
              >
                <span className="text-foreground font-black">Q.</span>
                <span className="flex-1 text-sm font-bold">{f.question}</span>
                <span className="text-[11px] text-muted shrink-0">{f.category}</span>
                <Icon.ChevronDown
                  size={14}
                  className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 py-4 bg-zinc-50 flex gap-3 animate-fade-up">
                  <span className="text-foreground font-black">A.</span>
                  <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                    {f.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
