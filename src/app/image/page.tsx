"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ImageIcon, Loader2 } from "lucide-react";

const STYLES = [
  { key: "default", label: "通用", icon: "🎨" },
  { key: "realistic", label: "写实", icon: "📷" },
  { key: "anime", label: "动漫", icon: "🎌" },
  { key: "cyberpunk", label: "赛博", icon: "🤖" },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("default");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(""); setUrls([]);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
      const res = await fetch("/api/ai/image", { method: "POST", headers, body: JSON.stringify({ prompt, style }) });
      const d = await res.json();
      if (d.success) { setUrls(d.data.urls); setRemaining(d.data.remaining); }
      else { setError(d.error); setRemaining(0); }
    } catch { setError("网络错误"); }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <ImageIcon size={12} className="text-brand" />
        AI IMAGE
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">AI 绘画</h1>
      <p className="mt-2 text-muted">
        每天免费 3 次，登录 6 次 {remaining !== null && <span className="text-brand">（剩余 {remaining} 次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button key={s.key} onClick={() => setStyle(s.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${style === s.key ? "bg-brand text-white" : "border border-border bg-surface text-foreground hover:border-brand/50"}`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要的画面，例如：一只在樱花树下睡觉的柴犬"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading || !prompt.trim()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-50">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "生成中..." : "生成 →"}
        </button>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="mx-auto inline-block h-64 w-64 animate-pulse rounded-xl bg-surface-2" />
          <p className="mt-3 text-sm text-muted">AI 正在绘制中，请稍候...</p>
        </div>
      )}

      {urls.length > 0 && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {urls.map((url, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border">
                <img src={url} alt={`生成图${i + 1}`} className="w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
