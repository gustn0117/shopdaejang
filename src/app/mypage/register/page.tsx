import { CATEGORIES, REGIONS, AD_PRICING } from "@/lib/data";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = {
  title: "매물등록",
  description: "마사지샵 매물을 직접 등록하세요. 광고 상품 선택 후 노출됩니다.",
};

export default function RegisterPage() {
  return (
    <div className="container-custom py-4 lg:py-8">
      <div className="mb-6">
        <h1 className="text-xl lg:text-3xl font-black mb-1 tracking-tight">매물 등록하기</h1>
        <p className="text-sm text-muted">
          매도자가 직접 매물을 등록하고 광고 상품을 선택하실 수 있습니다.
        </p>
      </div>
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
