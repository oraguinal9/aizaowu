"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "aizaow_ai_learn_banner_dismissed";
const LEARN_URL = "https://aizaow.com/learn/";

/**
 * 全站顶部 AI 学习入口横幅。
 * - 固定在页面最顶端（sticky top-0），滚动时不消失，最显眼。
 * - 链接指向 aizaow.com/learn/（学习站本体部署在阿里云，这里只做导流入口）。
 * - 用普通 <a> 而非 Next <Link>，避免被前端路由拦截（/learn/ 由 nginx 指向独立学习站）。
 * - 默认展示（SSR 即渲染，便于 SEO 与验证）；关闭状态写入 localStorage，刷新后不再打扰。
 */
export default function AiLearnBanner() {
  const [dismissed, setDismissed] = useState(false); // 默认展示

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="sticky top-0 z-[60] flex h-11 items-center justify-center gap-2 border-b border-brand/20 bg-gradient-to-r from-[color-mix(in_srgb,var(--brand)_85%,transparent)] via-brand-2 to-brand px-3 text-white shadow-sm">
      <span className="text-base leading-none">🧠</span>
      <p className="min-w-0 flex-1 truncate text-center text-sm font-medium">
        <span className="hidden sm:inline">
          AI 学习路线 · 由简入深 L1–L6 纯中文教程，浏览器里直接跑演示&nbsp;
        </span>
        <span className="sm:hidden">AI 学习路线 · 免费学&nbsp;</span>
      </p>
      <a
        href={LEARN_URL}
        className="shrink-0 rounded-full bg-bg px-3 py-1 text-xs font-bold text-brand shadow-sm transition hover:opacity-90"
      >
        开始学习 →
      </a>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
        aria-label="关闭"
        className="shrink-0 rounded p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
