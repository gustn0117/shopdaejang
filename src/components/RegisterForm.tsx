"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShopCategory, AdTier, AdPricing } from "@/lib/types";
import { Icon } from "./Icon";
import { createClient } from "@/lib/supabase/client";
import { createListing } from "@/app/mypage/register/actions";

type Step = 1 | 2 | 3 | 4;

export function RegisterForm({
  categories,
  regions,
  adPricing,
}: {
  categories: ShopCategory[];
  regions: Record<string, string[]>;
  adPricing: AdPricing[];
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
  const [shopStructure, setShopStructure] = useState("");
  const [commercial, setCommercial] = useState("");
  const [etc, setEtc] = useState("");
  const [phone, setPhone] = useState("");
  const [useSecretNumber, setUseSecretNumber] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [tier, setTier] = useState<AdTier | "">("");
  const [period, setPeriod] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [agreement, setAgreement] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const validStep3 = tier && period;

  function next() {
    if (step === 1 && !validStep1) {
      alert("필수 항목을 모두 입력해주세요");
      return;
    }
    if (step === 2 && !validStep2) {
      alert("연락처를 입력해주세요");
      return;
    }
    if (step === 3 && !validStep3) {
      alert("광고 상품을 선택해주세요");
      return;
    }
    setStep((s) => (Math.min(4, s + 1) as Step));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() {
    setStep((s) => (Math.max(1, s - 1) as Step));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreement) {
      alert("이용약관에 동의해주세요");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubmitError("로그인이 필요합니다.");
        setSubmitting(false);
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

      const result = await createListing({
        title: title.trim(),
        description: shopStructure || undefined,
        shop_structure: shopStructure || undefined,
        commercial: commercial || undefined,
        etc: etc || undefined,
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
        tier: tier as AdTier,
        ad_period: period,
        thumbnail: uploaded[0],
        images: uploaded,
        phone,
        use_secret_number: useSecretNumber,
        is_public: isPublic,
      });

      if (!result.ok) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "알 수 없는 오류");
      setSubmitting(false);
    }
  }

  const selectedTier = adPricing.find((p) => p.tier === tier);
  const selectedPeriod = selectedTier?.prices.find((p) => p.period === period);

  if (submitted) {
    return (
      <div className="bg-white rounded-md border border-border p-8 lg:p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-white mb-4">
          <Icon.Check size={28} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black mb-2">매물 등록 완료</h2>
        <p className="text-sm text-muted mb-6">
          매물이 정상적으로 접수되었습니다. 관리자 승인 후 노출되며,
          <br />
          평균 영업일 기준 2~6시간 이내 검토됩니다.
        </p>
        <div className="bg-zinc-50 border border-border rounded p-4 mb-6 text-left max-w-md mx-auto text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted">광고 상품</span><span className="font-bold">{selectedTier?.label}</span></div>
          <div className="flex justify-between"><span className="text-muted">기간</span><span className="font-bold">{selectedPeriod?.period}</span></div>
          <div className="flex justify-between"><span className="text-muted">결제 금액</span><span className="font-bold">{selectedPeriod?.price === 0 ? "무료" : `${selectedPeriod?.price.toLocaleString()}원`}</span></div>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => router.push("/mypage/listings")}
            className="px-5 py-2.5 bg-foreground text-white font-bold rounded"
          >
            내 매물 보기
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-5 py-2.5 border border-border font-bold rounded"
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
          {([1, 2, 3, 4] as const).map((n, i) => (
            <div key={n} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  step >= n ? "bg-foreground text-white" : "bg-zinc-100 text-muted"
                }`}
              >
                {step > n ? <Icon.Check size={14} strokeWidth={2.5} /> : n}
              </div>
              <div className="flex-1 ml-1 mr-1 hidden sm:block">
                <div className="text-[11px] font-semibold">{["기본정보", "연락/사진", "광고선택", "확인"][i]}</div>
              </div>
              {n < 4 && <div className={`flex-1 h-0.5 ${step > n ? "bg-foreground" : "bg-zinc-200"}`} />}
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
                <label className="text-[11px] text-muted mb-1 block">권리금</label>
                <input type="number" value={premium} onChange={(e) => setPremium(e.target.value)} placeholder="5000" className="w-full px-3 py-3 text-sm border border-border rounded" />
              </div>
            </div>
          </Field>

          <Field label="상세정보">
            <div className="space-y-2">
              <textarea
                value={shopStructure}
                onChange={(e) => setShopStructure(e.target.value)}
                placeholder="샵 구조 — 베드 수, 룸 구성, 시설 등을 자유롭게 작성해주세요"
                rows={3}
                className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
              />
              <textarea
                value={commercial}
                onChange={(e) => setCommercial(e.target.value)}
                placeholder="상권 — 위치 특성, 유동인구, 주변 환경 등"
                rows={3}
                className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
              />
              <textarea
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                placeholder="기타사항 — 권리금 협의 여부, 매매 사유 등"
                rows={3}
                className="w-full px-3 py-3 text-sm border border-border rounded focus:outline-none focus:border-foreground"
              />
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

      {/* Step 3: 광고 선택 */}
      {step === 3 && (
        <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4 animate-fade-up">
          <h2 className="text-base font-bold">3. 광고 상품 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adPricing.map((p) => (
              <button
                key={p.tier}
                type="button"
                onClick={() => { setTier(p.tier); setPeriod(""); }}
                className={`text-left p-3 rounded border ${
                  tier === p.tier
                    ? "border-foreground bg-zinc-50"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.tier === "urgent" ? "badge-urgent" : p.tier === "premium" ? "badge-premium" : p.tier === "normal" ? "badge-normal" : "badge-free"
                  }`}>{p.label}</span>
                  <span className="text-xs text-muted">{p.description}</span>
                </div>
                <div className="text-lg font-black mt-1">
                  {p.prices[0].price === 0 ? "무료" : `${(p.prices[0].price / 10000).toFixed(0)}만원~`}
                </div>
              </button>
            ))}
          </div>

          {selectedTier && (
            <div className="bg-zinc-50 border border-border rounded p-4">
              <h3 className="text-sm font-bold mb-2">{selectedTier.label} 기간 선택</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {selectedTier.prices.map((p) => (
                  <button
                    key={p.period}
                    type="button"
                    onClick={() => setPeriod(p.period)}
                    className={`p-3 rounded border text-center ${
                      period === p.period
                        ? "border-foreground bg-white"
                        : "border-border bg-white hover:border-foreground/50"
                    }`}
                  >
                    {p.isFeatured && <span className="block text-[10px] font-bold text-foreground mb-0.5">추천</span>}
                    <div className="text-xs font-bold">{p.period}</div>
                    <div className="text-sm font-black mt-1">
                      {p.price === 0 ? "무료" : `${(p.price / 10000).toFixed(0)}만원`}
                    </div>
                  </button>
                ))}
              </div>
              <div className="bg-white border border-border rounded p-3 text-xs space-y-1">
                <p className="font-bold mb-1">{selectedTier.label} 상품 혜택</p>
                {selectedTier.benefits.map((b) => (
                  <p key={b} className="text-foreground/70">· {b}</p>
                ))}
              </div>
            </div>
          )}

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
        </div>
      )}

      {/* Step 4: 확인 + 결제 */}
      {step === 4 && (
        <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4 animate-fade-up">
          <h2 className="text-base font-bold">4. 등록 정보 확인 및 결제</h2>

          <div className="bg-zinc-50 border border-border rounded p-4 text-sm space-y-2">
            <Row label="제목" value={title} />
            <Row label="지역" value={`${sido} ${sigungu} ${dong}`} />
            <Row label="업종" value={category} />
            <Row label="면적" value={`${area}평`} />
            <Row label="보증금/월세/권리금" value={`${deposit || 0}만 / ${monthlyRent || 0}만 / ${premium || 0}만`} />
            <Row label="연락처" value={`${phone} ${useSecretNumber ? "(안심번호)" : ""}`} />
            <Row label="사진" value={`${images.length}장 등록`} />
            <Row label="광고 상품" value={`${selectedTier?.label} - ${period}`} />
          </div>

          <div className="bg-foreground text-white rounded p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold">결제 금액</span>
              <span className="text-2xl font-black">
                {selectedPeriod?.price === 0 ? "무료" : `${selectedPeriod?.price.toLocaleString()}원`}
              </span>
            </div>
            {selectedPeriod && selectedPeriod.price > 0 && (
              <p className="text-xs text-white/70">
                결제 완료 후 관리자 승인을 거쳐 노출됩니다.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">결제 수단</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["신용카드", "계좌이체", "카카오페이", "네이버페이"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className="py-3 border border-border rounded text-xs font-semibold hover:border-foreground hover:bg-zinc-50"
                >
                  {m}
                </button>
              ))}
            </div>
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
      {submitError && (
        <p className="text-xs text-urgent bg-zinc-50 border border-urgent rounded p-2">{submitError}</p>
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
        {step < 4 ? (
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
            {submitting ? "등록 중..." : selectedPeriod?.price === 0 ? "무료 등록 완료" : "결제하고 등록하기"}
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
