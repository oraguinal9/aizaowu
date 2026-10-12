import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, CalendarDays, Eye, Tag, ChevronRight } from "lucide-react";
import { getProjectBySlug, getRelatedProjects } from "@/lib/db/projects";
import { formatDate } from "@/lib/utils";
import { VoteButton } from "@/components/ui/vote-button";
import { ProjectJsonLd } from "@/components/ui/json-ld";
import { ProjectLogo } from "@/components/ui/project-logo";
import { ProjectCard } from "@/components/ui/project-card";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

export const revalidate = 600;

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
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

  const relatedProjects = await getRelatedProjects(project.id, project.category_id);

  return (
    <>
      <ProjectJsonLd project={project} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* 面包屑 */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-brand">
            <ArrowLeft size={14} />
            首页
          </Link>
          {project.category && (
            <>
              <ChevronRight size={14} className="opacity-50" />
              <Link
                href={`/categories/${project.category.slug}`}
                className="transition-colors hover:text-brand"
              >
                {project.category.icon} {project.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={14} className="opacity-50" />
          <span className="truncate text-foreground">{project.name}</span>
        </nav>

        {/* 标题头 */}
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <ProjectLogo slug={project.slug} name={project.name} thumbnailUrl={project.thumbnail_url} size="lg" className="mt-1" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {project.name}
              </h1>
              <p className="mt-1.5 text-base text-muted">{project.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {formatDate(project.published_at)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={13} />
                  {project.view_count} 浏览
                </span>
              </div>
            </div>
          </div>
          <VoteButton projectId={project.id} initialVotes={project.vote_count} />
        </div>

        {project.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-muted" />
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {project.screenshots.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border">
            <img src={project.screenshots[0]} alt={project.name} className="w-full object-cover" />
          </div>
        )}

        {/* 项目介绍 */}
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-foreground">
            项目介绍
          </h2>
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
            {project.description}
          </div>
        </section>

        {/* 操作条 */}
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            访问项目
            <ExternalLink size={15} />
          </a>
          <p className="text-xs text-muted">
            链接失效？
            <Link href="/about" className="ml-1 text-brand hover:underline">联系我们</Link>
          </p>
        </div>

        {/* 相关项目 */}
        {relatedProjects.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">
              相关项目
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
