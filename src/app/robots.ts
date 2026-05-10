import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/mypage", "/mypage/", "/api/", "/login", "/signup", "/find-account"],
      },
    ],
    sitemap: "https://shopdaejang.hsweb.pics/sitemap.xml",
  };
}
