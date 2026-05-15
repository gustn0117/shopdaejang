"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, REGIONS } from "@/lib/data";
import { Icon } from "./Icon";

export function SearchBar({
  initial,
}: {
  initial?: {
    sido?: string;
    sigungu?: string;
    category?: string;
    q?: string;
  };
}) {
  const router = useRouter();
  const [sido, setSido] = useState(initial?.sido ?? "");
  const [sigungu, setSigungu] = useState(initial?.sigungu ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [keyword, setKeyword] = useState(initial?.q ?? "");

  const sidoList = Object.keys(REGIONS) as (keyof typeof REGIONS)[];
  const sigunguList = sido ? REGIONS[sido as keyof typeof REGIONS] : [];

  function navigate(next: { sido?: string; sigungu?: string; category?: string; keyword?: string }) {
    const params = new URLSearchParams();
    const _sido = next.sido !== undefined ? next.sido : sido;
    const _sigungu = next.sigungu !== undefined ? next.sigungu : sigungu;
    const _category = next.category !== undefined ? next.category : category;
    const _keyword = next.keyword !== undefined ? next.keyword : keyword;
    if (_sido) params.set("sido", _sido);
    if (_sigungu) params.set("sigungu", _sigungu);
    if (_category) params.set("category", _category);
    if (_keyword) params.set("q", _keyword);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function onSidoChange(v: string) {
    setSido(v);
    setSigungu("");
    navigate({ sido: v, sigungu: "" });
  }

  function onSigunguChange(v: string) {
    setSigungu(v);
    navigate({ sigungu: v });
  }

  function onCategoryChange(v: string) {
    setCategory(v);
    navigate({ category: v });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({});
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
          onChange={onSidoChange}
          options={[{ value: "", label: "지역" }, ...sidoList.map((s) => ({ value: s, label: s }))]}
        />
        <FieldDivider />
        <Select
          value={sigungu}
          onChange={onSigunguChange}
          disabled={!sido}
          options={[{ value: "", label: "구·군" }, ...sigunguList.map((s) => ({ value: s, label: s }))]}
        />
      </div>
      <FieldDivider />
      <Select
        value={category}
        onChange={onCategoryChange}
        options={[{ value: "", label: "업종" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
        className="lg:flex-1"
      />
      <FieldDivider />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="키워드 (Enter 입력)"
        className="lg:flex-[1.3] px-4 py-3 text-sm bg-transparent focus:outline-none placeholder:text-muted/70"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground hover:bg-foreground-soft text-white font-semibold text-sm rounded-md transition-colors"
        aria-label="검색"
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${className} lg:flex-1 px-4 py-3 text-sm bg-transparent rounded focus:outline-none disabled:text-muted/60 cursor-pointer`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
