import Link from "next/link";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-10 text-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="mb-2 font-display font-semibold text-foreground">{APP_NAME}</h4>
            <p className="text-muted">{APP_DESCRIPTION}</p>
          </div>
          <div>
            <h4 className="mb-2 font-display font-semibold text-foreground">快速链接</h4>
            <div className="flex flex-col gap-1.5 text-muted">
              <Link href="/" className="transition-colors hover:text-brand">首页</Link>
              <Link href="/rankings" className="transition-colors hover:text-brand">排行榜</Link>
              <Link href="/about" className="transition-colors hover:text-brand">关于我们</Link>
              <a
                href="https://github.com/oraguinal9"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand"
              >
                GitHub
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-display font-semibold text-foreground">分类浏览</h4>
            <div className="flex flex-col gap-1.5 text-muted">
              <Link href="/categories/productivity" className="transition-colors hover:text-brand">⚡ 效率工具</Link>
              <Link href="/categories/creative" className="transition-colors hover:text-brand">🎨 创意设计</Link>
              <Link href="/categories/games" className="transition-colors hover:text-brand">🎮 游戏</Link>
              <Link href="/categories/devtools" className="transition-colors hover:text-brand">🛠️ 开发者工具</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted">
          <p>© 2026 {APP_NAME} — 所有项目链接归原作者所有</p>
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
