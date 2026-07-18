import type { HTMLAttributes } from "react";

import { classNames } from "@/lib/styles/class-names";

type BadgeTone = "critical" | "neutral" | "stable" | "warning";

const toneStyles: Record<BadgeTone, string> = {
  critical: "border-danger/35 bg-danger/10 text-danger before:bg-danger",
  neutral: "border-line bg-surface-raised text-ink-muted before:bg-ink-faint",
  stable: "border-accent/30 bg-accent/10 text-accent before:bg-accent",
  warning: "border-warning/35 bg-warning/10 text-warning before:bg-warning",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ children, className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-7 items-center gap-2 rounded-full border px-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] before:size-1.5 before:rounded-full",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
