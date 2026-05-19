"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShopCategory } from "@/lib/types";
import { Icon } from "./Icon";
import { createClient } from "@/lib/supabase/client";
import { createListing } from "@/app/mypage/register/actions";
import { LISTING_FEATURES } from "@/lib/features";

type Step = 1 | 2 | 3;

export function RegisterForm({
  categories,
  regions,
}: {
  categories: ShopCategory[];
  regions: Record<string, string[]>;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // form state
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
  const [useSecretNumber, setUseSecretNumber] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [agreement, setAgreement] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  function toggleFeature(key: string) {
    setFeatures((arr) =>
      arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]
    );
  }

  const sigunguList = sido ? regions[sido] ?? [] : [];

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const all = [...images, ...files].slice(0, 10);
    setImages(all);
    Promise.all(
      all.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          })
      )
    ).then(setPreviews);
  }

  function removeImage(idx: number) {
    const newImages = images.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setImages(newImages);
    setPreviews(newPreviews);
  }

  const validStep1 =
    title.trim().length > 3 && sido && sigungu && category && area;
  const validStep2 = phone.length >= 9;

  function next() {
    if (step === 1 && !validStep1) {
      setStepError("제목(4자 이상)·지역·업종·면적을 모두 입력해주세요.");
      return;
    }
    if (step === 2 && !validStep2) {
      setStepError("연락처를 정확히 입력해주세요.");
      return;
    }
    setStepError(null);
    setStep((s) => (Math.min(3, s + 1) as Step));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() {
    setStepError(null);
    setStep((s) => (Math.max(1, s - 1) as Step));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreement) {
      setSubmitError("이용약관에 동의해주세요.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/mypage/register");
        return;
      }

      const uploaded: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("shopdaejang-listings")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          setSubmitError(`이미지 업로드 실패: ${error.message}`);
          setSubmitting(false);
          return;
        }
        const { data: pub } = supabase.storage.from("shopdaejang-listings").getPublicUrl(path);
        uploaded.push(pub.publicUrl);
      }

      const draft = {
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
        premium: Number(premium || 0),
        tier: "free" as const,
        ad_period: "10일",
        thumbnail: uploaded[0],
        images: uploaded,
        features,
        phone,
        use_secret_number: useSecretNumber,
        is_public: isPublic,
      };

      const result = await createListing(draft);
      if (!result.ok) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }
      setSubmittedId(result.id);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "알 수 없는 오류");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-md border border-border p-8 lg:p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-white mb-4">
          <Icon.Check size={28} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black mb-2">매물 등록 완료</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          매물이 정상적으로 접수되었습니다.
          <br />
          관리자 승인 후 <strong className="text-foreground">무료 10일</strong> 노출이 시작됩니다.
        </p>

        <div className="bg-primary-soft border border-border rounded-md p-5 mb-6 text-left max-w-md mx-auto">
          <p className="text-[11px] font-bold text-foreground tracking-[0.15em] uppercase mb-1.5">
            Promote Your Listing
          </p>
          <h3 className="text-base font-black mb-2 tracking-tight">
            더 빠른 거래를 원하시면 유료 광고로 업그레이드하세요
          </h3>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            긴급 · 프리미엄 · 일반 광고는 매물관리 페이지에서 언제든 결제하여 활성화할 수 있습니다.
            (1시간마다 자동 점프, 최상단 노출 등)
          </p>
          {submittedId ? (
            <button
              type="button"
              onClick={() => router.push(`/mypage/listings/${submittedId}/renew`)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-foreground text-white font-bold rounded text-sm"
            >
              <Icon.Plus size={12} strokeWidth={2.5} />
              유료 광고 구매하기
            </button>
          ) : null}
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => router.push("/mypage/listings")}
            className="px-5 py-2.5 border border-border font-bold rounded text-sm"
          >
            내 매물 보기
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-5 py-2.5 border border-border font-bold rounded text-sm"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-md border border-border p-3">
        <div className="flex items-center gap-1">
          {([1, 2, 3] as const).map((n, i) => (
            <div key={n} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  step >= n ? "bg-foreground text-white" : "bg-zinc-100 text-muted"
                }`}
              >
                {step > n ? <Icon.Check size={14} strokeWidth={2.5} /> : n}
              </div>
              <div className="flex-1 ml-1 mr-1 hidden sm:block">
                <div className="text-[11px] font-semibold">{["기본정보", "연락/사진", "약관/등록"][i]}</div>
              </div>
              {n < 3 && <div className={`flex-1 h-0.5 ${step > n ? "bg-foreground" : "bg-zinc-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: 기본 정보 */}
      {step === 1 && (
        <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4 animate-fade-up">
          <h2 className="text-base font-bold">1. 기본 정보 입력</h2>

          <Field label="광고 제목" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 강남 신축 마사지샵 권리인하 급매"
              maxLength={50}
              className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
            />
            <p className="text-[10px] text-muted mt-1 text-right">{title.length}/50</p>
          </Field>

          <Field label="샵 주소" required>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={sido}
                  onChange={(e) => { setSido(e.target.value); setSigungu(""); }}
                  className="px-3 py-3 text-sm border border-border rounded bg-white"
                >
                  <option value="">시·도 선택</option>
                  {Object.keys(regions).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={sigungu}
                  onChange={(e) => setSigungu(e.target.value)}
                  disabled={!sido}
                  className="px-3 py-3 text-sm border border-border rounded bg-white disabled:bg-zinc-50"
                >
                  <option value="">구·군 선택</option>
                  {sigunguList.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input
                type="text"
                value={dong}
                onChange={(e) => setDong(e.target.value)}
                placeholder="동 (예: 역삼동)"
                className="w-full px-3 py-3 text-sm border border-border rounded"
              />
              <input
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세주소 (선택)"
                disabled={!isAddressPublic}
                className="w-full px-3 py-3 text-sm border border-border rounded disabled:bg-zinc-50"
              />
              <div className="flex gap-3 items-start bg-zinc-50 border border-border rounded p-3">
                <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="addr"
                    checked={isAddressPublic}
                    onChange={() => setIsAddressPublic(true)}
                    className="accent-foreground"
                  />
                  주소 공개
                </label>
                <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="addr"
                    checked={!isAddressPublic}
                    onChange={() => setIsAddressPublic(false)}
                    className="accent-foreground"
                  />
                  주소 비공개 (동까지만 표시)
                </label>
              </div>
              {!isAddressPublic && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  ※ 주소 비공개 시 지도정보가 노출되지 않습니다.
                </p>
              )}
            </div>
          </Field>

          <Field label="업종" required>
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
          </Field>

          <Field label="면적 (평)" required>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="예) 35"
              min={1}
              className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
            />
          </Field>

          <Field label="금액 (만원 단위)">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-muted mb-1 block">보증금</label>
                <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="3000" className="w-full px-3 py-3 text-sm border border-border rounded" />
              </div>
              <div>
                <label className="text-[11px] text-muted mb-1 block">월세</label>
                <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} placeholder="200" className="w-full px-3 py-3 text-sm border border-border rounded" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-muted">권리금</label>
                  <label className="inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer select-none">
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
                <input
                  type="number"
                  value={noPremium ? "0" : premium}
                  onChange={(e) => setPremium(e.target.value)}
                  placeholder={noPremium ? "" : "5000"}
                  disabled={noPremium}
                  className="w-full px-3 py-3 text-sm border border-border rounded disabled:bg-zinc-50 disabled:text-muted"
                />
              </div>
            </div>
          </Field>

          <Field label="상세정보">
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="샵 구조, 상권, 권리금 협의 여부, 매매 사유 등 매물에 대한 정보를 자유롭게 작성해주세요."
              rows={10}
              className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
            />
          </Field>

          <Field label="매물 특징" subtitle="선택 사항 · 해당하는 항목을 모두 선택">
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
                        active ? "border-white bg-white text-foreground" : "border-border"
                      }`}
                    >
                      {active && <Icon.Check size={9} strokeWidth={3} />}
                    </span>
                    {f.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      )}

      {/* Step 2: 연락 + 사진 */}
      {step === 2 && (
        <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4 animate-fade-up">
          <h2 className="text-base font-bold">2. 연락처 & 사진</h2>

          <Field label="연락처" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
              placeholder="010-0000-0000"
              className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
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
          </Field>

          <Field label="사진 업로드" subtitle="여러 장 업로드 가능 (최대 10장)">
            <label className="flex flex-col items-center justify-center gap-2 py-8 border border-dashed border-border rounded cursor-pointer hover:border-foreground hover:bg-zinc-50">
              <Icon.Camera size={28} className="text-muted" />
              <span className="text-sm font-bold">사진 선택하기</span>
              <span className="text-xs text-muted">JPG, PNG, WEBP · 최대 10MB / 장</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded overflow-hidden border border-border bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 inline-flex items-center justify-center bg-black/70 text-white rounded-full"
                      aria-label="사진 삭제"
                    >
                      <Icon.X size={12} strokeWidth={2.5} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-foreground text-white text-[10px] rounded font-bold">
                        대표
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>
      )}

      {/* Step 3: 확인 + 약관 */}
      {step === 3 && (
        <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4 animate-fade-up">
          <h2 className="text-base font-bold">3. 등록 정보 확인</h2>

          <div className="bg-zinc-50 border border-border rounded p-4 text-sm space-y-2">
            <Row label="제목" value={title} />
            <Row label="지역" value={`${sido} ${sigungu} ${dong}`} />
            <Row label="업종" value={category} />
            <Row label="면적" value={`${area}평`} />
            <Row label="보증금/월세/권리금" value={`${deposit || 0}만 / ${monthlyRent || 0}만 / ${noPremium ? "무권리" : `${premium || 0}만`}`} />
            <Row label="연락처" value={`${phone} ${useSecretNumber ? "(안심번호)" : ""}`} />
            <Row label="사진" value={`${images.length}장 등록`} />
          </div>

          <div className="bg-zinc-50 border border-border rounded p-4">
            <h3 className="text-sm font-bold mb-2">매물 공개 여부</h3>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} className="accent-foreground" />
                공개 (검색 노출)
              </label>
              <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} className="accent-foreground" />
                비공개 (임시저장)
              </label>
            </div>
          </div>

          <div className="bg-primary-soft border border-border rounded p-4 text-[12px] leading-relaxed">
            <p className="font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Icon.Info size={13} className="text-foreground" />
              무료 10일 노출로 시작합니다
            </p>
            <p className="text-foreground/80">
              매물은 등록 즉시 무료 노출되며, 더 빠른 거래를 원하시면 등록 완료 후
              매물관리에서 <strong>유료 광고(긴급·프리미엄·일반)</strong>를 결제하여 활성화할 수 있습니다.
            </p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
              className="mt-0.5 accent-foreground"
            />
            <span>
              <span className="font-semibold">이용약관, 개인정보처리방침, 광고게재 정책에 동의합니다.</span>
              <span className="text-xs text-muted block mt-1">
                · 사이트 운영자는 거래에 개입하지 않으며, 거래로 인해 발생하는 분쟁에 대해 책임지지 않습니다.
              </span>
            </span>
          </label>
        </div>
      )}

      {/* Buttons */}
      {(stepError || submitError) && (
        <p className="text-xs text-urgent bg-white border border-urgent rounded p-3 inline-flex items-center gap-1.5">
          <Icon.Warning size={12} strokeWidth={2.2} />
          {stepError || submitError}
        </p>
      )}
      <div className="flex gap-2">
        {step > 1 && (
          <button
            type="button"
            onClick={prev}
            disabled={submitting}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-3 border border-border font-bold rounded hover:bg-zinc-50 disabled:opacity-50"
          >
            <Icon.ChevronLeft size={14} strokeWidth={2.2} />
            이전
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-foreground text-white font-bold rounded hover:bg-foreground/90"
          >
            다음
            <Icon.ChevronRight size={14} strokeWidth={2.2} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!agreement || submitting}
            className="flex-1 px-6 py-3 bg-foreground text-white font-bold rounded hover:bg-foreground/90 disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {submitting ? "등록 중..." : "매물 등록하기"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
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
        {subtitle && <span className="text-xs text-muted font-normal">· {subtitle}</span>}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted shrink-0">{label}</span>
      <span className="font-medium text-right">{value || "-"}</span>
    </div>
  );
}
