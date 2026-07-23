import type { Project } from "@/types";
import { APP_NAME, APP_URL } from "@/lib/constants";

export function ProjectJsonLd({ project }: { project: Project }) {
  const projectUrl = `${APP_URL}/projects/${project.slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: APP_URL },
      ...(project.category ? [
        { "@type": "ListItem", position: 2, name: project.category.name, item: `${APP_URL}/categories/${project.category.slug}` },
        { "@type": "ListItem", position: 3, name: project.name },
      ] : [
        { "@type": "ListItem", position: 2, name: project.name },
      ]),
    ],
  };

  const software: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.tagline,
    applicationCategory: project.category?.name || "Utilities",
    operatingSystem: "Web",
    url: projectUrl,
    datePublished: project.published_at,
  };

  // 项目截图
  if (project.thumbnail_url) {
    software.image = project.thumbnail_url;
  }

  // 投票数用 InteractionCounter，而非误导性的 AggregateRating
  if (project.vote_count > 0) {
    software.interactionStatistic = {
      "@type": "InteractionCounter",
      interactionType: { "@type": "LikeAction" },
      userInteractionCount: project.vote_count,
    };
  }

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }} />
    </>
  );
}

export function CategoryJsonLd({ name, slug }: { name: string; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} — AI项目`,
    description: `浏览${name}相关的AI创造项目`,
    url: `${APP_URL}/categories/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: APP_NAME,
      url: APP_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: APP_URL },
        { "@type": "ListItem", position: 2, name: name },
      ],
    },
  };

  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

/** 排行榜页结构化数据 */
export function RankingsJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "排行榜",
    description: "AI造物项目排行榜 — 发现最受欢迎的AI创造项目",
    url: `${APP_URL}/rankings`,
    isPartOf: {
      "@type": "WebSite",
      name: APP_NAME,
      url: APP_URL,
    },
  };

  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
