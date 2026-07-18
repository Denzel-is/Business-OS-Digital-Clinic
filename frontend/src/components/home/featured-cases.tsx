import { ArrowUpRight, Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { featuredCases } from "@/content/home";

export function FeaturedCases() {
  return (
    <section className="border-b border-line bg-surface-inset py-24 sm:py-32" id="cases">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <Badge>06 / Featured Cases</Badge>
            <h2 className="text-balance mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Показываю ход решения, не вымышленные победы
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink-muted">
            Ниже — честно обозначенные демонстрационные материалы без реальных клиентов, отзывов и
            финансовых результатов.
          </p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          {featuredCases.map((caseItem, index) => (
            <article
              className={`flex min-h-[30rem] flex-col rounded-panel border border-line p-7 transition-[transform,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-accent/35 sm:p-9 ${index === 0 ? "bg-surface-raised lg:col-span-7" : "bg-canvas lg:col-span-5"}`}
              data-motion-interactive
              key={caseItem.title}
            >
              <div className="flex items-start justify-between gap-5">
                <Badge tone="neutral">{caseItem.label}</Badge>
                <Layers3 aria-hidden="true" className="size-5 text-accent" />
              </div>
              <div className="mt-auto pt-20">
                <div className="flex flex-wrap gap-2">
                  {caseItem.categories.map((category) => (
                    <span
                      className="rounded-full border border-line px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint"
                      key={category}
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h3 className="mt-6 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  {caseItem.title}
                </h3>
                <p className="mt-5 max-w-xl leading-7 text-ink-muted">{caseItem.description}</p>
                <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-faint">
                  Подробный кейс готовится на профильном этапе
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
