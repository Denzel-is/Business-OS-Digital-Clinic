import { Braces, ChartNoAxesCombined, Route, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

const capabilities = [
  { icon: Route, label: "Процессы", text: "Разбираю путь работы от события до результата." },
  { icon: UsersRound, label: "UX/UI", text: "Убираю трение для клиента и команды." },
  { icon: Braces, label: "Engineering", text: "Проектирую связанный frontend, backend и данные." },
  {
    icon: ChartNoAxesCombined,
    label: "Impact",
    text: "Связываю внедрение с наблюдаемыми сигналами.",
  },
] as const;

export function About() {
  return (
    <section className="border-b border-line bg-surface-inset py-24 sm:py-32" id="about">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Badge>08 / About the practice</Badge>
          <h2 className="text-balance mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
            Перевожу между бизнесом, интерфейсом и кодом
          </h2>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-ink-muted">
            Работаю как технический партнёр: задаю вопросы о процессе, проектирую решение, реализую
            систему и оставляю понятный контур дальнейшего развития.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article className="bg-canvas p-6" key={capability.label}>
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="size-4 text-accent" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                    {capability.label}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-muted">{capability.text}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
