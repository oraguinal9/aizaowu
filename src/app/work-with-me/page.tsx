import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Bot, Clapperboard, ArrowRight, Check } from "lucide-react";
import { WECHAT_ID } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import WechatQr from "@/components/layout/wechat-qr";

export const metadata: Metadata = {
  title: "合作 · 从想法到上线",
  description: "网站定制、智能体搭建、AI 视频制作 —— 一个人就是一支团队：需求、设计、开发、部署、运维全链路一人闭环。",
};

const SERVICES = [
  {
    icon: Globe,
    name: "网站 / 平台定制",
    desc: "展示站、工具站、知识库、垂直导航 —— 域名、HTTPS、部署、运维全部交付，上线即可用。",
    points: ["响应式 + SEO 基建", "备案/证书/运维全包", "上线后 30 天免费修小问题"],
  },
  {
    icon: Bot,
    name: "AI 智能体搭建",
    desc: "客服、陪伴、规划、知识库问答 —— 按业务场景选型模型与架构，做好记忆与多轮任务编排。",
    points: ["模型选型与提示词工程", "知识库 / RAG 接入", "成本与响应速度调优"],
  },
  {
    icon: Clapperboard,
    name: "AI 视频 / 漫剧",
    desc: "角色资产、分镜脚本、图生视频、成片剪辑全流程 —— 短剧、宣传片、科普动画都能做。",
    points: ["角色一致性工作流", "成片 2D/3D 风格可选", "交付成片 + 可复用管线"],
  },
];

const STEPS = [
  { t: "聊需求", d: "微信或邮件说清想法，48 小时内给出可行性与方案边界 —— 做不了、不划算的会直说。" },
  { t: "定方案", d: "明确范围、周期与验收标准，给一个能点开看的效果基准（通常是站上某个现成作品）。" },
  { t: "做出来", d: "开发期间可看进度，关键节点先给可点的预览，避免「做完才发现不对」。" },
  { t: "交到底", d: "部署上线、域名证书、基础运维一并交付，附使用说明与后续维护约定。" },
];

const FAQ = [
  { q: "为什么是「一个人」？", a: "因为没有转包和传话损耗：需求、设计、代码、部署是同一双手，改需求不用层层翻译，反馈当天就能进版本。" },
  { q: "周期和价格怎么算？", a: "按范围估：展示型网站通常以周计；智能体与定制平台以阶段计。聊清需求后给固定报价，中途不加价。" },
  { q: "我能看到哪些已上线的例子？", a: "本站作品集里 30+ 个项目全部在线可点开 —— 不是设计稿，是正在运行的服务。" },
];

export default function WorkWithMePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
      {/* Hero */}
      <section className="text-center">
        <span className="eyebrow-line">WORK WITH ME</span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-5xl">
          从想法到上线，
          <br />
          <span className="text-gradient">一个人就是一支团队</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          站上的 47 个作品就是能力证明：不是概念稿，是正在运行的服务。如果你也有想做成的东西 —— 往下看，然后聊聊。
        </p>
      </section>

      {/* 服务 */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">三种合作形态</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {SERVICES.map((s) => (
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

      {/* 流程 */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">怎么开始</h2>
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
          <div className="grid items-center gap-8 p-8 sm:p-10 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">有个想法？直接聊</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                加微信请备注来意（如「做个网站」「搭智能体」），一般当天回复。也可以先逛逛作品集，想清楚了再来。
              </p>
              <p className="mt-4 font-mono text-sm text-brand">{WECHAT_ID}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-foreground transition hover:border-border-strong">
                  先看看作品集
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {/* 微信二维码位：public/wechat-qr.png 就位后自动显示 */}
            <WechatQr />
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
