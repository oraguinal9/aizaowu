import Link from "next/link";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 text-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{APP_NAME}</h4>
            <p className="text-gray-500 dark:text-gray-400">{APP_DESCRIPTION}</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">快速链接</h4>
            <div className="flex flex-col gap-1 text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-blue-600">首页</Link>
              <Link href="/rankings" className="hover:text-blue-600">排行榜</Link>
              <Link href="/about" className="hover:text-blue-600">关于我们</Link>
              <a href="https://github.com/oraguinal9" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                🌟 GitHub
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">分类浏览</h4>
            <div className="flex flex-col gap-1 text-gray-500 dark:text-gray-400">
              <Link href="/categories/productivity" className="hover:text-blue-600">⚡ 效率工具</Link>
              <Link href="/categories/creative" className="hover:text-blue-600">🎨 创意设计</Link>
              <Link href="/categories/games" className="hover:text-blue-600">🎮 游戏</Link>
              <Link href="/categories/devtools" className="hover:text-blue-600">🛠️ 开发者工具</Link>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4 text-center text-gray-400 dark:border-gray-700 dark:text-gray-600">
          <p>© 2026 {APP_NAME} — 所有项目链接归原作者所有</p>
        </div>
      </div>
    </footer>
  );
}
