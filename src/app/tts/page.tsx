"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">🔊 AI配音</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        豆包TTS · 每次最多200字 · 每天免费5次 {remaining !== null && <span className="text-blue-600">（剩余{remaining}次）</span>}
      </p>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30">{error}</div>}

      <div className="mb-4 flex flex-wrap gap-2">
        {VOICES.map((v) => (
          <button key={v.key} onClick={() => setVoice(v.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${voice === v.key ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={200}
        placeholder="输入要合成语音的文字..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-pink-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
      <p className="mt-1 text-right text-xs text-gray-400">{text.length}/200</p>

      <button onClick={handleSubmit} disabled={loading || !text.trim()}
        className="mt-3 rounded-xl bg-pink-600 px-6 py-3 font-medium text-white hover:bg-pink-700 disabled:opacity-50 transition-colors">
        {loading ? "合成中..." : "生成语音 →"}
      </button>

      {audioUrl && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <audio ref={audioRef} controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
