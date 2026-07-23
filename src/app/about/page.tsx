import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

const OG_IMAGE = `${APP_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: "关于我们",
  description: `关于${APP_NAME} — AI项目展示和发现平台`,
  alternates: { canonical: `${APP_URL}/about` },
  openGraph: {
    title: `关于我们 | ${APP_NAME}`,
    description: `关于${APP_NAME} — AI项目展示和发现平台`,
    url: `${APP_URL}/about`,
    siteName: APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "关于我们" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `关于我们 | ${APP_NAME}`,
    description: `关于${APP_NAME} — AI项目展示和发现平台`,
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">关于 {APP_NAME}</h1>

      <div className="prose prose-gray max-w-none dark:prose-invert space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🤖 {APP_NAME}是什么？</h2>
          <p>
            {APP_NAME}是一个AI创造项目的发现和展示平台。在这里，你可以找到各种由AI辅助开发的酷项目——网站、工具、游戏、应用，应有尽有。
          </p>
          <p>
            我们相信，AI正在改变创造的方式。以前需要专业团队才能做的事情，现在一个人 + AI就能做到。
            {APP_NAME}就是这些"AI创造者"的舞台。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🎯 为什么创建这个平台？</h2>
          <p>
            作为一个素人开发者，我们发现一个问题：用AI做出了项目，却不知道在哪发布，怎么让别人看到。
            GitHub虽然好，但国内访问不稳定；ProductHunt门槛太高，面向英文用户。
          </p>
          <p>
            就像当年传奇私服兴起时，有人做了私服发布平台一样——制作者需要曝光，玩家需要发现。
            AI时代也需要这样一个"发布平台"。{APP_NAME}就是这个答案。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">📝 如何提交项目？</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>注册账号（GitHub或邮箱登录）</li>
            <li>点击"提交项目"，填写项目信息</li>
            <li>上传截图，写一段项目介绍</li>
            <li>提交后立即发布，所有人可见</li>
          </ol>
          <p className="mt-4">
            <Link href="/submit" className="text-blue-600 hover:underline font-medium">
              → 立即提交你的AI项目
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">📧 联系我们</h2>
          <p>
            有问题、建议或合作意向？欢迎通过以下方式联系：
          </p>
          <p>
            📧 Email: admin@aizaowu.top
          </p>
        </section>
      </div>
    </div>
  );
}
