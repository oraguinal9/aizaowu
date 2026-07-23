"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">🌐 AI翻译</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        每天免费5次，登录10次 {remaining !== null && <span className="text-blue-600">（剩余{remaining}次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30">{error}</div>}

      <div className="mb-4 flex flex-wrap gap-2">
        {LANGS.map((l) => (
          <button key={l.key} onClick={() => setLang(l.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${lang === l.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6}
        placeholder="输入要翻译的内容..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />

      <button onClick={handleSubmit} disabled={loading || !text.trim()}
        className="mt-3 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? "翻译中..." : "开始翻译 →"}
      </button>

      {result && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">翻译结果</h3>
            <button onClick={copyResult} className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400">📋 复制</button>
          </div>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
