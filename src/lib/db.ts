import { createClient } from "@/lib/supabase/server";
import type { Listing, UsedGood, Notice, FAQ } from "@/lib/types";

type ListingRow = {
  id: number;
  title: string;
  description: string | null;
  shop_structure: string | null;
  commercial: string | null;
  etc: string | null;
  sido: string;
  sigungu: string;
  dong: string | null;
  detail_address: string | null;
  is_address_public: boolean;
  category: string;
  area: number;
  deposit: number;
  monthly_rent: number;
  premium: number;
  tier: string;
  thumbnail: string | null;
  images: string[] | null;
  features: string[] | null;
  phone: string | null;
  use_secret_number: boolean;
  status: string;
  is_public: boolean;
  views: number;
  favorites: number;
  created_at: string;
  bumped_at: string;
  ad_expires_at: string | null;
};

function rowToListing(r: ListingRow): Listing {
  return {
    id: r.id,
    title: r.title,
    category: r.category as Listing["category"],
    region: `${r.sido} ${r.sigungu}${r.dong ? " " + r.dong : ""}`.trim(),
    sido: r.sido,
    sigungu: r.sigungu,
    dong: r.dong ?? undefined,
    detailAddress: r.detail_address ?? undefined,
    area: Number(r.area),
    deposit: Number(r.deposit),
    monthlyRent: Number(r.monthly_rent),
    premium: Number(r.premium),
    description: r.description ?? "",
    shopStructure: r.shop_structure ?? undefined,
    commercialArea: r.commercial ?? undefined,
    etcInfo: r.etc ?? undefined,
    phone: r.phone ?? "",
    useSecretNumber: r.use_secret_number,
    images: r.images ?? [],
    features: r.features ?? [],
    thumbnail: r.thumbnail ?? "",
    tier: r.tier as Listing["tier"],
    status: r.status as Listing["status"],
    isPublic: r.is_public,
    isAddressPublic: r.is_address_public,
    views: r.views,
    favorites: r.favorites,
    createdAt: r.created_at,
    expiresAt: r.ad_expires_at ?? undefined,
    bumpedAt: r.bumped_at,
  };
}

export type ListingsResult = {
  rows: Listing[];
  total: number;
};

export async function fetchListings(opts?: {
  tier?: Listing["tier"] | "";
  sido?: string;
  sigungu?: string;
  category?: string;
  status?: Listing["status"];
  q?: string;
  depositMin?: number;
  depositMax?: number;
  rentMin?: number;
  rentMax?: number;
  premiumMin?: number;
  premiumMax?: number;
  sort?: string;
  limit?: number;
  offset?: number;
  withCount?: boolean;
}): Promise<Listing[]> {
  const supabase = await createClient();
  let q = supabase
    .from("listings")
    .select("*")
    .eq("status", opts?.status ?? "approved")
    .eq("is_public", true);

  // 자동 만료: 승인된 매물에만 적용 (관리자 검토 시점은 만료와 무관)
  if ((opts?.status ?? "approved") === "approved") {
    q = q.or("ad_expires_at.is.null,ad_expires_at.gt." + new Date().toISOString());
  }

  if (opts?.tier) q = q.eq("tier", opts.tier);
  if (opts?.sido) q = q.eq("sido", opts.sido);
  if (opts?.sigungu) q = q.eq("sigungu", opts.sigungu);
  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.q) q = q.or(`title.ilike.%${opts.q}%,description.ilike.%${opts.q}%`);
  if (opts?.depositMin !== undefined) q = q.gte("deposit", opts.depositMin);
  if (opts?.depositMax !== undefined) q = q.lte("deposit", opts.depositMax);
  if (opts?.rentMin !== undefined) q = q.gte("monthly_rent", opts.rentMin);
  if (opts?.rentMax !== undefined) q = q.lte("monthly_rent", opts.rentMax);
  if (opts?.premiumMin !== undefined) q = q.gte("premium", opts.premiumMin);
  if (opts?.premiumMax !== undefined) q = q.lte("premium", opts.premiumMax);

  switch (opts?.sort) {
    case "newest":
      q = q.order("created_at", { ascending: false });
      break;
    case "views":
      q = q.order("views", { ascending: false });
      break;
    case "deposit-low":
      q = q.order("deposit", { ascending: true });
      break;
    case "rent-low":
      q = q.order("monthly_rent", { ascending: true });
      break;
    case "premium-low":
      q = q.order("premium", { ascending: true });
      break;
    default:
      q = q.order("bumped_at", { ascending: false });
  }

  if (opts?.offset !== undefined && opts?.limit) {
    q = q.range(opts.offset, opts.offset + opts.limit - 1);
  } else if (opts?.limit) {
    q = q.limit(opts.limit);
  }

  const { data, error } = await q;
  if (error) {
    console.error("fetchListings", error);
    return [];
  }
  return ((data ?? []) as ListingRow[]).map(rowToListing);
}

export async function fetchListingsWithCount(
  opts: Parameters<typeof fetchListings>[0] & { page?: number; pageSize?: number }
): Promise<ListingsResult> {
  const supabase = await createClient();
  const pageSize = opts?.pageSize ?? 24;
  const page = Math.max(1, opts?.page ?? 1);
  const offset = (page - 1) * pageSize;

  let countQ = supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("status", opts?.status ?? "approved")
    .eq("is_public", true);

  if ((opts?.status ?? "approved") === "approved") {
    countQ = countQ.or("ad_expires_at.is.null,ad_expires_at.gt." + new Date().toISOString());
  }
  if (opts?.tier) countQ = countQ.eq("tier", opts.tier);
  if (opts?.sido) countQ = countQ.eq("sido", opts.sido);
  if (opts?.sigungu) countQ = countQ.eq("sigungu", opts.sigungu);
  if (opts?.category) countQ = countQ.eq("category", opts.category);
  if (opts?.q) countQ = countQ.or(`title.ilike.%${opts.q}%,description.ilike.%${opts.q}%`);
  if (opts?.depositMin !== undefined) countQ = countQ.gte("deposit", opts.depositMin);
  if (opts?.depositMax !== undefined) countQ = countQ.lte("deposit", opts.depositMax);
  if (opts?.rentMin !== undefined) countQ = countQ.gte("monthly_rent", opts.rentMin);
  if (opts?.rentMax !== undefined) countQ = countQ.lte("monthly_rent", opts.rentMax);
  if (opts?.premiumMin !== undefined) countQ = countQ.gte("premium", opts.premiumMin);
  if (opts?.premiumMax !== undefined) countQ = countQ.lte("premium", opts.premiumMax);

  const [rows, count] = await Promise.all([
    fetchListings({ ...opts, limit: pageSize, offset }),
    countQ,
  ]);

  return { rows, total: count.count ?? 0 };
}

export async function fetchListingById(id: number): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToListing(data as ListingRow);
}

export async function fetchNotices(opts?: { limit?: number }): Promise<Notice[]> {
  const supabase = await createClient();
  let q = supabase
    .from("notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error || !data) return [];
  return (data as Array<{ id: number; title: string; content: string; is_pinned: boolean; views: number; created_at: string }>).map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    isPinned: r.is_pinned,
    views: r.views,
    createdAt: r.created_at,
  }));
}

export async function fetchNoticeById(id: number): Promise<Notice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as { id: number; title: string; content: string; is_pinned: boolean; views: number; created_at: string };
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    isPinned: r.is_pinned,
    views: r.views,
    createdAt: r.created_at,
  };
}

export async function fetchUsedGoods(opts?: { category?: string; activeOnly?: boolean }): Promise<UsedGood[]> {
  const supabase = await createClient();
  let q = supabase.from("used_goods").select("*").order("created_at", { ascending: false });
  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.activeOnly) q = q.eq("is_completed", false);
  const { data, error } = await q;
  if (error || !data) return [];
  return (data as Array<{ id: number; category: string; title: string; description: string | null; price: number; region: string | null; thumbnail: string | null; views: number; is_completed: boolean; created_at: string }>).map((r) => ({
    id: r.id,
    category: r.category as UsedGood["category"],
    title: r.title,
    description: r.description ?? "",
    price: Number(r.price),
    region: r.region ?? "",
    thumbnail: r.thumbnail ?? "",
    isCompleted: r.is_completed,
    views: r.views,
    createdAt: r.created_at,
  }));
}

export async function fetchUsedGoodById(id: number): Promise<UsedGood | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("used_goods")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as { id: number; category: string; title: string; description: string | null; price: number; region: string | null; thumbnail: string | null; views: number; is_completed: boolean; created_at: string };
  return {
    id: r.id,
    category: r.category as UsedGood["category"],
    title: r.title,
    description: r.description ?? "",
    price: Number(r.price),
    region: r.region ?? "",
    thumbnail: r.thumbnail ?? "",
    isCompleted: r.is_completed,
    views: r.views,
    createdAt: r.created_at,
  };
}

export async function fetchFaqs(): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as Array<{ id: number; category: string; question: string; answer: string }>).map((r) => ({
    id: r.id,
    category: r.category,
    question: r.question,
    answer: r.answer,
  }));
}
