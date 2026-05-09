"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ListingPayload = {
  title: string;
  description?: string;
  shop_structure?: string;
  commercial?: string;
  etc?: string;
  sido: string;
  sigungu: string;
  dong?: string;
  detail_address?: string;
  is_address_public: boolean;
  category: string;
  area: number;
  deposit: number;
  monthly_rent: number;
  premium: number;
  tier: "urgent" | "premium" | "normal" | "free";
  ad_period: string;
  thumbnail?: string;
  images: string[];
  phone: string;
  use_secret_number: boolean;
  is_public: boolean;
};

export async function createListing(payload: ListingPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirect=/mypage/register");
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      ...payload,
      user_id: user.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/mypage/listings");
  return { ok: true as const, id: data.id as number };
}
