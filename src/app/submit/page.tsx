"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { Category } from "@/types";

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
      else setUser(session.user);
    });
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); });
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
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
      }),
    });

    const data = await res.json();
    if (data.success) setSuccess(true);
    else setError(data.error || "提交失败");
    setLoading(false);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">提交成功！</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">你的项目已发布，现在所有人可见。</p>
        <button onClick={() => router.push("/")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">🚀 提交项目</h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">分享你用AI创造的项目！</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">项目名称 *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
            placeholder="给你的项目起个名字"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">一句话描述 *</label>
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} required maxLength={120}
            placeholder="用一句话介绍你的项目（最多120字）"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">项目链接 *</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">分类</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <option value="">选择分类...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">标签</label>
          <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            placeholder="用逗号分隔，如：AI, React, 效率工具"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">详细介绍</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8}
            placeholder="详细描述你的项目——它做什么、怎么用AI做的、有什么亮点..."
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        </div>

        {/* 截图上传 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">截图（最多5张）</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500 transition-colors"
          >
            <p className="text-gray-400">📁 点击选择图片或拖拽到此处</p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG/WebP，单张不超过5MB</p>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          </div>
          {previews.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {previews.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={url} alt={"预览" + (i + 1)} className="h-20 w-32 rounded-lg object-cover" />
                  <button type="button" onClick={() => removeScreenshot(i)}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || !user}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
          {uploading ? "上传截图中..." : loading ? "提交中..." : "🚀 发布项目"}
        </button>
      </form>
    </div>
  );
}
