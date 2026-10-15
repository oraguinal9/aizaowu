import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/db/projects";
import { APP_URL } from "@/lib/constants";

// ⚠️ 必须显式声明，否则 sitemap 会被 Next 冻结在构建时刻（2026-10-14 修复）
export const revalidate = 3600;

/** 「由简入深」学习站 L1–L16 —— 2026-10-14 已并入 aizaow.com/learn/<code>/（nginx alias） */
const LEARN_SERIES = [
  "ai101", "llm", "dl", "rag", "finetune", "rlhf", "aigc", "mcp",
  "agent", "local", "prompt", "comfy", "ragpro", "ftplus", "dify", "reason",
];

/** 「内容作品集」12 个自建内容站 —— 2026-10-14 并入 aizaow.com/works/<code>/（nginx alias） */
const WORKS_SERIES = [
  "study", "yuwen", "math", "english", "englishclub",
  "bkzy", "planner",
  "opc", "manju", "xianxia",
  "xingjian", "aisai",
];

/** 「执笔惊鸿」网文写作智库 —— 2026-10-14 并入 aizaow.com/writer/（nginx alias） */
const WRITER_PAGES = [
  "/writer/",
  "/writer/guide/",
  "/writer/skill/",
  "/writer/ai/",
  "/writer/oss/",
  "/writer/platform/",
  "/writer/news/",
  "/writer/tools/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = APP_URL;

  // 静态页（/search 等平台遗留页已移除；/work-with-me 已补入）
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/learn/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/works/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/work-with-me`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // 学习站 L1–L16（现已是主域子路径，权重直接归主域）
  const learnPages: MetadataRoute.Sitemap = LEARN_SERIES.map((code) => ({
    url: `${baseUrl}/learn/${code}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 内容站（现已是主域子路径，权重直接归主域）
  const worksPages: MetadataRoute.Sitemap = WORKS_SERIES.map((code) => ({
    url: `${baseUrl}/works/${code}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 网文写作智库（原 www.zbjh.top 内容，现已是主域子路径）
  const writerPages: MetadataRoute.Sitemap = WRITER_PAGES.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "/writer/" ? 0.8 : 0.7,
  }));

  // 项目详情页 — 使用项目实际的 updated_at
  const { projects } = await getPublishedProjects(1, 5000);
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...learnPages, ...worksPages, ...writerPages, ...projectPages];
}
