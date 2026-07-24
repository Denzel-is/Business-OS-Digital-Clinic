import { Braces, ChartNoAxesCombined, Route, Send, UsersRound } from "lucide-react";

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
          <div className="mt-10 flex flex-col gap-5 rounded-panel border border-accent/25 bg-accent/8 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                Создатель и технический партнёр
              </p>
              <p className="mt-2 text-2xl font-semibold text-ink">Danila Borodin</p>
              <p className="mt-1 text-sm text-ink-muted">
                От диагностики процесса до работающего full-stack продукта.
              </p>
            </div>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-accent bg-accent px-5 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
              href="https://t.me/dborrov"
              rel="noreferrer"
              target="_blank"
            >
              Написать @dborrov
              <Send aria-hidden="true" className="size-4" />
            </a>
          </div>
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
