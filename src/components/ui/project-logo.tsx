import { cn } from "@/lib/cn";

// 确定性渐变色板：按 slug 哈希取一组，保证同一项目永远同色
const LOGO_GRADIENTS = [
  "linear-gradient(135deg, #5e6ad2, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f472b6, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #6366f1, #ec4899)",
  "linear-gradient(135deg, #22d3ee, #5e6ad2)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** 项目小 logo 方块：有缩略图显示图片，无图时按 slug 确定性渐变 */
export function ProjectLogo({
  slug,
  name,
  thumbnailUrl,
  size = "md",
  className,
}: {
  slug: string;
  name?: string;
  thumbnailUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border border-border",
        sizes[size],
        className
      )}
    >
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={name ?? slug} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div
          aria-hidden
          className="h-full w-full"
          style={{ background: LOGO_GRADIENTS[hashSlug(slug) % LOGO_GRADIENTS.length] }}
        />
      )}
    </div>
  );
}
