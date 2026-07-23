import { searchProjects } from "@/lib/db/projects";
import { ProjectCard } from "@/components/ui/project-card";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "搜索",
  description: `搜索${APP_NAME}上的所有AI创造项目`,
  alternates: { canonical: `${APP_URL}/search` },
  openGraph: {
    title: `搜索 | ${APP_NAME}`,
    description: `搜索${APP_NAME}上的所有AI创造项目`,
    url: `${APP_URL}/search`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "搜索" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `搜索 | ${APP_NAME}`,
    description: `搜索${APP_NAME}上的所有AI创造项目`,
    images: [OG_IMAGE],
  },
};

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page) || 1;
  const { projects, total } = q
    ? await searchProjects(q, currentPage)
    : { projects: [], total: 0 };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">🔍 搜索</h1>

      {/* 搜索框 */}
      <form action="/search" method="GET" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="搜索项目名称、描述..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 结果 */}
      {q && (
        <div>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            搜索 &quot;{q}&quot; — 找到 {total} 个结果
          </p>
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400 dark:border-gray-600 dark:text-gray-500">
              <p className="text-lg">没有找到相关项目</p>
              <p className="mt-1">试试其他关键词？</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
