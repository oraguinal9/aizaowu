"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

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
        <p className="text-gray-500">请先登录管理员账号</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">🛡️ 管理面板</h1>

      {message && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">项目</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">票数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">精选</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {projects.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{p.tagline}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      p.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {p.status === "published" ? "已发布" : "已隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">👍 {p.vote_count}</td>
                  <td className="px-4 py-3">
                    {p.is_featured ? "⭐" : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.status === "published" ? (
                        <button onClick={() => hideProject(p.id)}
                          className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                          隐藏
                        </button>
                      ) : (
                        <button onClick={() => publishProject(p.id)}
                          className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                          发布
                        </button>
                      )}
                      <button onClick={() => toggleFeature(p.id, !p.is_featured)}
                        className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
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
