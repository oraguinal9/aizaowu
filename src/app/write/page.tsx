"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PenLine, Loader2 } from "lucide-react";

const TYPES = [
  { key: "article", label: "文章", icon: "📝" },
  { key: "xiaohongshu", label: "小红书", icon: "📕" },
  { key: "script", label: "短视频脚本", icon: "🎬" },
  { key: "email", label: "邮件", icon: "📧" },
  { key: "summary", label: "摘要", icon: "📋" },
];

export default function WritePage() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("article");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
      const res = await fetch("/api/ai/write", { method: "POST", headers, body: JSON.stringify({ topic, type, length }) });
      const d = await res.json();
      if (d.success) { setResult(d.data.content); setRemaining(d.data.remaining); }
      else { setError(d.error); setRemaining(0); }
    } catch { setError("网络错误，请重试"); }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <PenLine size={12} className="text-brand" />
        AI WRITER
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">AI 写作</h1>
      <p className="mt-2 text-muted">
        每天免费 5 次，登录用户 10 次
        {remaining !== null && <span className="ml-2 text-brand">（剩余 {remaining} 次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      {/* 类型选择 */}
      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${type === t.key ? "bg-brand text-white" : "border border-border bg-surface text-foreground hover:border-brand/50"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 长度 */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
        {[{k:"short",l:"短文"}, {k:"medium",l:"中等"}, {k:"long",l:"长文"}].map((s) => (
          <button key={s.k} onClick={() => setLength(s.k)}
            className={`rounded-md px-3 py-1 text-xs transition-colors ${length === s.k ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}>
            {s.l}
          </button>
        ))}
      </div>

      {/* 输入 */}
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4}
        placeholder="输入你想写的内容，例如：一封辞职邮件 / 一篇关于春天的小红书笔记 / 一个30秒的口播脚本"
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors" />

      <button onClick={handleSubmit} disabled={loading || !topic.trim()}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:brightness-110 disabled:opacity-50">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "生成中..." : "开始写作 →"}
      </button>

      {/* 结果 */}
      {result && (
        <div className="mt-8 rounded-xl border border-border bg-surface p-6">
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/85">{result}</div>
        </div>
      )}
    </div>
  );
}
