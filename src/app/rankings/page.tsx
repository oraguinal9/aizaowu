"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Loader2 } from "lucide-react";
import type { Project } from "@/types";
import { ProjectLogo } from "@/components/ui/project-logo";

export default function RankingsPage() {
  const [tab, setTab] = useState<"community" | "all">("community");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects?limit=50")
      .then((r) => r.json())
      .then((data) => {
        const all = (data.projects || data.data || []).filter(
          (p: Project) => p.status === "published"
        );
        setProjects(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 社区项目：slug 不以 "ext-" 开头（即用户提交的）
  const communityProjects = projects
    .filter((p) => !p.slug.startsWith("ext-"))
    .sort((a, b) => b.vote_count - a.vote_count);

  // 全站：所有项目
  const allProjects = [...projects].sort((a, b) => b.vote_count - a.vote_count);

  const displayProjects = tab === "community" ? communityProjects : allProjects;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <Trophy size={12} className="text-brand" />
        RANKINGS
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">排行榜</h1>
      <p className="mt-2 text-muted">
        {tab === "community"
          ? "独立开发者提交的项目，按社区推荐排序"
          : "全部收录项目，包含知名AI工具和社区作品"}
      </p>

      {/* Tab 切换 */}
      <div className="mt-6 mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1 sm:w-fit">
        <button
          onClick={() => setTab("community")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "community"
              ? "bg-brand text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          社区项目榜
        </button>
        <button
          onClick={() => setTab("all")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "all"
              ? "bg-brand text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          全站总榜
        </button>
      </div>

      {/* 排行榜列表 */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <Loader2 size={24} className="animate-spin text-brand" />
            <p className="text-sm text-muted">加载中...</p>
          </div>
        ) : displayProjects.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted">暂无数据</p>
        ) : (
          <ol className="divide-y divide-border">
            {displayProjects.map((project, i) => {
              const isCommunity = !project.slug.startsWith("ext-");
              const rank = i + 1;
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-2/60"
                  >
                    {/* 序号 */}
                    <span
                      className={`w-8 shrink-0 text-center font-mono text-base font-bold ${
                        rank === 1
                          ? "text-brand"
                          : rank === 2
                          ? "text-brand-2"
                          : rank === 3
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      {String(rank).padStart(2, "0")}
                    </span>

                    <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="sm" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-foreground">
                          {project.name}
                        </p>
                        {isCommunity && (
                          <span className="shrink-0 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted">
                            社区
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted">{project.tagline}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-base font-bold text-foreground">
                        {project.vote_count}
                      </p>
                      {project.category && (
                        <span className="text-xs text-muted">
                          {project.category.icon} {project.category.name}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
