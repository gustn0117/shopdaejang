import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AD_PRICING } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { RenewForm } from "@/components/RenewForm";

export const metadata = { title: "등록 / 광고 연장" };
export const dynamic = "force-dynamic";

export default async function RenewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/mypage/listings/${id}/renew`);
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,tier,status,sido,sigungu,dong,category,area,deposit,monthly_rent,premium,thumbnail,created_at,ad_expires_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) notFound();

  const listing = {
    id: data.id as number,
    title: data.title as string,
    tier: data.tier as "urgent" | "premium" | "normal" | "free",
    status: data.status as string,
    region: `${data.sido} ${data.sigungu}${data.dong ? " " + data.dong : ""}`,
    category: data.category as string,
    area: Number(data.area),
    deposit: Number(data.deposit),
    monthlyRent: Number(data.monthly_rent),
    premium: Number(data.premium),
    thumbnail: (data.thumbnail as string) ?? "",
    createdAt: data.created_at as string,
    expiresAt: (data.ad_expires_at as string) ?? null,
  };

  return (
    <div className="container-custom py-6 lg:py-10">
      <Link
        href="/mypage/listings"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground mb-3"
      >
        <Icon.ChevronLeft size={12} />
        매물관리로 돌아가기
      </Link>
      <h1 className="text-xl lg:text-2xl font-black tracking-tight mb-1">
        광고 등록 · 연장
      </h1>
      <p className="text-sm text-muted mb-6">
        무료 재연장 또는 유료 광고 상품을 선택하여 노출을 연장할 수 있습니다.
      </p>

      <RenewForm listing={listing} adPricing={AD_PRICING} />
    </div>
  );
}
