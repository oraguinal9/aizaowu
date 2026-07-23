/**
 * 分类数据访问
 */
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Category } from "@/types";
import { MOCK_CATEGORIES } from "./mock";

let useMock = false;

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories").select("*").order("sort_order", { ascending: true });
    if (!error && data?.length) { useMock = false; return data; }
  } catch {}
  useMock = true;
  return MOCK_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (useMock) return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  try {
    const { data, error } = await supabaseAdmin
      .from("categories").select("*").eq("slug", slug).single();
    if (!error && data) return data;
  } catch {}
  return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
}
