import Link from "next/link";
import { getPublishedProjects, getFeaturedProjects, getWeeklyTopProjects } from "@/lib/db/projects";
import { getCategories } from "@/lib/db/categories";
import { ProjectCard } from "@/components/ui/project-card";
import { APP_TAGLINE } from "@/lib/constants";

export const revalidate = 300;

export default async function HomePage() {
  const [{ projects: latestProjects }, featuredProjects, weeklyTop, categories] =
    await Promise.all([
      getPublishedProjects(1, 12),
      getFeaturedProjects(5),
      getWeeklyTopProjects(10),
      getCategories(),
    ]);

  const totalProjects = latestProjects.length;
  const totalVotes = [...latestProjects, ...featuredProjects].reduce((s, p) => s + (p.vote_count || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Hero */}
      <section className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          🤖 {APP_TAGLINE}
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          素人开发者的AI项目展示平台 · 已有 <strong className="text-blue-600">{totalProjects}</strong> 个项目，共获得 <strong className="text-blue-600">{totalVotes}</strong> 次推荐
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/submit" className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            🚀 提交你的AI项目
          </Link>
          <Link href="/rankings" className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 transition-colors">
            🔥 查看排行榜
          </Link>
        </div>
      </section>

      {/* AI工具快捷入口 */}
      <section className="mb-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <a href="/write" className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold">✍️ AI写作</h2>
            <p className="mt-1 text-sm text-blue-100">文章/小红书/脚本 · 每天免费5次</p>
          </a>
          <a href="/translate" className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold">🌐 AI翻译</h2>
            <p className="mt-1 text-sm text-emerald-100">中英日韩互译 · 每天免费5次</p>
          </a>
          <a href="/tts" className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 p-5 text-white hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold">🔊 AI配音</h2>
            <p className="mt-1 text-sm text-amber-100">豆包TTS · 4种音色 · 每天免费5次</p>
          </a>
        </div>
      </section>

      {/* 分类导航 */}
      <section className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 精选项目 — 大卡片 */}
      {featuredProjects.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">⭐ 精选项目</h2>
            <Link href="/discover" className="text-sm text-blue-600 hover:underline">发现更多 →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* 最新项目 + 本周热门 */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">🆕 最新项目</h2>
            <Link href="/submit" className="text-sm text-blue-600 hover:underline">
              + 提交项目
            </Link>
          </div>
          {latestProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400 dark:border-gray-600 dark:text-gray-500">
              <p className="text-4xl mb-2">🤖</p>
              <p className="text-lg font-medium">还没有项目</p>
              <p className="mt-1">成为第一个提交AI项目的人！</p>
              <Link href="/submit" className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
                立即提交 →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {latestProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* 本周热门侧栏 */}
        <aside>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">🔥 本周热门</h2>
            <Link href="/rankings" className="text-sm text-blue-600 hover:underline">全部 →</Link>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            {weeklyTop.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">暂无数据</p>
            ) : (
              <ol className="space-y-3">
                {weeklyTop.map((project, index) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          index < 3
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          👍 {project.vote_count} · 💬 {project.comment_count} · 👀 {project.view_count}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
