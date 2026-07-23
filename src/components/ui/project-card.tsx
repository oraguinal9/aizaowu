import Link from "next/link";
import type { Project } from "@/types";

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

export function ProjectCard({ project }: { project: Project }) {
  const ecoKey = ECOSYSTEM_MAP[project.slug];
  const tryUrl = ecoKey
    ? `/api/auth/redirect?to=${ecoKey}`
    : project.url;
  const isExternal = !ecoKey;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600">
      <Link href={`/projects/${project.slug}`} className="block p-4 pb-2">
        {project.thumbnail_url && (
          <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <img
              src={project.thumbnail_url}
              alt={project.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {project.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {project.tagline}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          {project.category && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {project.category.icon} {project.category.name}
            </span>
          )}
          <span>👍 {project.vote_count}</span>
          <span>💬 {project.comment_count}</span>
        </div>
      </Link>
      <div className="px-4 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs text-gray-400 hover:text-blue-600 dark:text-gray-500"
        >
          详情
        </Link>
        <a
          href={tryUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="ml-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          立即体验 →
        </a>
      </div>
    </div>
  );
}
