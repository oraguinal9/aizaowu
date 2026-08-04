import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Clock, Plus } from "lucide-react";
import { getPublishedProjects, getFeaturedProjects, getWeeklyTopProjects } from "@/lib/db/projects";
import { getCategories } from "@/lib/db/categories";
import { ProjectLogo } from "@/components/ui/project-logo";
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* SEO Hero */}
      <section className="mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <Sparkles size={12} className="text-brand" />
          DISCOVER
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          发现 AI 创造的项目
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
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

      {/* 本周精选 */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-brand" />
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">本周精选 AI 项目</h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          以下是本周最受社区欢迎的 10 个 AI 项目。排名综合了浏览量、投票数和评论数，每周日自动更新。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {topProjects.slice(0, 10).map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-2/50"
            >
              <span
                className={`font-mono text-lg font-bold ${
                  index < 3 ? "text-brand" : "text-muted"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="md" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-brand">
                  {project.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                  {project.tagline}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted">
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
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-brand" />
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">编辑精选</h2>
          </div>
          <p className="mb-4 text-sm text-muted">
            质量和创意最出众的项目，由社区推荐产生。
          </p>
          <div className="space-y-3">
            {featured.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong hover:bg-surface-2/50"
              >
                <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="sm" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-foreground transition-colors group-hover:text-brand">{project.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{project.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Clock size={16} className="text-brand" />
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">最新上架</h2>
          </div>
          <p className="mb-4 text-sm text-muted">
            最近加入 AI造物 的项目，看看有什么新鲜玩意。
          </p>
          <div className="space-y-3">
            {freshProjects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong hover:bg-surface-2/50"
              >
                <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="sm" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-foreground transition-colors group-hover:text-brand">{project.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{project.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 分类导览 */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">按分类浏览</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-bg text-lg">
                {cat.icon}
              </span>
              <div className="min-w-0">
                <h3 className="font-medium text-foreground transition-colors group-hover:text-brand">{cat.name}</h3>
                <p className="line-clamp-1 text-xs text-muted">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          用 AI 做了个东西？
        </h2>
        <p className="mt-2 text-muted">
          不管是用AI做的网站、工具、游戏还是其他，都欢迎在这里展示。
        </p>
        <Link
          href="/submit"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} />
          提交你的项目
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
