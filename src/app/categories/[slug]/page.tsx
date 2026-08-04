import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getCategories } from "@/lib/db/categories";
import { getProjectsByCategory } from "@/lib/db/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { CategoryJsonLd } from "@/components/ui/json-ld";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "分类未找到" };
  const title = `${category.icon} ${category.name} — AI项目`;
  const description = category.description || `${category.name}相关的AI创造项目`;
  const url = `${APP_URL}/categories/${slug}`;
  const OG_IMAGE = `${APP_URL}/opengraph-image`;
  return {
    title: `${category.icon} ${category.name} — AI项目`,
    description: category.description || `${category.name}相关的AI创造项目`,
    alternates: { canonical: url },
    openGraph: {
      title, description,
      url,
      siteName: APP_NAME,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: [OG_IMAGE],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = "newest", page = "1" } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const currentPage = parseInt(page) || 1;
  const sortBy = sort === "popular" ? "popular" : "newest";
  const { projects, total } = await getProjectsByCategory(slug, currentPage, sortBy);
  const totalPages = Math.ceil(total / 24);
  const categories = await getCategories();

  return (
    <>
      <CategoryJsonLd name={category.name} slug={category.slug} />
      <div className="mx-auto max-w-6xl px-4 py-10">
      {/* 面包屑 */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-brand">首页</Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-foreground">{category.icon} {category.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          {category.icon} {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-muted">{category.description}</p>
        )}
      </div>

      {/* 排序 + 分类切换 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                cat.slug === slug
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-foreground hover:border-brand/50 hover:text-brand"
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          <Link
            href={`/categories/${slug}?sort=newest`}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${sortBy === "newest" ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}
          >
            最新
          </Link>
          <Link
            href={`/categories/${slug}?sort=popular`}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${sortBy === "popular" ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}
          >
            最热
          </Link>
        </div>
      </div>

      {/* 项目列表 */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-lg text-foreground">该分类暂无项目</p>
          <Link href="/submit" className="mt-2 inline-block text-brand hover:underline">
            成为第一个提交的人 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/categories/${slug}?sort=${sortBy}&page=${currentPage - 1}`}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
            >
              ← 上一页
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/categories/${slug}?sort=${sortBy}&page=${currentPage + 1}`}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
            >
              下一页 →
            </Link>
          )}
        </div>
      )}
    </div>
    </>
  );
}
