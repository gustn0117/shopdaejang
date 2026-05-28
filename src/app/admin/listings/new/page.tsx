import Link from "next/link";
import { CATEGORIES, REGIONS, AD_PRICING } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { AdminListingForm } from "./AdminListingForm";

export const metadata = { title: "관리자 직접 매물 등록", robots: "noindex" };
export const dynamic = "force-dynamic";

export default function AdminNewListingPage() {
  return (
    <div className="space-y-3">
      <Link
        href="/admin/listings"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
      >
        <Icon.ChevronLeft size={12} />
        매물 승인 관리로
      </Link>
      <div>
        <h1 className="text-lg lg:text-xl font-black tracking-tight">관리자 직접 매물 등록</h1>
        <p className="text-xs text-muted mt-1">
          소유자 없는 매물 (user_id NULL)로 즉시 노출되며, 결제·검수 절차를 건너뜁니다.
        </p>
      </div>

      <AdminListingForm
        categories={CATEGORIES}
        regions={REGIONS}
        adPricing={AD_PRICING}
      />
    </div>
  );
}
