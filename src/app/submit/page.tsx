"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { Category } from "@/types";
import { Rocket, Loader2, Lock, UploadCloud, X } from "lucide-react";

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [devType, setDevType] = useState(""); // 🆕 开发者类型
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 检查登录状态但不强制跳转
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); });
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const combined = [...screenshots, ...newFiles].slice(0, 5);
    setScreenshots(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeScreenshot = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    const next = screenshots.filter((_, idx) => idx !== i);
    setScreenshots(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 未登录 → 弹出登录提示，表单内容保留
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setLoading(true);
    setError(null);

    let screenshotUrls: string[] = [];
    if (screenshots.length > 0) {
      setUploading(true);
      const formData = new FormData();
      screenshots.forEach((f) => formData.append("files", f));
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      });
      const d = await res.json();
      if (!d.success) { setError(d.error); setLoading(false); setUploading(false); return; }
      screenshotUrls = d.data.urls;
      setUploading(false);
    }

    const slug = generateSlug(name);
    const tags = tagsInput.split(/[,，\s]+/).filter(Boolean).map((t: string) => t.replace(/^#/, ""));

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        name, tagline, url, category_id: categoryId || null,
        description, tags, slug,
        screenshots: screenshotUrls,
        thumbnail_url: screenshotUrls[0] || null,
        developer_type: devType || null,
      }),
    });

    const data = await res.json();
    if (data.success) setSuccess(true);
    else setError(data.error || "提交失败");
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors";
  const labelClass = "mb-1 block text-sm font-medium text-foreground/80";

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
          <Rocket size={30} />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">提交成功！</h1>
        <p className="mt-3 text-muted">你的项目已进入审核队列，通过后即可展示。</p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/")}
            className="rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition hover:brightness-110">
            返回首页
          </button>
          <button onClick={() => router.push("/rankings")}
            className="rounded-lg border border-border bg-surface px-6 py-2.5 font-medium text-foreground transition hover:border-border-strong">
            查看排行榜
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <Rocket size={12} className="text-brand" />
        SUBMIT
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">提交项目</h1>
      <p className="mt-2 text-muted">
        分享你用 AI 创造的项目！社区项目将在排行榜优先展示。
      </p>

      {/* 登录提示弹窗 */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginPrompt(false)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
                <Lock size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">登录后即可提交</h3>
              <p className="mt-1 text-sm text-muted">
                你填写的内容已保留，登录后自动提交
              </p>
              <button onClick={handleLogin}
                className="mt-4 w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-bg transition hover:opacity-90">
                使用 GitHub 登录
              </button>
              <button onClick={() => setShowLoginPrompt(false)}
                className="mt-2 w-full rounded-lg border border-border px-4 py-3 text-sm text-muted transition hover:bg-surface-2">
                继续编辑
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className={labelClass}>项目名称 *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
            placeholder="给你的项目起个名字"
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>一句话描述 *</label>
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} required maxLength={120}
            placeholder="用一句话介绍你的项目（最多120字）"
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>项目链接 *</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required
            placeholder="https://..."
            className={inputClass} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>分类</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}>
              <option value="">选择分类...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>开发者类型</label>
            <select value={devType} onChange={(e) => setDevType(e.target.value)}
              className={inputClass}>
              <option value="">选择...</option>
              <option value="solo">🛠️ 独立开发</option>
              <option value="team">👥 小团队 (2-5人)</option>
              <option value="student">🎓 学生作品</option>
              <option value="hobby">🌱 业余项目</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>标签</label>
          <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            placeholder="用逗号分隔，如：AI, React, 效率工具"
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>详细介绍</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8}
            placeholder="详细描述你的项目——它做什么、怎么用AI做的、有什么亮点..."
            className={inputClass} />
        </div>

        {/* 截图上传 */}
        <div>
          <label className={labelClass}>截图（最多5张）</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-brand/50"
          >
            <UploadCloud size={28} className="mx-auto mb-2 text-muted" />
            <p className="text-sm text-muted">点击选择图片或拖拽到此处</p>
            <p className="mt-1 text-xs text-muted">支持 JPG/PNG/WebP，单张不超过5MB</p>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          </div>
          {previews.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {previews.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={url} alt={"预览" + (i + 1)} className="h-20 w-32 rounded-lg border border-border object-cover" />
                  <button type="button" onClick={() => removeScreenshot(i)}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <button type="submit" disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-50">
            {uploading || loading ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
            {uploading ? "上传截图中..." : loading ? "提交中..." : "发布项目"}
          </button>
        ) : (
          <button type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:brightness-110">
            <Rocket size={16} />
            提交项目（需登录）
          </button>
        )}
        {!user && (
          <p className="text-center text-xs text-muted">
            登录后即可提交，表单内容不会丢失
          </p>
        )}
      </form>
    </div>
  );
}
