import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, REGIONS } from "@/lib/data";
import { EditListingForm } from "@/components/EditListingForm";
import { Icon } from "@/components/Icon";

export const metadata = { title: "매물 수정" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({
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
    redirect(`/login?redirect=/mypage/listings/${id}/edit`);
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) notFound();

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
        매물 수정
      </h1>
      <p className="text-sm text-muted mb-6">
        등록 정보를 수정합니다. 저장 즉시 반영됩니다.
      </p>

      <div className="max-w-3xl">
        <EditListingForm
          categories={CATEGORIES}
          regions={REGIONS}
          initial={{
            id: data.id as number,
            title: data.title as string,
            description: (data.description as string) ?? "",
            sido: data.sido as string,
            sigungu: data.sigungu as string,
            dong: (data.dong as string) ?? "",
            detailAddress: (data.detail_address as string) ?? "",
            isAddressPublic: Boolean(data.is_address_public),
            category: data.category as string,
            area: Number(data.area),
            deposit: Number(data.deposit),
            monthlyRent: Number(data.monthly_rent),
            premium: Number(data.premium),
            thumbnail: (data.thumbnail as string) ?? "",
            images: (data.images as string[]) ?? [],
            features: (data.features as string[]) ?? [],
            phone: (data.phone as string) ?? "",
            useSecretNumber: Boolean(data.use_secret_number),
            isPublic: Boolean(data.is_public),
          }}
        />
      </div>
    </div>
  );
}
