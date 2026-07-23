import { getPublishedProjects } from "@/lib/db/projects";
import Link from "next/link";

export const revalidate = 300;

export default async function ToolsPage() {
  const { projects } = await getPublishedProjects(1, 50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">🧰 AI工具</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        可直接使用的AI应用，点击即可体验。更多项目正在收录中。
      </p>

      {/* 内置工具 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🛠️ 内置AI工具</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/write" className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md transition-all dark:border-blue-800 dark:bg-blue-900/20">
            <div className="text-3xl mb-2">✍️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI写作</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">DeepSeek驱动，支持文章/小红书/脚本/邮件/摘要，每天免费5次</p>
            <span className="mt-3 inline-block text-sm font-medium text-blue-600">立即使用 →</span>
          </a>
        </div>
      </div>

      {/* 第三方项目 */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌐 收录AI项目</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
          >
            <div className="flex items-start gap-3 mb-3">
              {project.category && (
                <span className="text-2xl">{project.category.icon}</span>
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                  {project.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                立即体验 →
              </a>
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm text-gray-400 hover:text-blue-600 dark:text-gray-500"
              >
                详情
              </Link>
              <span className="ml-auto text-xs text-gray-400">👍 {project.vote_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
