import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "提交项目",
  description: "提交你的AI项目到AI造物。独立开发者用AI做的网站、工具、游戏、应用，都在这里展示。无需审核费，提交即展示。",
  alternates: { canonical: `${APP_URL}/submit` },
  openGraph: {
    title: `提交你的AI项目 | ${APP_NAME}`,
    description: "提交你的AI项目到AI造物。独立开发者展示作品的平台。",
    url: `${APP_URL}/submit`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "提交项目" }],
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
