import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Project } from "@/types";
import { PROJECTS_PER_PAGE } from "@/lib/constants";
import { MOCK_PROJECTS } from "./mock";

/** 清理搜索关键词：转义 ilike 通配符 */
function sanitizeQuery(q: string): string {
  return q.replace(/[%_]/g, "").trim().slice(0, 100);
}

function mockSlice(data: Project[], page: number, limit: number) {
  const from = (page - 1) * limit;
  return { projects: data.slice(from, from + limit), total: data.length };
}

// 安全降级：Supabase 成功（含空结果）直接返回；仅在查询报错时回退 mock。
// 不再使用模块级全局开关——避免一次空结果/报错污染后续所有读取（会导致真实项目详情页 404）。
async function trySupabase<T>(fn: () => Promise<T | null>, mockFallback: T): Promise<T> {
  try {
    const result = await fn();
    if (result !== null && result !== undefined) return result;
  } catch (err) {
    console.error("[db] Supabase 查询失败，回退 mock 数据:", err);
  }
  return mockFallback;
}

export async function getPublishedProjects(page = 1, limit = PROJECTS_PER_PAGE) {
  return trySupabase(async () => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)", { count: "exact" })
      .eq("status", "published").order("published_at", { ascending: false }).range(from, to);
    if (error || !data?.length) return null;
    return { projects: data as Project[], total: count ?? 0 };
  }, mockSlice(
    [...MOCK_PROJECTS].filter(p => p.status === "published")
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
    page, limit
  ));
}

export async function getFeaturedProjects(limit = 3) {
  return trySupabase(async () => {
    const { data, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)")
      .eq("status", "published").eq("is_featured", true)
      .order("vote_count", { ascending: false }).limit(limit);
    if (error) return null;
    return data as Project[];
  }, MOCK_PROJECTS.filter(p => p.is_featured).slice(0, limit));
}

export async function getProjectsByCategory(
  categorySlug: string, page = 1, sort: "newest" | "popular" = "newest", limit = PROJECTS_PER_PAGE
) {
  return trySupabase(async () => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const sortField = sort === "popular" ? "vote_count" : "published_at";
    const { data, count, error } = await supabaseAdmin
      .from("projects").select("*, category:categories!inner(*)", { count: "exact" })
      .eq("status", "published").eq("category.slug", categorySlug)
      .order(sortField, { ascending: false }).range(from, to);
    if (error || !data?.length) return null;
    return { projects: data as Project[], total: count ?? 0 };
  }, (() => {
    const filtered = MOCK_PROJECTS.filter(p => p.category?.slug === categorySlug);
    const sorted = [...filtered].sort((a, b) =>
      sort === "popular" ? b.vote_count - a.vote_count
        : new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    return mockSlice(sorted, page, limit);
  })());
}

export async function getProjectBySlug(slug: string) {
  return trySupabase(async () => {
    const { data, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)").eq("slug", slug).single();
    if (error) return null;
    return data as Project;
  }, MOCK_PROJECTS.find(p => p.slug === slug) || null);
}

export async function getWeeklyTopProjects(limit = 10) {
  return trySupabase(async () => {
    const { data, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)")
      .eq("status", "published").order("vote_count", { ascending: false }).limit(limit);
    if (error) return null;
    return data as Project[];
  }, [...MOCK_PROJECTS].sort((a, b) => b.vote_count - a.vote_count).slice(0, limit));
}

export async function getRankedProjects(
  _timeframe: "daily" | "weekly" | "monthly" | "all", limit = 50
) {
  return trySupabase(async () => {
    const { data, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)")
      .eq("status", "published").order("vote_count", { ascending: false }).limit(limit);
    if (error) return null;
    return data as Project[];
  }, [...MOCK_PROJECTS].sort((a, b) => b.vote_count - a.vote_count).slice(0, limit));
}

export async function searchProjects(query: string, page = 1, limit = PROJECTS_PER_PAGE) {
  const safe = sanitizeQuery(query);
  const q = safe.toLowerCase();
  if (!q) return { projects: [], total: 0 };
  return trySupabase(async () => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)", { count: "exact" })
      .eq("status", "published")
      .or(`name.ilike.%${safe}%,tagline.ilike.%${safe}%`)
      .order("vote_count", { ascending: false }).range(from, to);
    if (error) return null;
    return { projects: data as Project[], total: count ?? 0 };
  }, mockSlice(
    MOCK_PROJECTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
    ).sort((a, b) => b.vote_count - a.vote_count),
    page, limit
  ));
}

export async function getRelatedProjects(projectId: string, categoryId: string | null, limit = 6) {
  if (!categoryId) return [];
  return trySupabase(async () => {
    const { data, error } = await supabaseAdmin
      .from("projects").select("*, category:categories(*)")
      .eq("status", "published").eq("category_id", categoryId).neq("id", projectId)
      .order("vote_count", { ascending: false }).limit(limit);
    if (error) return null;
    return data as Project[];
  }, MOCK_PROJECTS.filter(p => p.category_id === categoryId && p.id !== projectId).slice(0, limit));
}

export async function incrementViewCount(_slug: string) {
  try { await supabaseAdmin.rpc("increment_view", { project_slug: _slug }); } catch {}
}
