import type { ReactNode } from "react";

interface MetricProps {
  detail: string;
  icon: ReactNode;
  label: string;
  value: string;
}

export function Metric({ detail, icon, label, value }: MetricProps) {
  return (
    <article className="border-l border-line-strong pl-5">
      <div className="flex items-center gap-2 text-ink-muted [&_svg]:size-4">
        <span aria-hidden="true">{icon}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{detail}</p>
    </article>
  );
}
