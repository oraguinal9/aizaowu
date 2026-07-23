import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 面包屑 */}
      <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{category.icon} {category.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {category.icon} {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">{category.description}</p>
        )}
      </div>

      {/* 排序 + 分类切换 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`rounded-full px-3 py-1 text-sm ${
                cat.slug === slug
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/categories/${slug}?sort=newest`}
            className={`rounded-lg px-3 py-1 text-sm ${sortBy === "newest" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            最新
          </Link>
          <Link
            href={`/categories/${slug}?sort=popular`}
            className={`rounded-lg px-3 py-1 text-sm ${sortBy === "popular" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            最热
          </Link>
        </div>
      </div>

      {/* 项目列表 */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400 dark:border-gray-600 dark:text-gray-500">
          <p className="text-lg">该分类暂无项目</p>
          <Link href="/submit" className="mt-2 inline-block text-blue-600 hover:underline">
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
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              ← 上一页
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-500">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/categories/${slug}?sort=${sortBy}&page=${currentPage + 1}`}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
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
