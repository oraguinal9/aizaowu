import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "排行榜",
  description: "AI造物项目排行榜 — 社区榜：独立开发者提交的项目按推荐排序；全站榜：全部收录项目。发现最受欢迎的AI创造项目。",
  alternates: { canonical: `${APP_URL}/rankings` },
  openGraph: {
    title: `排行榜 | ${APP_NAME}`,
    description: "AI造物项目排行榜 — 社区榜+全站榜，发现最受欢迎的AI创造项目",
    url: `${APP_URL}/rankings`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "排行榜" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `排行榜 | ${APP_NAME}`,
    description: "AI造物项目排行榜 — 社区榜+全站榜",
    images: [OG_IMAGE],
  },
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
