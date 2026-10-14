import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-12 text-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <h4 className="mb-2 font-display font-semibold text-foreground">{APP_NAME} · 个人 AI 工作室</h4>
            <p className="max-w-sm text-muted">{APP_TAGLINE}。智能体、全栈网站、AI 视频、内容工程 —— 每个作品都现场可点开体验，从想法到上线的完整交付。</p>
            <p className="mt-3">
              <Link href="/work-with-me" className="inline-flex items-center gap-1 font-medium text-brand transition-colors hover:brightness-110">
                有想法？聊聊你的需求 →
              </Link>
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-display font-semibold text-foreground">站内</h4>
            <div className="flex flex-col gap-1.5 text-muted">
              <Link href="/#flagship" className="transition-colors hover:text-brand">代表案例</Link>
              <Link href="/#gallery" className="transition-colors hover:text-brand">全部作品</Link>
              <Link href="/tools" className="transition-colors hover:text-brand">免费 AI 工具</Link>
              <Link href="/about" className="transition-colors hover:text-brand">关于</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-display font-semibold text-foreground">外面</h4>
            <div className="flex flex-col gap-1.5 text-muted">
              <a href="https://github.com/oraguinal9" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand">GitHub</a>
              <a href="https://114.55.148.70/agent/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand">由简入深 · AI 学习站</a>
              <a href="https://www.zbjh.top" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand">网文写作智库</a>
              <a href="https://xingjian.zbjh.top" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand">星鉴 · 项目验真</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted">
          <p>© 2026 {APP_NAME} · 个人 AI 工作室 — 从想法到上线，一个人就是一支团队</p>
          <p className="mt-2">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand"
            >
              苏ICP备2026033843号-3
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
