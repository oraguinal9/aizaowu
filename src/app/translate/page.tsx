"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Languages, Loader2, Copy } from "lucide-react";

const LANGS = [
  { key: "zh2en", label: "中 → 英", icon: "🇬🇧" },
  { key: "en2zh", label: "英 → 中", icon: "🇨🇳" },
  { key: "zh2ja", label: "中 → 日", icon: "🇯🇵" },
  { key: "zh2ko", label: "中 → 韩", icon: "🇰🇷" },
];

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("zh2en");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
      const res = await fetch("/api/ai/translate", { method: "POST", headers, body: JSON.stringify({ text, lang }) });
      const d = await res.json();
      if (d.success) { setResult(d.data.content); setRemaining(d.data.remaining); }
      else { setError(d.error); setRemaining(0); }
    } catch { setError("网络错误"); }
    setLoading(false);
  };

  const copyResult = () => { navigator.clipboard.writeText(result); alert("已复制"); };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <Languages size={12} className="text-brand" />
        AI TRANSLATOR
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">AI 翻译</h1>
      <p className="mt-2 text-muted">
        每天免费 5 次，登录 10 次 {remaining !== null && <span className="text-brand">（剩余 {remaining} 次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {LANGS.map((l) => (
          <button key={l.key} onClick={() => setLang(l.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${lang === l.key ? "bg-brand text-white" : "border border-border bg-surface text-foreground hover:border-brand/50"}`}>
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6}
        placeholder="输入要翻译的内容..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors" />

      <button onClick={handleSubmit} disabled={loading || !text.trim()}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:brightness-110 disabled:opacity-50">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "翻译中..." : "开始翻译 →"}
      </button>

      {result && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted">翻译结果</h3>
            <button onClick={copyResult} className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2.5 py-1 text-xs text-muted transition-colors hover:text-brand">
              <Copy size={12} />
              复制
            </button>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground/85">{result}</p>
        </div>
      )}
    </div>
  );
}
