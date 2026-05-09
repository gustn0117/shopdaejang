"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, REGIONS } from "@/lib/data";
import { Icon } from "./Icon";

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
      className="surface-card p-1.5 lg:p-2 flex flex-col lg:flex-row lg:items-stretch gap-1.5 lg:gap-1"
    >
      <div className="grid grid-cols-2 lg:grid-cols-none lg:flex lg:flex-1 gap-1.5 lg:gap-0">
        <FieldDivider />
        <Select
          value={sido}
          onChange={(v) => {
            setSido(v);
            setSigungu("");
          }}
          options={[{ value: "", label: "지역" }, ...sidoList.map((s) => ({ value: s, label: s }))]}
        />
        <FieldDivider />
        <Select
          value={sigungu}
          onChange={setSigungu}
          disabled={!sido}
          options={[{ value: "", label: "구·군" }, ...sigunguList.map((s) => ({ value: s, label: s }))]}
        />
      </div>
      <FieldDivider />
      <Select
        value={category}
        onChange={setCategory}
        options={[{ value: "", label: "업종" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
        className="lg:flex-1"
      />
      <FieldDivider />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="키워드"
        className="lg:flex-[1.3] px-4 py-3 text-sm bg-transparent focus:outline-none placeholder:text-muted/70"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground hover:bg-foreground-soft text-white font-semibold text-sm rounded-md transition-colors"
      >
        <Icon.Search size={15} strokeWidth={2.4} />
        검색
      </button>
    </form>
  );
}

function FieldDivider() {
  return <span className="hidden lg:block w-px self-stretch bg-border" />;
}

function Select({
  value,
  onChange,
  options,
  disabled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className} lg:flex-1`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none px-4 py-3 pr-9 text-sm bg-transparent focus:outline-none disabled:text-muted/60 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon.ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
    </div>
  );
}
