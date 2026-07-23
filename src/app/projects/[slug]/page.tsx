import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects, incrementViewCount } from "@/lib/db/projects";
import { formatDate } from "@/lib/utils";
import { VoteButton } from "@/components/ui/vote-button";
import { CommentSection } from "@/components/ui/comment-section";
import { ProjectJsonLd } from "@/components/ui/json-ld";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

export const revalidate = 600;

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "项目未找到" };
  const projectUrl = `${APP_URL}/projects/${project.slug}`;
  const ogImage = project.thumbnail_url || `${APP_URL}/opengraph-image`;
  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.tagline,
      url: projectUrl,
      siteName: APP_NAME,
      images: project.thumbnail_url
        ? [{ url: project.thumbnail_url, width: 1200, height: 630, alt: project.name }]
        : [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: project.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.tagline,
      images: [ogImage],
    },
    alternates: { canonical: projectUrl },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  incrementViewCount(slug).catch(() => {});
  const relatedProjects = await getRelatedProjects(project.id, project.category_id);

  return (
    <>
      <ProjectJsonLd project={project} />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <span className="mx-2">/</span>
          {project.category && (
            <>
              <Link href={`/categories/${project.category.slug}`} className="hover:text-blue-600">
                {project.category.icon} {project.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-gray-900 dark:text-white">{project.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">{project.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
            {project.category && (
              <Link href={`/categories/${project.category.slug}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {project.category.icon} {project.category.name}
              </Link>
            )}
            <span>📅 {formatDate(project.published_at)}</span>
            <span>👀 {project.view_count} 浏览</span>
            <span>💬 {project.comment_count} 评论</span>
          </div>
          {project.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.tags.map((tag: string) => (
                <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {project.screenshots.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={project.screenshots[0]} alt={project.name} className="w-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">📝 项目介绍</h2>
          <div className="prose prose-gray max-w-none dark:prose-invert whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {project.description}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-6 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors">
            🔗 访问项目 →
          </a>
          <VoteButton projectId={project.id} initialVotes={project.vote_count} />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            链接失效？<Link href="/about" className="underline">联系我们</Link>
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-gray-200 p-6 dark:border-gray-700">
          <CommentSection projectId={project.id} />
        </div>

        {relatedProjects.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📎 相关项目</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`}
                  className="rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-blue-600 transition-all">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{p.tagline}</p>
                  <span className="mt-2 inline-block text-xs text-gray-400">👍 {p.vote_count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
