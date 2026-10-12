"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    if (data.success) setProjects(data.data);
    setLoading(false);
  };

  const hideProject = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ id, status: "hidden" }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("项目已隐藏");
      fetchProjects();
    } else {
      setMessage(data.error || "操作失败");
    }
  };

  const publishProject = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ id, status: "published" }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("项目已发布");
      fetchProjects();
    } else {
      setMessage(data.error || "操作失败");
    }
  };

  const toggleFeature = async (id: string, featured: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ id, is_featured: featured }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(featured ? "已设为精选" : "已取消精选");
      fetchProjects();
    } else {
      setMessage(data.error || "操作失败");
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted">请先登录管理员账号</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <ShieldCheck size={12} className="text-brand" />
        ADMIN
      </span>
      <h1 className="mt-4 mb-6 font-display text-3xl font-bold tracking-tight text-foreground">管理面板</h1>

      {message && (
        <div className="mb-4 rounded-lg border border-border bg-surface p-3 text-sm text-foreground">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted">
          <Loader2 size={16} className="animate-spin text-brand" />
          加载中...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">项目</th>
                <th className="px-4 py-3 text-left font-medium text-muted">状态</th>
                <th className="px-4 py-3 text-left font-medium text-muted">票数</th>
                <th className="px-4 py-3 text-left font-medium text-muted">精选</th>
                <th className="px-4 py-3 text-left font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p: any) => (
                <tr key={p.id} className="transition-colors hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="max-w-xs truncate text-xs text-muted">{p.tagline}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs ${
                      p.status === "published"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}>
                      {p.status === "published" ? "已发布" : "已隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">👍 {p.vote_count}</td>
                  <td className="px-4 py-3 text-foreground">
                    {p.is_featured ? "⭐" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {p.status === "published" ? (
                        <button onClick={() => hideProject(p.id)}
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground transition-colors hover:border-red-500/40 hover:text-red-500">
                          隐藏
                        </button>
                      ) : (
                        <button onClick={() => publishProject(p.id)}
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground transition-colors hover:border-green-500/40 hover:text-green-600">
                          发布
                        </button>
                      )}
                      <button onClick={() => toggleFeature(p.id, !p.is_featured)}
                        className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground transition-colors hover:border-brand/50 hover:text-brand">
                        {p.is_featured ? "取消精选" : "精选"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
