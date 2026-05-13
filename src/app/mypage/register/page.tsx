import Link from "next/link";
import { CATEGORIES, REGIONS, AD_PRICING } from "@/lib/data";
import { RegisterForm } from "@/components/RegisterForm";
import { Icon } from "@/components/Icon";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "매물등록",
  description: "마사지샵 매물을 직접 등록하세요. 광고 상품 선택 후 노출됩니다.",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container-custom py-4 lg:py-8">
      <div className="mb-6">
        <h1 className="text-xl lg:text-3xl font-black mb-1 tracking-tight">매물 등록하기</h1>
        <p className="text-sm text-muted">
          매도자가 직접 매물을 등록하고 광고 상품을 선택하실 수 있습니다.
        </p>
      </div>

      {!user && (
        <div className="max-w-3xl mx-auto mb-4 flex items-start gap-3 bg-white border border-border rounded-md p-4">
          <Icon.Info size={16} className="text-muted shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">미리보기 모드</p>
            <p className="text-xs text-muted leading-relaxed">
              비로그인 상태에서는 등록 절차만 둘러볼 수 있습니다. 매물을 실제로 등록하려면 로그인이 필요합니다.
            </p>
          </div>
          <Link
            href="/login?redirect=/mypage/register"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-foreground text-white text-xs font-semibold rounded-md hover:bg-foreground-soft"
          >
            로그인
            <Icon.ArrowRight size={11} strokeWidth={2.2} />
          </Link>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <RegisterForm
          categories={CATEGORIES}
          regions={REGIONS}
          adPricing={AD_PRICING}
        />
      </div>
    </div>
  );
}
