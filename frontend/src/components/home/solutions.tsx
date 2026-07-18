import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";
import { Surface } from "@/components/ui/surface";
import { solutions } from "@/content/home";

export function Solutions() {
  return (
    <section className="border-b border-line py-24 sm:py-32" id="solutions">
      <Container>
        <SectionIntro
          description="Технология выбирается после диагноза. Иногда нужен новый продукт, иногда интеграция, автоматизация или точечное исправление существующей системы."
          eyebrow="05 / Solutions"
          title="Назначения под задачу, а не под модный стек"
        />
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {solutions.map((solution, index) => (
            <Surface
              className={`group min-h-72 p-7 transition-[transform,border-color,background-color] duration-500 ease-out hover:-translate-y-1 hover:border-accent/35 sm:p-9 ${index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"}`}
              data-motion-interactive
              key={solution.code}
              variant={index % 3 === 1 ? "outline" : "raised"}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs tracking-[0.14em] text-accent">
                  {solution.code}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 text-ink-faint transition-colors group-hover:text-accent"
                />
              </div>
              <h3 className="mt-20 text-3xl font-semibold tracking-[-0.045em]">{solution.title}</h3>
              <p className="mt-5 max-w-lg leading-7 text-ink-muted">{solution.description}</p>
            </Surface>
          ))}
        </div>
      </Container>
    </section>
  );
}
