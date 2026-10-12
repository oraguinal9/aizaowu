"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, Sparkles, Plus } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-11 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 左 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-brand">
              <Sparkles size={14} />
            </span>
            <span className="hidden text-foreground sm:inline">{APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-0.5 text-sm sm:flex">
            <Link href="/discover" className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">发现</Link>
            <Link href="/categories/productivity" className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">分类</Link>
            <Link href="/rankings" className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">排行榜</Link>
            <Link href="/tools" className="rounded-md px-3 py-1.5 font-medium text-brand transition-colors hover:bg-surface-2">AI工具</Link>
          </nav>
        </div>

        {/* 右 */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="搜索"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <Search size={15} />
          </Link>
          <Link
            href="/submit"
            className="hidden items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 sm:inline-flex"
          >
            <Plus size={14} />
            提交
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="菜单"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground sm:hidden"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* 移动端下拉 */}
      {open && (
        <div className="border-t border-border bg-bg p-2 sm:hidden">
          <nav className="flex flex-col gap-0.5">
            <Link href="/discover" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">🚀 发现项目</Link>
            <Link href="/submit" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-brand hover:bg-surface-2">+ 提交项目</Link>
            <Link href="/categories/productivity" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">📂 分类浏览</Link>
            <Link href="/rankings" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">🏆 排行榜</Link>
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">🔍 搜索</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
