import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 平台遗留页与依赖已停用后端的工具页，不收录（2026-10-14）
        disallow: [
          "/api/",
          "/admin/",
          "/login/",
          "/search",
          "/categories/",
          "/discover",
          "/rankings",
          "/submit",
          "/write",
          "/translate",
          "/tts",
          "/image",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
