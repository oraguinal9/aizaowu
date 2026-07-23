import Link from "next/link";
import { getPublishedProjects, getFeaturedProjects, getWeeklyTopProjects } from "@/lib/db/projects";
import { getCategories } from "@/lib/db/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "发现AI项目 — 本周最火、最新上架、精选推荐",
  description: "发现素人开发者用AI创造的酷项目。每周精选AI工具、应用、游戏、网站，涵盖效率、创意、教育、内容创作等9大分类。免费AI工具入口。",
  alternates: { canonical: "https://aizaow.com/discover" },
  openGraph: {
    title: "发现AI创造项目 — AI造物",
    description: "素人开发者的AI项目展示平台，每周精选。",
  },
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const [{ projects: allProjects }, featured, weekly, categories] = await Promise.all([
    getPublishedProjects(1, 24),
    getFeaturedProjects(5),
    getWeeklyTopProjects(15),
    getCategories(),
  ]);

  const topProjects = weekly.length > 0 ? weekly : allProjects.slice(0, 10);
  const freshProjects = allProjects.filter(p => !featured.find(f => f.id === p.id)).slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* SEO Hero */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          🚀 发现 AI 创造的项目
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          每周精选素人开发者用AI做的工具、应用、游戏、网站。不用会编程，AI让每个人都能创造。
        </p>
        {/* 结构化数据 */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "发现AI项目",
            description: "素人开发者的AI项目展示平台，每周精选。",
            url: "https://aizaow.com/discover",
            isPartOf: { "@type": "WebSite", name: "AI造物", url: "https://aizaow.com" },
          })}}
        />
      </section>

      {/* 本周精选 — 富文本介绍 */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">📅 本周精选 AI 项目</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          以下是本周最受社区欢迎的 10 个 AI 项目。排名综合了浏览量、投票数和评论数，每周日自动更新。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {topProjects.slice(0, 10).map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {index + 1}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {project.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {project.tagline}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  {project.category && <span>{project.category.icon} {project.category.name}</span>}
                  <span>👍 {project.vote_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 精选推荐 + 最新上架 两栏 */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 精选推荐 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">⭐ 编辑精选</h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            质量和创意最出众的项目，由社区推荐产生。
          </p>
          <div className="space-y-3">
            {featured.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 最新上架 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🆕 最新上架</h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            最近加入 AI造物 的项目，看看有什么新鲜玩意。
          </p>
          <div className="space-y-3">
            {freshProjects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 分类导览 */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📂 按分类浏览</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">🤖 用AI做了个东西？</h2>
        <p className="mt-2 text-blue-100">不管是用AI做的网站、工具、游戏还是其他，都欢迎在这里展示。</p>
        <Link href="/submit" className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 font-medium text-blue-600 hover:bg-blue-50 transition-colors">
          提交你的项目 →
        </Link>
      </section>
    </div>
  );
}
