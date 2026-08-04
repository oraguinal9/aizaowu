import Link from "next/link";
import type { Project } from "@/types";
import { cn } from "@/lib/cn";
import { ProjectLogo } from "@/components/ui/project-logo";

// 自有工具：slug → 子项目 key
const ECOSYSTEM_MAP: Record<string, string> = {
  "lingxi-dream": "lingxi",
  "xiaoling-ai": "xiaoling",
  "yuyan-ai": "yuyan",
  "xiuxian-shijie": "shijie",
  "comic-assistant": "comic",
  "ai-writer": "aiwriter",
  "ai-novel": "ainovel",
};

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const ecoKey = ECOSYSTEM_MAP[project.slug];
  const tryUrl = ecoKey ? `/api/auth/redirect?to=${ecoKey}` : project.url;
  const isExternal = !ecoKey;

  return (
    <div className="group flex h-full flex-col rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-border-strong hover:bg-surface-2/50">
      <Link href={`/projects/${project.slug}`} className="flex flex-1 flex-col p-5">
        {/* 头部：logo 方块 + 名称 + 分类 */}
        <div className="flex items-start gap-3">
          <ProjectLogo
            slug={project.slug}
            name={project.name}
            thumbnailUrl={project.thumbnail_url}
            size={featured ? "lg" : "md"}
          />
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "truncate font-semibold text-foreground transition-colors group-hover:text-brand",
                featured ? "text-lg" : "text-base"
              )}
            >
              {project.name}
            </h3>
            {project.category && (
              <span className="mt-0.5 inline-block text-xs text-muted">
                {project.category.icon} {project.category.name}
              </span>
            )}
          </div>
        </div>

        {/* 描述 */}
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-muted",
            featured ? "line-clamp-3" : "line-clamp-2"
          )}
        >
          {project.tagline}
        </p>

        {/* 数据行 */}
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 opacity-70">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.1v6.9a1.5 1.5 0 001.5 1.5h4.2a2 2 0 001.9-1.4l1.6-5.3a1.5 1.5 0 00-1.4-1.9H11l.7-3.2a1.6 1.6 0 00-2.8-1.3L6 10.1z" />
            </svg>
            {project.vote_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 opacity-70">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.8 8.8 0 01-3.2-.6L3 18l1.2-3.2A6.7 6.7 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
            </svg>
            {project.comment_count}
          </span>
          {project.view_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 opacity-70">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {project.view_count}
            </span>
          )}
        </div>
      </Link>

      {/* 底部操作条 */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs text-muted transition-colors hover:text-foreground"
        >
          查看详情
        </Link>
        <a
          href={tryUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand"
        >
          立即体验
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.6l-3.2-3.2a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.2-3.2H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}
