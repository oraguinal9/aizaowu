"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">🎨 AI绘画</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        每天免费3次，登录6次 {remaining !== null && <span className="text-blue-600">（剩余{remaining}次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30">{error}</div>}

      <div className="mb-4 flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button key={s.key} onClick={() => setStyle(s.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${style === s.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要的画面，例如：一只在樱花树下睡觉的柴犬"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading || !prompt.trim()}
          className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {loading ? "生成中..." : "生成 →"}
        </button>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block h-64 w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          <p className="mt-3 text-sm text-gray-400">AI正在绘制中，请稍候...</p>
        </div>
      )}

      {urls.length > 0 && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {urls.map((url, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <img src={url} alt={`生成图${i + 1}`} className="w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
