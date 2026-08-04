import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">404 · Not Found</p>
      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        页面不存在
      </h1>
      <p className="mt-3 max-w-md text-muted">
        你要找的项目可能已被移除，或者链接有误。看看其它方向？
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-border-strong"
        >
          <Compass size={16} className="text-brand" />
          去发现项目
        </Link>
      </div>
    </div>
  );
}
