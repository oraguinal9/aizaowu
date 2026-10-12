"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const next = new URLSearchParams(window.location.search).get("next") || "";
    const redirectTo = `${window.location.origin}/` + next.replace(/^\/+/, "");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "魔法链接已发送到你的邮箱，请查收！" });
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-2 text-center font-display text-2xl font-bold tracking-tight text-foreground">登录 AI 造物</h1>
        <p className="mb-6 text-center text-sm text-muted">
          管理员登录（本站为个人作品展示，暂不开放投稿）
        </p>

        {message && (
          <div
            className={`mb-4 rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Email Magic Link */}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="mb-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            {loading ? "发送中..." : "发送魔法链接"}
          </button>
        </form>
      </div>
    </div>
  );
}
