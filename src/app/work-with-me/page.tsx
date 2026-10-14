import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Bot, Clapperboard, ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import QqCopy from "@/components/layout/qq-copy";

import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "聊聊 · 我怎么做东西",
  description: "一个个人作品展示站：智能体、网站与平台、AI 视频三条线，46 个作品全部在线可点开。想聊技术、聊项目，加 QQ 就好。",
  alternates: { canonical: `${APP_URL}/work-with-me` },
};

const PRACTICES = [
  {
    icon: Globe,
    name: "网站 / 平台",
    desc: "从域名、备案、HTTPS 到前后端与数据库，一个人从头做到能对外访问、能日常运维。",
    points: ["Next.js / Node 全栈", "域名证书备案一条龙", "部署与运维自己做"],
  },
  {
    icon: Bot,
    name: "AI 智能体",
    desc: "对话、陪伴、规划、知识库问答 —— 按场景选模型，把记忆、工具链和多轮任务编排搭起来。",
    points: ["模型选型与提示词工程", "知识库 / RAG 接入", "成本与响应速度调优"],
  },
  {
    icon: Clapperboard,
    name: "AI 视频 / 漫剧",
    desc: "角色资产、分镜脚本、图生视频、成片剪辑 —— 整套管线自己搭、自己跑。",
    points: ["角色一致性工作流", "本地 ComfyUI 出图出片", "成片 + 可复用管线"],
  },
];

const STEPS = [
  { t: "先想清楚", d: "把需求写下来。很多时候写着写着，就知道哪些其实是伪需求。" },
  { t: "先跑最短链路", d: "不做大而全，先把一条能点开看的最短链路跑通，再往上加。" },
  { t: "一路记录", d: "踩过的坑都记下来 —— 这些记录本身就是项目的一部分。" },
  { t: "上线才算完", d: "部署、域名、证书、运维都算在项目里；能对外访问，才算做完。" },
];

const FAQ = [
  { q: "这些作品都是你做的？", a: "是。站上每一个作品都能点开看，一部分在 GitHub 上有公开仓库（github.com/oraguinal9）。" },
  { q: "为什么是一个人做？", a: "因为需求、代码、部署在同一双手上：不用层层传话，改一版也就几分钟。" },
  { q: "为什么搞这么多条线？", a: "做智能体要会前后端，做漫剧要懂出图出片，学习站是顺手沉淀下来的方法论。做久了就积成一片了。" },
];

export default function WorkWithMePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
      {/* Hero */}
      <section className="text-center">
        <span className="eyebrow-line">ABOUT MY WORK</span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-5xl">
          一个人，
          <br />
          <span className="text-gradient">一堆自己做出来的东西</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          这里不是产品页，是我的作品柜。47 个作品全部在线、现场可点开 —— 想聊技术、聊项目，或者只是好奇某个东西怎么做的，都欢迎。
        </p>
      </section>

      {/* 三条线 */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">我平时在做的三类东西</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PRACTICES.map((s) => (
              <div key={s.name} className="ability-card flex flex-col p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-border bg-bg text-brand">
                  <s.icon size={20} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-muted">
                      <Check size={13} className="mt-0.5 shrink-0 text-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 做法 */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">我一般怎么做东西</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((st, i) => (
              <div key={st.t} className="rounded-xl border border-border bg-surface p-5">
                <div className="font-mono text-xs font-semibold text-brand">0{i + 1}</div>
                <h3 className="mt-2 font-display text-base font-semibold text-foreground">{st.t}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{st.d}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 联系 */}
      <Reveal>
        <section className="mt-16 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="p-8 sm:p-10">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-foreground">想聊就加我</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                QQ 加我就行，聊技术、聊项目、或者只是问问某个东西怎么做的都欢迎，不用客套。
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <QqCopy />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-foreground transition hover:border-border-strong">
                  先看看作品
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="https://github.com/oraguinal9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-foreground transition hover:border-border-strong"
                >
                  GitHub
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">常见疑问</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-surface px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-foreground marker:hidden">
                  <span className="mr-2 text-brand group-open:hidden">+</span>
                  <span className="mr-2 hidden text-brand group-open:inline">−</span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-6 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
