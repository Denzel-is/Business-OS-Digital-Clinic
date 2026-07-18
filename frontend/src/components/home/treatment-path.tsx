import { ArrowDownRight, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { treatmentSteps } from "@/content/home";

export function TreatmentPath() {
  return (
    <section className="border-b border-line bg-surface-inset py-24 sm:py-32" id="treatment">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Badge tone="stable">04 / How I Treat the Problem</Badge>
            <h2 className="text-balance mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Не начинаю с кода. Начинаю с процесса
            </h2>
          </div>
          <p className="max-w-md border-l border-line-strong pl-6 text-lg leading-8 text-ink-muted lg:col-span-4">
            Решение должно устранять причину цифрового трения, а не просто добавлять ещё один
            интерфейс.
          </p>
        </div>

        <ol className="mt-20 border-t border-line">
          {treatmentSteps.map((step) => (
            <li
              className="group grid gap-6 border-b border-line py-8 md:grid-cols-12 md:items-start"
              key={step.index}
            >
              <div className="flex items-center gap-3 md:col-span-2">
                <span className="font-mono text-xs text-accent">{step.index}</span>
                <Stethoscope aria-hidden="true" className="size-4 text-ink-faint" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint md:col-span-2">
                {step.label}
              </p>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] md:col-span-3">
                {step.title}
              </h3>
              <p className="max-w-xl leading-7 text-ink-muted md:col-span-4">{step.description}</p>
              <ArrowDownRight
                aria-hidden="true"
                className="hidden size-5 justify-self-end text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 md:block"
              />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
