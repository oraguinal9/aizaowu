import Link from "next/link";
import { getRankedProjects } from "@/lib/db/projects";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";
import { RankingsJsonLd } from "@/components/ui/json-ld";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "排行榜",
  description: `AI造物项目排行榜 — 发现最受欢迎的AI创造项目`,
  alternates: { canonical: `${APP_URL}/rankings` },
  openGraph: {
    title: `排行榜 | ${APP_NAME}`,
    description: `AI造物项目排行榜 — 发现最受欢迎的AI创造项目`,
    url: `${APP_URL}/rankings`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "排行榜" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `排行榜 | ${APP_NAME}`,
    description: `AI造物项目排行榜 — 发现最受欢迎的AI创造项目`,
    images: [OG_IMAGE],
  },
};

export const revalidate = 900;

export default async function RankingsPage() {
  const allTime = await getRankedProjects("all");
  const weekly = await getRankedProjects("weekly");
  const monthly = await getRankedProjects("monthly");

  return (
    <>
      <RankingsJsonLd />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">🏆 排行榜</h1>

      {/* 总榜 */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🥇 总榜 Top 50</h2>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
          {allTime.length === 0 ? (
            <p className="p-8 text-center text-gray-400">暂无数据</p>
          ) : (
            <ol>
              {allTime.map((project, i) => (
                <li key={project.id} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      i < 3 ? "bg-amber-100 text-amber-700 text-lg" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{project.name}</p>
                      <p className="text-sm text-gray-400 truncate">{project.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">👍 {project.vote_count}</p>
                      {project.category && (
                        <span className="text-xs text-gray-400">{project.category.icon} {project.category.name}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
      </div>
    </>
  );
}
