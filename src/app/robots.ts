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
          // ⚠️ 必须带 $ 结尾锚点：robots 是前缀匹配，裸 "/write" 会连带封禁 /writer/
          "/write$",
          "/translate",
          "/tts",
          "/image",
        ],
      },
    ],
    sitemap: [`${APP_URL}/sitemap.xml`, `${APP_URL}/writer/sitemap.xml`],
  };
}
