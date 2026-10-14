"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ABILITIES } from "@/lib/constants";

export type GalleryItem = {
  slug: string;
  name: string;
  tagline: string;
  url: string | null;
  voteCount: number;
  viewCount: number;
  catName: string;
  catIcon: string;
  group: string; // agent | web | studio | edu | other
  cov: number; // 封面配色索引
};

const COVERS = [
  ["#5e6ad2", "#ec4899"],
  ["#22d3ee", "#5e6ad2"],
  ["#f5b356", "#ec4899"],
  ["#34d399", "#22d3ee"],
  ["#a78bfa", "#f472b6"],
  ["#8b9aff", "#34d399"],
] as const;

const FILTERS = [
  { key: "all", label: "全部" },
  ...ABILITIES.map((a) => ({ key: a.key, label: a.name })),
  { key: "other", label: "其他" },
];

const PAGE = 12;

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.group === filter)),
    [filter, items]
  );
  const shown = expanded ? filtered : filtered.slice(0, PAGE);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) m.set(it.group, (m.get(it.group) || 0) + 1);
    return m;
  }, [items]);

  return (
    <div>
      {/* 筛选条 */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const n = f.key === "all" ? items.length : counts.get(f.key) || 0;
          if (f.key !== "all" && n === 0) return null;
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => { setFilter(f.key); setExpanded(false); }}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1.5 font-mono text-[11px] opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {/* 卡片网格 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((it) => (
          <Link
            key={it.slug}
            href={`/projects/${it.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--glow)]"
          >
            <div
              className="cover-grad"
              style={{ ["--cov1" as string]: COVERS[it.cov % COVERS.length][0], ["--cov2" as string]: COVERS[it.cov % COVERS.length][1] }}
            >
              <div className="cover-title text-lg leading-snug">{it.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="cover-domain">{it.url ? it.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : it.catName}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">{it.catIcon} {it.catName}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-muted">{it.tagline}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <span>👍 {it.voteCount} · 已上线</span>
                {it.url ? (
                  <span className="inline-flex items-center gap-1 text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    现场体验 <ExternalLink size={11} />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    查看 <ArrowRight size={11} />
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 展开 */}
      {filtered.length > PAGE && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-border-strong"
          >
            {expanded ? "收起" : `展开全部 ${filtered.length} 个作品`}
            <ArrowRight size={14} className={expanded ? "rotate-90 transition-transform" : "transition-transform"} />
          </button>
        </div>
      )}
    </div>
  );
}
