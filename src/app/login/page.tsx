"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Code2, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "魔法链接已发送到你的邮箱，请查收！" });
    }
    setLoading(false);
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setMessage({ type: "error", text: error.message });
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-2 text-center font-display text-2xl font-bold tracking-tight text-foreground">登录 AI 造物</h1>
        <p className="mb-6 text-center text-sm text-muted">
          登录后可以提交项目和投票
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

        {/* GitHub */}
        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-3 font-medium text-foreground transition hover:border-border-strong disabled:opacity-50"
        >
          <Code2 size={16} />
          使用 GitHub 登录
        </button>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted">或</span>
          <div className="flex-1 border-t border-border" />
        </div>

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
