import type { MetadataRoute } from "next";
import { CATEGORIES, REGIONS } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/server";

const BASE = "https://shopdaejang.hsweb.pics";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const admin = createAdminClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/listings",
    "/map",
    "/used",
    "/supplies",
    "/notice",
    "/faq",
    "/ad-info",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ].map((p) => ({ url: BASE + p, lastModified: now, changeFrequency: "weekly", priority: 0.7 }));

  const sidoRoutes: MetadataRoute.Sitemap = Object.keys(REGIONS).map((sido) => ({
    url: `${BASE}/area/${encodeURIComponent(sido)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const sidoCategoryRoutes: MetadataRoute.Sitemap = [];
  for (const sido of Object.keys(REGIONS)) {
    for (const cat of CATEGORIES) {
      sidoCategoryRoutes.push({
        url: `${BASE}/area/${encodeURIComponent(sido)}/${encodeURIComponent(cat)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  const [{ data: listings }, { data: notices }, { data: used }] = await Promise.all([
    admin.from("listings").select("id,updated_at").eq("status", "approved").eq("is_public", true),
    admin.from("notices").select("id,updated_at"),
    admin.from("used_goods").select("id,created_at"),
  ]);

  const listingRoutes: MetadataRoute.Sitemap = (listings ?? []).map((l: { id: number; updated_at: string }) => ({
    url: `${BASE}/listings/${l.id}`,
    lastModified: l.updated_at ?? now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const noticeRoutes: MetadataRoute.Sitemap = (notices ?? []).map((n: { id: number; updated_at: string }) => ({
    url: `${BASE}/notice/${n.id}`,
    lastModified: n.updated_at ?? now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const usedRoutes: MetadataRoute.Sitemap = (used ?? []).map((u: { id: number; created_at: string }) => ({
    url: `${BASE}/used/${u.id}`,
    lastModified: u.created_at ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...sidoRoutes,
    ...sidoCategoryRoutes,
    ...listingRoutes,
    ...noticeRoutes,
    ...usedRoutes,
  ];
}
