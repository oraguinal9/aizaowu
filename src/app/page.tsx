import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Clapperboard, MessageCircle } from "lucide-react";
import { PenLine, Languages, Volume2, ImageIcon } from "lucide-react";
import { getPublishedProjects } from "@/lib/db/projects";
import GalleryClient, { type GalleryItem } from "@/components/gallery-client";
import { Reveal } from "@/components/ui/reveal";
import { ABILITIES, HOMEPAGE_HIDDEN_SLUGS } from "@/lib/constants";

export const revalidate = 300;

/* ============ 能力线 → 项目分组（按 slug） ============ */
const GROUPS: Record<string, string[]> = {
  agent: [
    "xiaoling-ai", "yuyan-ai", "yuyan-divination", "lingxi-dream", "starry-wishes",
    "ai-pet-wangcai", "jingchen-ai", "wangshu-memoir", "travel-planner-agent",
    "guantu-show-butler", "school-planner-agent", "memoir-agent-pro",
    "life-comeback-planner", "ai-dream-novel", "remote-job-radar",
    "ai-competition-radar", "ai-writer", "comic-assistant",
  ],
  web: [
    "ai-toolbox", "free-api-playground", "one-person-company", "hermes-portable",
    "xingjian-github-hall", "math-club", "english-club", "chinese-club",
    "meow-english-island", "primary-study-park",
  ],
  studio: ["comic-kb", "comic-assistant", "xianxia-kb"],
  edu: [
    "course-ai101", "course-llm", "course-dl", "course-rag", "course-finetune",
    "course-rlhf", "course-aigc", "course-mcp", "course-agent", "course-local",
    "course-prompt", "course-comfy", "course-ragpro", "course-ftplus",
    "course-dify", "course-reason",
  ],
};

function groupOf(slug: string): string {
  if (GROUPS.agent.includes(slug)) return "agent";
  if (GROUPS.studio.includes(slug)) return "studio";
  if (GROUPS.edu.includes(slug)) return "edu";
  if (GROUPS.web.includes(slug)) return "web";
  return "other";
}

/* ============ 旗舰案例（P1 将升级为真实截图） ============ */
const FLAGSHIP = [
  {
    idx: "01",
    name: "小灵 AI 女友",
    domain: "xiaoling.zbjh.top",
    url: "https://xiaoling.zbjh.top",
    slug: "xiaoling-ai",
    tag: "语音全栈 · AI 陪伴",
    story:
      "ASR 语音识别 → 大模型对话 → TTS 合成，全链路自己搭。把响应延迟一路调到「像在打电话」，支持 PWA 打包 APK 装进手机 —— 一个人的全栈语音工程。",
    tags: ["语音交互", "LLM 应用", "PWA/APK", "全栈"],
    cov1: "#5e6ad2",
    cov2: "#ec4899",
  },
  {
    idx: "02",
    name: "观途 · 单剧全程管家",
    domain: "concert.zbjh.top",
    url: "https://concert.zbjh.top",
    slug: "guantu-show-butler",
    tag: "2026 飞猪 AI 旅行创新大赛 · 参赛作品",
    story:
      "把「追一部剧」变成一次可执行的行程：剧集排期、城市联动、全程管家。为大赛从零到提交，产品、后端、五个城市的部署与内容溯源制度，全部独立完成。",
    tags: ["旅行场景", "Agent 编排", "五城部署", "出处制度"],
    cov1: "#22d3ee",
    cov2: "#5e6ad2",
  },
  {
    idx: "03",
    name: "由简入深 · AI 学习站 L1–L16",
    domain: "aizaow.com/learn/",
    url: "https://aizaow.com/learn/",
    slug: null,
    tag: "内容工程 · 16 站成体系",
    story:
      "从 AI 入门、大模型原理、RAG 到 Agent 实战部署 —— 16 个学习站、一套完整原创讲义。这是工作室的方法论本体：做产品的能力，先来自把每件事讲清楚的能力。",
    tags: ["原创讲义", "16 个站点", "零框架纯静态", "持续更新"],
    cov1: "#34d399",
    cov2: "#22d3ee",
  },
  {
    idx: "04",
    name: "星鉴 · GitHub 高星项目录",
    domain: "xingjian.zbjh.top",
    url: "https://xingjian.zbjh.top",
    slug: "xingjian-github-hall",
    tag: "内容工程 · 数据验真",
    story:
      "对 GitHub 高星项目做四维重新打分，附真问题 · 硬伤清单、上手门槛分级与数据口径冲突标注。高星不等于好用 —— 让数据替你验真。",
    tags: ["数据工程", "四维评分", "每日核验", "原创内容"],
    cov1: "#a78bfa",
    cov2: "#f472b6",
  },
] as const;

/* ============ 顺手做的小工具（彩蛋位） ============ */
const AI_TOOLS = [
  { icon: PenLine, title: "AI 写作", href: "/write" },
  { icon: Languages, title: "AI 翻译", href: "/translate" },
  { icon: Volume2, title: "AI 配音", href: "/tts" },
  { icon: ImageIcon, title: "AI 生图", href: "/image" },
];

const METHOD_ASSETS = [
  { icon: BookOpen, name: "由简入深 L1–L16", desc: "16 个 AI 学习站，从入门到 Agent 部署", href: "/learn/" },
  { icon: BookOpen, name: "网文写作智库", desc: "22 篇原创 + AI 味检测器 + 50 个开源项目导航", href: "https://www.zbjh.top" },
  { icon: BookOpen, name: "星鉴 · 项目验真", desc: "GitHub 高星项目四维重打分与硬伤清单", href: "https://xingjian.zbjh.top" },
  { icon: Clapperboard, name: "漫剧工具导航", desc: "112 个 AI 漫剧工具按生产环节聚合", href: "https://zhimanyingfang.cn" },
];

export default async function HomePage() {
  const { projects: allProjects, total: totalPublished } = await getPublishedProjects(1, 100);

  const projects = allProjects.filter((p) => !HOMEPAGE_HIDDEN_SLUGS.includes(p.slug));
  const totalProjects = totalPublished || allProjects.length;
  const liveCount = projects.filter((p) => p.url).length;
  const agentCount = projects.filter((p) => groupOf(p.slug) === "agent").length;
  const webCount = GROUPS.web.length;

  const galleryItems: GalleryItem[] = projects.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    url: p.url,
    voteCount: p.vote_count,
    viewCount: p.view_count,
    catName: p.category?.name || "其他",
    catIcon: p.category?.icon || "📦",
    group: groupOf(p.slug),
    cov: i,
  }));

  const statBand = [
    { v: `${totalProjects}`, k: "上线作品" },
    { v: `${liveCount}+`, k: "在线可点开" },
    { v: "4", k: "能力线" },
    { v: "16", k: "AI 学习站" },
    { v: `${agentCount}`, k: "AI 智能体" },
  ];

  const abilityCount: Record<string, number> = {
    agent: agentCount,
    web: webCount,
    studio: GROUPS.studio.length,
    edu: GROUPS.edu.length + 5,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:pt-24">
      {/* ============ ① HERO ============ */}
      <section className="relative pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          个人 AI 工作室 · 全部作品在线运行中
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.18] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
          一个人 + AI，
          <br />
          <span className="text-gradient">造出了一家公司的产品线</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          智能体、全栈网站、AI 视频、内容工程。下面每一个作品都不是概念稿 ——
          是此刻正在运行、可以点开就用的服务。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#flagship"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            看看能做什么
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-border-strong"
          >
            <MessageCircle size={15} className="text-brand" />
            聊一个你的想法
          </Link>
        </div>
        {/* 数据带 */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 border-t border-border pt-8 sm:grid-cols-5">
          {statBand.map((s) => (
            <div key={s.k} className="text-center">
              <div className="stat-num">{s.v}</div>
              <div className="stat-label mt-1">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ② 四大能力矩阵 ============ */}
      <section id="abilities" className="scroll-mt-24 py-14">
        <Reveal>
          <span className="eyebrow-line">CAPABILITIES</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">四条能力线，一条龙交付</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">从想法到上线到运维，每一环都是同一个人闭环 —— 没有转包，没有传话损耗。</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABILITIES.map((a) => (
              <Link key={a.key} href="#gallery" className="ability-card group block p-6">
                <div className="text-2xl">{a.icon}</div>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">{a.name}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{a.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="font-mono text-muted">{abilityCount[a.key] || 0} 个作品</span>
                  <ArrowRight size={13} className="text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ ③ 旗舰案例 ============ */}
      <section id="flagship" className="scroll-mt-24 py-14">
        <Reveal>
          <span className="eyebrow-line">FLAGSHIP</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">代表案例</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">最能说明问题的四个 —— 点开就能玩，不用想象。</p>
        </Reveal>
        <div className="mt-10 space-y-14">
          {FLAGSHIP.map((f, i) => (
            <Reveal key={f.idx}>
              <div className={`items-center gap-10 md:flex ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* 封面：浏览器窗框 */}
                <div className="md:w-[55%]">
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="browser-frame group block transition-transform hover:-translate-y-1"
                  >
                    <div className="browser-bar">
                      <span className="browser-dot" /><span className="browser-dot" /><span className="browser-dot" />
                      <span className="browser-url">{f.domain}</span>
                    </div>
                    <div
                      className="cover-grad"
                      style={{ ["--cov1" as string]: f.cov1, ["--cov2" as string]: f.cov2, aspectRatio: "16 / 8.5" }}
                    >
                      <div className="cover-title text-2xl sm:text-3xl">{f.name}</div>
                      <div className="cover-domain mt-1">{f.tag}</div>
                      <span className="absolute right-4 top-4 rounded-md bg-black/30 px-2 py-1 text-[11px] font-medium text-white/85 backdrop-blur transition group-hover:bg-brand group-hover:text-white">
                        ▶ 现场体验
                      </span>
                    </div>
                  </a>
                </div>
                {/* 文案 */}
                <div className="mt-6 flex-1 md:mt-0">
                  <div className="font-mono text-sm font-semibold text-brand">{f.idx}</div>
                  <h3 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">{f.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.story}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.tags.map((t) => (
                      <span key={t} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted">{t}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:brightness-110">
                      打开线上版 <ArrowUpRight size={14} />
                    </a>
                    {f.slug && (
                      <Link href={`/projects/${f.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground">
                        项目详情 <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ ④ 作品展馆 ============ */}
      <section id="gallery" className="scroll-mt-24 py-14">
        <Reveal>
          <span className="eyebrow-line">GALLERY</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">全部作品</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">按能力线归档，每一个详情页都有介绍与入口。</p>
        </Reveal>
        <div className="mt-8">
          <GalleryClient items={galleryItems} />
        </div>
      </section>

      {/* ============ ⑤ 方法论背书 ============ */}
      <section id="method" className="scroll-mt-24 py-14">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
            <span className="eyebrow-line">METHOD</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">为什么一个人能干一个团队的活</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              因为先把方法论做成了产品：这些内容资产，就是工作室做每个项目时用的底层能力。
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {METHOD_ASSETS.map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="ability-card group block p-5"
                >
                  <m.icon size={18} className="text-brand" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{m.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{m.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ ⑥ 合作转化 ============ */}
      <section className="py-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-surface to-surface p-8 text-center sm:p-14">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% -20%, color-mix(in srgb, var(--brand) 16%, transparent), transparent 70%)",
              }}
            />
            <div className="relative">
              <span className="eyebrow-line justify-center">WORK WITH ME</span>
              <h2 className="mx-auto mt-4 max-w-xl font-display text-2xl font-bold text-foreground sm:text-3xl">
                有个想做成的东西？
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
                网站定制 · 智能体搭建 · AI 视频制作。聊清需求给固定报价，中途不加价；交付包含部署、域名、HTTPS 与基础运维。
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <MessageCircle size={15} />
                  聊一个你的想法
                </Link>
                <Link
                  href="#gallery"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-6 py-3 text-sm font-semibold text-foreground transition hover:border-border-strong"
                >
                  再逛逛作品
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ 彩蛋：顺手做的小工具 ============ */}
      <section className="border-t border-border py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
          <span className="font-mono uppercase tracking-[0.18em] opacity-70">顺手做的小工具</span>
          {AI_TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="inline-flex items-center gap-1.5 transition-colors hover:text-brand">
              <t.icon size={12} />
              {t.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
