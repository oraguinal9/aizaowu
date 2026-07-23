"use client";

import { useState } from "react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 左侧 */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white shrink-0">
            <span className="text-2xl">🤖</span>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>
          <Link href="/submit"
            className="hidden sm:inline text-sm text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors">
            + 提交
          </Link>
          <Link href="/write"
            className="hidden sm:inline text-sm text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors">
            ✍️ 写作
          </Link>
          <Link href="/tools"
            className="hidden sm:inline text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            🧰 AI工具
          </Link>
          <nav className="hidden gap-4 text-sm font-medium sm:flex">
            <Link href="/discover" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">发现</Link>
            <Link href="/categories/productivity" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">分类</Link>
            <Link href="/rankings" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">排行榜</Link>
          </nav>
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-2">
          <Link href="/search"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            🔍
          </Link>
          {/* 汉堡按钮 */}
          <button onClick={() => setOpen(!open)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
            aria-label="菜单">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:hidden">
          <nav className="flex flex-col gap-2">
            <Link href="/discover" onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              🚀 发现项目
            </Link>
            <Link href="/submit" onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              + 提交项目
            </Link>
            <Link href="/categories/productivity" onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              📂 分类浏览
            </Link>
            <Link href="/rankings" onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              🏆 排行榜
            </Link>
            <Link href="/search" onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              🔍 搜索
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
