"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ShopCategory } from "@/lib/types";
import { Icon } from "./Icon";
import { Thumbnail } from "./Thumbnail";
import { LISTING_FEATURES } from "@/lib/features";
import { createClient } from "@/lib/supabase/client";
import { updateListing, deleteListing } from "@/app/mypage/listings/actions";
import { useToast } from "./Toast";

type Initial = {
  id: number;
  title: string;
  description: string;
  sido: string;
  sigungu: string;
  dong: string;
  detailAddress: string;
  isAddressPublic: boolean;
  category: string;
  area: number;
  deposit: number;
  monthlyRent: number;
  premium: number;
  thumbnail: string;
  images: string[];
  features: string[];
  phone: string;
  useSecretNumber: boolean;
  isPublic: boolean;
};

export function EditListingForm({
  initial,
  categories,
  regions,
}: {
  initial: Initial;
  categories: ShopCategory[];
  regions: Record<string, string[]>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [deletePending, startDelete] = useTransition();

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [sido, setSido] = useState(initial.sido);
  const [sigungu, setSigungu] = useState(initial.sigungu);
  const [dong, setDong] = useState(initial.dong);
  const [detailAddress, setDetailAddress] = useState(initial.detailAddress);
  const [isAddressPublic, setIsAddressPublic] = useState(initial.isAddressPublic);
  const [category, setCategory] = useState(initial.category);
  const [area, setArea] = useState(String(initial.area));
  const [deposit, setDeposit] = useState(String(initial.deposit));
  const [monthlyRent, setMonthlyRent] = useState(String(initial.monthlyRent));
  const [premium, setPremium] = useState(String(initial.premium));
  const [features, setFeatures] = useState<string[]>(initial.features);
  const [phone, setPhone] = useState(initial.phone);
  const [useSecretNumber, setUseSecretNumber] = useState(initial.useSecretNumber);
  const [isPublic, setIsPublic] = useState(initial.isPublic);
  const [images, setImages] = useState<string[]>(initial.images);
  const [thumbnail, setThumbnail] = useState<string>(initial.thumbnail);
  const [uploading, setUploading] = useState(false);

  const sigunguList = sido ? regions[sido] ?? [] : [];

  function toggleFeature(key: string) {
    setFeatures((arr) =>
      arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]
    );
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }
      const next: string[] = [...images];
      for (const file of files) {
        if (next.length >= 10) break;
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("shopdaejang-listings")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`업로드 실패: ${error.message}`);
          continue;
        }
        const { data: pub } = supabase.storage
          .from("shopdaejang-listings")
          .getPublicUrl(path);
        next.push(pub.publicUrl);
      }
      setImages(next);
      if (!thumbnail && next[0]) setThumbnail(next[0]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    const next = images.filter((u) => u !== url);
    setImages(next);
    if (thumbnail === url) setThumbnail(next[0] ?? "");
  }

  function setAsThumbnail(url: string) {
    setThumbnail(url);
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 4) {
      toast.error("제목은 4자 이상 입력해주세요.");
      return;
    }
    if (!sido || !sigungu || !category || !area) {
      toast.error("지역·업종·면적은 필수입니다.");
      return;
    }
    if (phone.length < 9) {
      toast.error("연락처를 정확히 입력해주세요.");
      return;
    }
    start(async () => {
      const result = await updateListing(initial.id, {
        title: title.trim(),
        description: description || undefined,
        sido,
        sigungu,
        dong: dong || undefined,
        detail_address: detailAddress || undefined,
        is_address_public: isAddressPublic,
        category,
        area: Number(area),
        deposit: Number(deposit || 0),
        monthly_rent: Number(monthlyRent || 0),
        premium: Number(premium || 0),
        thumbnail: thumbnail || undefined,
        images,
        features,
        phone,
        use_secret_number: useSecretNumber,
        is_public: isPublic,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("수정 완료. 관리자 재심사 후 노출됩니다.");
      router.push("/mypage/listings");
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("이 매물을 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    startDelete(async () => {
      await deleteListing(initial.id);
    });
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="text-base font-bold">기본 정보</h2>

        <FieldRow label="광고 제목" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
        </FieldRow>

        <FieldRow label="샵 주소" required>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={sido}
              onChange={(e) => {
                setSido(e.target.value);
                setSigungu("");
              }}
              className="px-3 py-3 text-sm border border-border rounded bg-white"
            >
              <option value="">시·도</option>
              {Object.keys(regions).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sigungu}
              onChange={(e) => setSigungu(e.target.value)}
              disabled={!sido}
              className="px-3 py-3 text-sm border border-border rounded bg-white"
            >
              <option value="">구·군</option>
              {sigunguList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            placeholder="동 (예: 역삼동)"
            className="w-full px-3 py-3 text-sm border border-border rounded mb-2"
          />
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            disabled={!isAddressPublic}
            placeholder="상세주소 (선택)"
            className="w-full px-3 py-3 text-sm border border-border rounded disabled:bg-zinc-50"
          />
          <div className="flex gap-3 mt-2 bg-zinc-50 border border-border rounded p-3">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="addr"
                checked={isAddressPublic}
                onChange={() => setIsAddressPublic(true)}
                className="accent-foreground"
              />
              주소 공개
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="addr"
                checked={!isAddressPublic}
                onChange={() => setIsAddressPublic(false)}
                className="accent-foreground"
              />
              주소 비공개
            </label>
          </div>
        </FieldRow>

        <FieldRow label="업종" required>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`py-2.5 text-sm font-medium border rounded ${
                  category === c
                    ? "border-foreground bg-foreground text-white"
                    : "border-border text-foreground hover:border-foreground/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="면적 (평)" required>
          <input
            type="number"
            min={1}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            className="w-full px-3 py-3 text-sm border border-border rounded"
          />
        </FieldRow>

        <FieldRow label="금액 (만원 단위)">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-muted mb-1 block">보증금</label>
              <input
                type="number"
                min={0}
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted mb-1 block">월세</label>
              <input
                type="number"
                min={0}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted mb-1 block">권리금</label>
              <input
                type="number"
                min={0}
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-border rounded"
              />
            </div>
          </div>
        </FieldRow>

        <FieldRow label="상세정보">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="샵 구조, 상권, 권리금 협의 여부, 매매 사유 등 매물에 대한 정보를 자유롭게 작성해주세요."
            className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
          />
        </FieldRow>

        <FieldRow label="매물 특징" subtitle="선택 사항">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {LISTING_FEATURES.map((f) => {
              const active = features.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded transition-colors ${
                    active
                      ? "bg-foreground text-white border-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm border ${
                      active
                        ? "border-white bg-white text-foreground"
                        : "border-border"
                    }`}
                  >
                    {active && <Icon.Check size={9} strokeWidth={3} />}
                  </span>
                  {f.label}
                </button>
              );
            })}
          </div>
        </FieldRow>
      </div>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="text-base font-bold">연락처 & 사진</h2>

        <FieldRow label="연락처" required>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
            required
            className="w-full px-3 py-3 text-sm border border-border rounded"
          />
          <label className="flex items-start gap-2 mt-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={useSecretNumber}
              onChange={(e) => setUseSecretNumber(e.target.checked)}
              className="mt-0.5 accent-foreground"
            />
            <span>
              <span className="font-semibold">안심번호 사용</span>
              <span className="text-xs text-muted block">
                본인 번호 대신 050-XXXX-XXXX 가상번호로 노출됩니다
              </span>
            </span>
          </label>
        </FieldRow>

        <FieldRow label="사진" subtitle={`현재 ${images.length}/10장 · 첫번째 사진이 대표 이미지`}>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {images.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square rounded overflow-hidden border border-border bg-zinc-100 group"
                >
                  <Thumbnail src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 inline-flex items-center justify-center bg-black/70 text-white rounded-full"
                    aria-label="사진 삭제"
                  >
                    <Icon.X size={12} strokeWidth={2.5} />
                  </button>
                  {thumbnail === url ? (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-foreground text-white text-[10px] rounded font-bold">
                      대표
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAsThumbnail(url)}
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-white/90 text-foreground text-[10px] rounded font-bold opacity-0 group-hover:opacity-100"
                    >
                      대표지정
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {images.length < 10 && (
            <label className="flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-border rounded cursor-pointer hover:border-foreground hover:bg-zinc-50">
              <Icon.Camera size={24} className="text-muted" />
              <span className="text-xs text-muted">
                {uploading ? "업로드 중..." : "사진 추가 (JPG · PNG · WEBP)"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </FieldRow>

        <FieldRow label="매물 공개">
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="accent-foreground"
              />
              공개 (검색 노출)
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="accent-foreground"
              />
              비공개 (임시저장)
            </label>
          </div>
        </FieldRow>
      </div>

      <div className="bg-zinc-50 border border-border rounded p-3 text-[12px] text-muted leading-relaxed">
        <strong className="text-foreground">참고:</strong> 매물 수정 시 광고 상태가 <strong>승인 대기</strong>로 변경되어 관리자 재심사를 거칩니다.
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-foreground text-white font-bold rounded hover:bg-foreground/90 disabled:opacity-50"
        >
          {pending ? "저장 중..." : "수정 저장"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/mypage/listings")}
          className="px-6 py-3 border border-border font-bold rounded hover:bg-zinc-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deletePending}
          className="px-6 py-3 border border-urgent text-urgent font-bold rounded hover:bg-urgent/5 disabled:opacity-50"
        >
          {deletePending ? "삭제 중..." : "매물 삭제"}
        </button>
      </div>
    </form>
  );
}

function FieldRow({
  label,
  required,
  subtitle,
  children,
}: {
  label: string;
  required?: boolean;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-urgent">*</span>}
        {subtitle && (
          <span className="text-xs text-muted font-normal">· {subtitle}</span>
        )}
      </label>
      {children}
    </div>
  );
}
