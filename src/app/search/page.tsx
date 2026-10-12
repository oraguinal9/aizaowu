import { searchProjects } from "@/lib/db/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { Search as SearchIcon } from "lucide-react";
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground">搜索</h1>

      {/* 搜索框 */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="搜索项目名称、描述..."
              className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:brightness-110"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 结果 */}
      {q && (
        <div>
          <p className="mb-4 text-sm text-muted">
            搜索 &quot;{q}&quot; — 找到 {total} 个结果
          </p>
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-lg text-foreground">没有找到相关项目</p>
              <p className="mt-1 text-sm text-muted">试试其他关键词？</p>
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
