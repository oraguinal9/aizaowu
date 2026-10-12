"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Volume2, Loader2 } from "lucide-react";

const VOICES = [
  { key: "tianmei", label: "甜宠", icon: "💕" },
  { key: "wenrou", label: "淑女", icon: "🌸" },
  { key: "yujie", label: "文艺", icon: "📚" },
  { key: "huopo", label: "活泼", icon: "🎵" },
];

export default function TTSPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("tianmei");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(""); setAudioUrl("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
      const res = await fetch("/api/ai/tts", { method: "POST", headers, body: JSON.stringify({ text, voice }) });
      const d = await res.json();
      if (d.success) { setAudioUrl(d.data.audio); setRemaining(d.data.remaining); audioRef.current?.play(); }
      else { setError(d.error); setRemaining(0); }
    } catch { setError("网络错误"); }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <Volume2 size={12} className="text-brand" />
        AI TTS
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">AI 配音</h1>
      <p className="mt-2 text-muted">
        豆包 TTS · 每次最多 200 字 · 每天免费 5 次 {remaining !== null && <span className="text-brand">（剩余 {remaining} 次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {VOICES.map((v) => (
          <button key={v.key} onClick={() => setVoice(v.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${voice === v.key ? "bg-brand text-white" : "border border-border bg-surface text-foreground hover:border-brand/50"}`}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={200}
        placeholder="输入要合成语音的文字..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors" />
      <p className="mt-1 text-right text-xs text-muted">{text.length}/200</p>

      <button onClick={handleSubmit} disabled={loading || !text.trim()}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:brightness-110 disabled:opacity-50">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "合成中..." : "生成语音 →"}
      </button>

      {audioUrl && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
          <audio ref={audioRef} controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
