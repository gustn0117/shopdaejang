"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, REGIONS } from "@/lib/data";

export function SearchBar() {
  const router = useRouter();
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  const sidoList = Object.keys(REGIONS) as (keyof typeof REGIONS)[];
  const sigunguList = sido ? REGIONS[sido as keyof typeof REGIONS] : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sido) params.set("sido", sido);
    if (sigungu) params.set("sigungu", sigungu);
    if (category) params.set("category", category);
    if (keyword) params.set("q", keyword);
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-border p-3 lg:p-4"
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        <select
          value={sido}
          onChange={(e) => {
            setSido(e.target.value);
            setSigungu("");
          }}
          className="px-3 py-2.5 lg:py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
        >
          <option value="">지역선택</option>
          {sidoList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sigungu}
          onChange={(e) => setSigungu(e.target.value)}
          disabled={!sido}
          className="px-3 py-2.5 lg:py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary disabled:bg-zinc-50 disabled:text-muted"
        >
          <option value="">구·군선택</option>
          {sigunguList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-2 lg:col-span-1 px-3 py-2.5 lg:py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
        >
          <option value="">업종선택</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드 입력"
          className="col-span-2 lg:col-span-1 px-3 py-2.5 lg:py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="col-span-2 lg:col-span-1 px-4 py-2.5 lg:py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          빠른검색
        </button>
      </div>
    </form>
  );
}
