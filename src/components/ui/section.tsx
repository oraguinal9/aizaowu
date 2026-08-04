import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  action,
  children,
  className,
}: {
  eyebrow?: string;
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-14", className)}>
      {(eyebrow || title || action) && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-brand">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {title}
              </h2>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
