"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ShopCategory, AdPricing, AdTier } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { createClient } from "@/lib/supabase/client";
import { adminCreateListing } from "@/app/admin/actions";
import { LISTING_FEATURES } from "@/lib/features";

export function AdminListingForm({
  categories,
  regions,
  adPricing,
}: {
  categories: ShopCategory[];
  regions: Record<string, string[]>;
  adPricing: AdPricing[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isAddressPublic, setIsAddressPublic] = useState(true);
  const [category, setCategory] = useState<ShopCategory | "">("");
  const [area, setArea] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [premium, setPremium] = useState("");
  const [noPremium, setNoPremium] = useState(false);
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [useSecretNumber, setUseSecretNumber] = useState(false);
  const [tier, setTier] = useState<AdTier>("normal");
  const [period, setPeriod] = useState("1개월");
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const sigunguList = sido ? regions[sido] ?? [] : [];
  const tierPrices = adPricing.find((p) => p.tier === tier)?.prices ?? [];

  function toggleFeature(key: string) {
    setFeatures((arr) =>
      arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]
    );
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const next: string[] = [...images];
      for (const file of files) {
        if (next.length >= 10) break;
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("shopdaejang-listings")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) {
          setError(`업로드 실패: ${upErr.message}`);
          continue;
        }
        const { data: pub } = supabase.storage
          .from("shopdaejang-listings")
          .getPublicUrl(path);
        next.push(pub.publicUrl);
      }
      setImages(next);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 4 || !sido || !sigungu || !category || !area || !phone) {
      setError("제목·지역·업종·면적·연락처는 필수입니다.");
      return;
    }
    start(async () => {
      const result = await adminCreateListing({
        title: title.trim(),
        description: details || undefined,
        sido,
        sigungu,
        dong: dong || undefined,
        detail_address: detailAddress || undefined,
        is_address_public: isAddressPublic,
        category: category as string,
        area: Number(area),
        deposit: Number(deposit || 0),
        monthly_rent: Number(monthlyRent || 0),
        premium: noPremium ? 0 : Number(premium || 0),
        tier,
        ad_period: period,
        thumbnail: images[0],
        images,
        features,
        phone,
        use_secret_number: useSecretNumber,
        is_public: true,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/listings/${result.id}?paid=1`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-foreground text-white rounded">
            관리자 직접 등록
          </span>
          기본 정보
        </h2>

        <Field label="제목" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="w-full px-3 py-3 text-sm border border-border rounded"
            placeholder="예) 강남 신축 마사지샵 권리인하 급매"
          />
        </Field>

        <Field label="지역 / 업종" required>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={sido}
              onChange={(e) => {
                setSido(e.target.value);
                setSigungu("");
              }}
              className="px-3 py-3 text-sm border border-border rounded"
            >
              <option value="">시·도</option>
              {Object.keys(regions).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sigungu}
              onChange={(e) => setSigungu(e.target.value)}
              disabled={!sido}
              className="px-3 py-3 text-sm border border-border rounded"
            >
              <option value="">구·군</option>
              {sigunguList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={dong}
              onChange={(e) => setDong(e.target.value)}
              className="px-3 py-3 text-sm border border-border rounded"
              placeholder="동 (예: 역삼동)"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ShopCategory)}
              className="px-3 py-3 text-sm border border-border rounded"
            >
              <option value="">업종</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            disabled={!isAddressPublic}
            className="w-full mt-2 px-3 py-3 text-sm border border-border rounded disabled:bg-zinc-50"
            placeholder="상세주소 (선택)"
          />
          <div className="flex gap-3 mt-2 text-xs">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                checked={isAddressPublic}
                onChange={() => setIsAddressPublic(true)}
                className="accent-foreground"
              />
              주소 공개
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                checked={!isAddressPublic}
                onChange={() => setIsAddressPublic(false)}
                className="accent-foreground"
              />
              주소 비공개
            </label>
          </div>
        </Field>

        <Field label="면적·금액 (만원)" required>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="평"
              className="px-3 py-3 text-sm border border-border rounded"
            />
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="보증금"
              className="px-3 py-3 text-sm border border-border rounded"
            />
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="월세"
              className="px-3 py-3 text-sm border border-border rounded"
            />
            <div>
              <input
                type="number"
                value={noPremium ? "0" : premium}
                onChange={(e) => setPremium(e.target.value)}
                disabled={noPremium}
                placeholder="권리금"
                className="w-full px-3 py-3 text-sm border border-border rounded disabled:bg-zinc-50"
              />
              <label className="inline-flex items-center gap-1 text-[10px] mt-1">
                <input
                  type="checkbox"
                  checked={noPremium}
                  onChange={(e) => {
                    setNoPremium(e.target.checked);
                    if (e.target.checked) setPremium("0");
                  }}
                  className="accent-foreground"
                />
                무권리
              </label>
            </div>
          </div>
        </Field>

        <Field label="상세 정보">
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            className="w-full px-3 py-3 text-sm border border-border rounded"
            placeholder="샵 구조, 상권, 매매 사유 등"
          />
        </Field>

        <Field label="매물 특징">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {LISTING_FEATURES.map((f) => {
              const active = features.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded ${
                    active
                      ? "bg-foreground text-white border-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="text-base font-bold">연락처 · 사진</h2>

        <Field label="연락처" required>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
            placeholder="010-0000-0000"
            className="w-full px-3 py-3 text-sm border border-border rounded"
          />
          <label className="inline-flex items-center gap-1.5 text-xs mt-2">
            <input
              type="checkbox"
              checked={useSecretNumber}
              onChange={(e) => setUseSecretNumber(e.target.checked)}
              className="accent-foreground"
            />
            안심번호 사용
          </label>
        </Field>

        <Field label={`사진 (${images.length}/10)`}>
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-2">
              {images.map((url) => (
                <div key={url} className="relative aspect-square rounded overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((arr) => arr.filter((u) => u !== url))}
                    className="absolute top-1 right-1 w-5 h-5 inline-flex items-center justify-center bg-black/70 text-white rounded-full text-xs"
                  >
                    <Icon.X size={10} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {images.length < 10 && (
            <label className="flex items-center justify-center gap-2 py-4 border border-dashed border-border rounded cursor-pointer text-xs text-muted">
              <Icon.Camera size={20} />
              {uploading ? "업로드 중..." : "사진 추가"}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </Field>
      </div>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="text-base font-bold">광고 상품 · 기간</h2>
        <p className="text-[11px] text-muted">
          관리자 등록 매물은 결제 없이 즉시 노출됩니다. 광고 등급·기간은 자유롭게 지정할 수 있습니다.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {adPricing.map((p) => (
            <button
              key={p.tier}
              type="button"
              onClick={() => {
                setTier(p.tier);
                setPeriod(p.prices[0]?.period ?? "1개월");
              }}
              className={`text-left p-3 rounded border ${
                tier === p.tier
                  ? "border-foreground bg-zinc-50"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              <span
                className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded mb-1 ${
                  p.tier === "urgent"
                    ? "badge-urgent"
                    : p.tier === "premium"
                    ? "badge-premium"
                    : p.tier === "normal"
                    ? "badge-normal"
                    : "badge-free"
                }`}
              >
                {p.label}
              </span>
              <p className="text-[11px] text-muted line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
        <Field label="광고 기간">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-3 text-sm border border-border rounded"
          >
            {tierPrices.map((pr) => (
              <option key={pr.period} value={pr.period}>
                {pr.period}
                {pr.price > 0 ? ` (${pr.price.toLocaleString()}원 상당)` : " (무료)"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error && (
        <p className="text-xs text-urgent bg-white border border-urgent rounded p-3 inline-flex items-center gap-1.5">
          <Icon.Warning size={12} strokeWidth={2.2} />
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 px-6 py-3 bg-foreground text-white font-bold rounded disabled:opacity-50"
        >
          {pending ? "등록 중..." : "매물 등록 (즉시 노출)"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/listings")}
          className="px-6 py-3 border border-border font-bold rounded"
        >
          취소
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-urgent">*</span>}
      </label>
      {children}
    </div>
  );
}
