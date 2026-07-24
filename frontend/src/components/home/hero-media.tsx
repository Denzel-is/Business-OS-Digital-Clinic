import { ArrowRight, CheckCircle2, Route, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const processSteps = [
  { detail: "Фиксируем потери", label: "Симптом" },
  { detail: "Находим причину", label: "Диагностика" },
  { detail: "Собираем маршрут", label: "Решение" },
] as const;

export function HeroMedia() {
  return (
    <figure
      aria-label="Схема перехода от бизнес-проблемы к работающей цифровой системе"
      className="relative min-h-[30rem] overflow-hidden rounded-panel border border-line bg-surface lg:min-h-[42rem]"
    >
      <div className="editorial-grid absolute inset-0 opacity-70" />
      <div className="ambient-drift absolute -right-24 top-20 size-72 rounded-full bg-accent/12 blur-3xl" />
      <div className="ambient-drift absolute -bottom-24 -left-20 size-64 rounded-full bg-accent/8 blur-3xl [animation-delay:-4s]" />

      <div className="relative flex items-center justify-between gap-4 border-b border-line p-5">
        <Badge tone="stable">Process map / live</Badge>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
          symptom → system
        </span>
      </div>

      <div className="relative flex min-h-[24rem] flex-col justify-center p-6 sm:p-8 lg:min-h-[34rem]">
        <div className="mb-10 flex items-center gap-3 text-accent">
          <Route aria-hidden="true" className="size-5" />
          <span className="font-mono text-xs uppercase tracking-[0.16em]">
            Карта цифрового процесса
          </span>
        </div>

        <ol className="grid gap-4">
          {processSteps.map((step, index) => (
            <li
              className="interactive-card relative rounded-panel border border-line bg-canvas/85 p-5 backdrop-blur-sm"
              key={step.label}
            >
              <div className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent/10 font-mono text-xs text-accent">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{step.label}</p>
                  <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
                </div>
                {index < processSteps.length - 1 ? (
                  <ArrowRight aria-hidden="true" className="ml-auto size-4 text-accent" />
                ) : (
                  <CheckCircle2 aria-hidden="true" className="ml-auto size-5 text-accent" />
                )}
              </div>
              {index < processSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="process-flow-line absolute -bottom-3 left-10 h-6 w-px bg-accent"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="relative mx-5 mb-5 rounded-control border border-accent/25 bg-canvas/90 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-ink">Решение начинается с понятной причины</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Без навязывания лишнего стека: только маршрут, который можно проверить и развивать.
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
