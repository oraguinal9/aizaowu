"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">✍️ AI写作</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        每天免费5次，登录用户10次
        {remaining !== null && <span className="ml-2 text-blue-600">（剩余{remaining}次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30">{error}</div>}

      {/* 类型选择 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 长度 */}
      <div className="mb-4 flex gap-2">
        {[{k:"short",l:"短文"}, {k:"medium",l:"中等"}, {k:"long",l:"长文"}].map((s) => (
          <button key={s.k} onClick={() => setLength(s.k)}
            className={`rounded-lg px-3 py-1 text-xs ${length === s.k ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50" : "text-gray-500"}`}>
            {s.l}
          </button>
        ))}
      </div>

      {/* 输入 */}
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4}
        placeholder="输入你想写的内容，例如：一封辞职邮件 / 一篇关于春天的小红书笔记 / 一个30秒的口播脚本"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />

      <button onClick={handleSubmit} disabled={loading || !topic.trim()}
        className="mt-3 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? "生成中..." : "开始写作 →"}
      </button>

      {/* 结果 */}
      {result && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="prose prose-gray max-w-none dark:prose-invert whitespace-pre-wrap text-gray-700 dark:text-gray-300">{result}</div>
        </div>
      )}
    </div>
  );
}
