import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "关于",
  description: `关于${APP_NAME} — 一个人的 AI 作品陈列柜：智能体、网站与平台、AI 视频三条线，作品全部在线可点开`,
  alternates: { canonical: `${APP_URL}/about` },
  openGraph: {
    title: `关于 | ${APP_NAME}`,
    description: `关于${APP_NAME} — 一个人的 AI 作品陈列柜，作品全部在线可点开`,
    url: `${APP_URL}/about`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${APP_NAME} 作品集` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `关于 | ${APP_NAME}`,
    description: `关于${APP_NAME} — 一个人的 AI 作品陈列柜，作品全部在线可点开`,
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground">关于 {APP_NAME}</h1>

      <div className="space-y-8 text-foreground/80">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">🛠 这里是什么？</h2>
          <p className="mt-3 leading-relaxed">
            这是{APP_NAME}——我一个人的作品陈列柜。站上的每一个项目，都是我用「一个人 + AI」的方式，
            从想法一路做到能对外访问、能日常运行的服务。
          </p>
          <p className="mt-3 leading-relaxed">
            以前需要一支团队才能做的产品，现在一个人也能做出来。我把它们全部摆在这里，
            不放概念稿、不做效果图 —— 每一个都可以当场点开。
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">🎯 为什么把它们摆出来？</h2>
          <p className="mt-3 leading-relaxed">
            做出来的东西容易散落：有的在服务器上跑着，有的躺在硬盘里，自己都快忘了做过什么。
            索性做一个柜子，把它们收在一处，也方便别人一次看清我到底会做什么。
          </p>
          <p className="mt-3 leading-relaxed">
            所以这里既不是平台、也不是商店，更不是接单广告 ——
            只是一面墙，把我做过的东西挂出来给愿意看的人看。
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">📌 关于本站</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>这是我个人的作品展示站，陈列自己做出来并已上线的项目</li>
            <li>不接投稿、不做平台，站上作品全部出自本人</li>
            <li>每一个都能点开 —— 看到的就是正在运行的东西，不是设计稿</li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">📧 联系我们</h2>
          <p className="mt-3 leading-relaxed">
            有问题、建议或合作意向？欢迎通过以下方式联系：
          </p>
          <p className="mt-4 leading-relaxed">
            QQ：<span className="font-mono font-medium text-brand">503956280</span>（备注来意）
          </p>
          <p className="mt-3">
            <Link href="/work-with-me" className="font-medium text-brand hover:underline">
              → 想聊点什么
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
