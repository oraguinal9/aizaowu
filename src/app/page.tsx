import Link from "next/link";
import {
  PenLine,
  Languages,
  Volume2,
  ImageIcon,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Plus,
} from "lucide-react";
import { getPublishedProjects, getFeaturedProjects, getWeeklyTopProjects } from "@/lib/db/projects";
import { getCategories } from "@/lib/db/categories";
import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { APP_TAGLINE } from "@/lib/constants";

const AI_TOOLS = [
  { icon: PenLine, title: "AI 写作", desc: "文章 / 小红书 / 脚本", href: "/write" },
  { icon: Languages, title: "AI 翻译", desc: "中英日韩互译", href: "/translate" },
  { icon: Volume2, title: "AI 配音", desc: "豆包 TTS · 4 音色", href: "/tts" },
  { icon: ImageIcon, title: "AI 生图", desc: "文生图创作", href: "/image" },
];

export const revalidate = 300;

export default async function HomePage() {
  const [{ projects: latestProjects, total: totalPublished }, featuredProjects, weeklyTop, categories] =
    await Promise.all([
      getPublishedProjects(1, 100),
      getFeaturedProjects(8),
      getWeeklyTopProjects(10),
      getCategories(),
    ]);

  const totalProjects = totalPublished || latestProjects.length;
  const totalVotes = [...latestProjects, ...featuredProjects].reduce(
    (s, p) => s + (p.vote_count || 0),
    0
  );

  const featuredIds = new Set(featuredProjects.map((p) => p.id));
  // 全部项目区块：展示所有非精选的已发布项目，确保每个项目都在首页可见
  const dedupedLatest = latestProjects.filter((p) => !featuredIds.has(p.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      {/* ===== HERO（线性居中排版） ===== */}
      <section className="relative pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <Sparkles size={12} className="text-brand" />
          AI PROJECTS HUB
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          独立开发者，
          <br />
          <span className="text-gradient">用 AI 造万物</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          {APP_TAGLINE}。这里收录素人开发者用 AI 做出的真实项目，发现灵感、提交作品、一起把想法变成产品。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={16} />
            提交你的 AI 项目
          </Link>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-border-strong"
          >
            <TrendingUp size={16} className="text-brand" />
            查看排行榜
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-10 border-t border-border pt-6 sm:gap-16">
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{totalProjects}+</div>
            <div className="mt-0.5 text-xs text-muted">已收录项目</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{totalVotes}+</div>
            <div className="mt-0.5 text-xs text-muted">累计推荐</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{categories.length}</div>
            <div className="mt-0.5 text-xs text-muted">分类场景</div>
          </div>
        </div>
      </section>

      {/* ===== 站内 AI 工具（克制卡片） ===== */}
      <Reveal>
        <Section eyebrow="AI POWERED" title="站内 AI 工具">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AI_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-2/50"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg border border-border bg-bg text-brand">
                  <tool.icon size={18} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  免费体验
                  <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* ===== 分类（细线 chips） ===== */}
      <Reveal>
        <Section eyebrow="CATEGORIES" title="按场景探索">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground transition-colors hover:border-brand/50 hover:text-brand"
              >
                <span className="mr-1.5 opacity-70">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* ===== 精选项目 ===== */}
      {featuredProjects.length > 0 && (
        <Reveal>
          <Section
            eyebrow="FEATURED"
            title="精选项目"
            action={
              <Link
                href="/discover"
                className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-brand"
              >
                发现更多
                <ArrowRight size={14} />
              </Link>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <div key={project.id} className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
                  <ProjectCard project={project} featured={i === 0} />
                </div>
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {/* ===== 最新 + 本周热门 ===== */}
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section
            eyebrow="ALL PROJECTS"
            title="全部项目"
            action={
              <Link
                href="/submit"
                className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-brand"
              >
                + 提交项目
              </Link>
            }
          >
            {dedupedLatest.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-4xl mb-2">🤖</p>
                <p className="text-lg font-medium text-foreground">还没有项目</p>
                <p className="mt-1 text-sm text-muted">成为第一个提交 AI 项目的人！</p>
                <Link
                  href="/submit"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Plus size={16} />
                  立即提交
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {dedupedLatest.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </Section>
        </div>

        <aside>
          <Section eyebrow="TRENDING" title="本周热门">
            <div className="rounded-xl border border-border bg-surface p-3">
              {weeklyTop.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">暂无数据</p>
              ) : (
                <ol className="space-y-1">
                  {weeklyTop.map((project, index) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-2"
                      >
                        <span
                          className={`font-mono text-sm font-semibold ${
                            index < 3 ? "text-brand" : "text-muted"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {project.name}
                          </p>
                          <p className="text-xs text-muted">👍 {project.vote_count}</p>
                        </div>
                        <svg viewBox="0 0 40 16" className="h-4 w-10 shrink-0 opacity-60">
                          <polyline
                            points={buildSparkline(project.vote_count)}
                            fill="none"
                            stroke="var(--brand)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Section>
        </aside>
      </div>
    </div>
  );
}

/** 根据投票数生成一条确定的上升趋势线 */
function buildSparkline(seed: number): string {
  const points = [0, 3, 1.5, 5, 4, 8, 6, 11, 9, 14].map(
    (y, i) => `${i * 4},${15 - (y + (seed % 3))}`
  );
  return points.join(" ");
}
