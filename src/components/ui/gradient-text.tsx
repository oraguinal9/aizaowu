import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function GradientText({
  children,
  accent,
  className,
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span className={cn(accent ? "text-gradient-accent" : "text-gradient", className)}>
      {children}
    </span>
  );
}
