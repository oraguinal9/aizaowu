"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/#abilities", label: "能力" },
  { href: "/#flagship", label: "代表案例" },
  { href: "/#gallery", label: "作品集" },
  { href: "/#method", label: "方法论" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-11 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 左：身份 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-brand">
              <Sparkles size={14} />
            </span>
            <span className="text-foreground">{APP_NAME}<span className="ml-1.5 hidden text-xs font-medium text-muted sm:inline">· 个人 AI 工作室</span></span>
          </Link>
          <nav className="hidden items-center gap-0.5 text-sm md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                {n.label}
              </Link>
            ))}
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
            href="/work-with-me"
            className="hidden items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 sm:inline-flex"
          >
            联系方式
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="菜单"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground md:hidden"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* 移动端下拉 */}
      {open && (
        <div className="border-t border-border bg-bg p-2 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">
                {n.label}
              </Link>
            ))}
            <Link href="/work-with-me" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-surface-2">聊聊 · 联系方式</Link>
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-2">🔍 搜索</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
