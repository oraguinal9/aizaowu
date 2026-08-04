import { getPublishedProjects } from "@/lib/db/projects";
import Link from "next/link";
import { PenLine, ArrowRight, Wrench } from "lucide-react";
import { ProjectLogo } from "@/components/ui/project-logo";

export const revalidate = 300;

export default async function ToolsPage() {
  const { projects } = await getPublishedProjects(1, 50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <Wrench size={12} className="text-brand" />
        AI TOOLS
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">AI 工具</h1>
      <p className="mt-2 text-muted">
        可直接使用的AI应用，点击即可体验。更多项目正在收录中。
      </p>

      {/* 内置工具 */}
      <div className="mt-8 mb-10">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">内置 AI 工具</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/write"
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/50"
          >
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg border border-border bg-bg text-brand">
              <PenLine size={18} />
            </div>
            <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-brand">
              AI 写作
            </h3>
            <p className="mt-1 text-sm text-muted">
              DeepSeek 驱动，支持文章/小红书/脚本/邮件/摘要，每天免费 5 次
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
              立即使用
              <ArrowRight size={14} />
            </span>
          </a>
        </div>
      </div>

      {/* 收录项目 */}
      <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">收录 AI 项目</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-2/50"
          >
            <div className="flex items-start gap-3">
              <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="md" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-foreground">
                  {project.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                  {project.tagline}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 mt-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition hover:brightness-110"
              >
                立即体验
                <ArrowRight size={14} />
              </a>
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm text-muted transition-colors hover:text-brand"
              >
                详情
              </Link>
              <span className="ml-auto text-xs text-muted">👍 {project.vote_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
