import type { HTMLAttributes } from "react";

import { classNames } from "@/lib/styles/class-names";

type SurfaceVariant = "inset" | "outline" | "raised";

const variantStyles: Record<SurfaceVariant, string> = {
  inset: "border-line bg-surface-inset",
  outline: "border-line-strong bg-transparent",
  raised: "border-line bg-surface-raised",
};

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
}

export function Surface({ className, variant = "raised", ...props }: SurfaceProps) {
  return (
    <div
      className={classNames("rounded-panel border", variantStyles[variant], className)}
      {...props}
    />
  );
}
