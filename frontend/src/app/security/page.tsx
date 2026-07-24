import type { Metadata } from "next";
import { ArrowRight, Layers3, ShieldCheck } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";
import {
  securityControls,
  securityRealityChecks,
  type SecurityControlStatus,
} from "@/content/security";
import { InputValidationLab } from "@/features/security/input-validation-lab";

export const metadata: Metadata = {
  description: "Честная карта реализованных, подготовленных и запланированных слоёв безопасности.",
  title: "Security Center",
};

const statusLabels: Record<SecurityControlStatus, string> = {
  Foundation: "Основа",
  Implemented: "Реализовано",
  Planned: "Запланировано",
};

const statusTones: Record<SecurityControlStatus, "neutral" | "stable" | "warning"> = {
  Foundation: "warning",
  Implemented: "stable",
  Planned: "neutral",
};

export default function SecurityPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="editorial-grid border-b border-line py-16 sm:py-24">
          <Container>
            <MotionReveal variant="wipe">
              <Badge tone="stable">Security Center / проверяемые контроли</Badge>
              <h1 className="text-balance mt-7 max-w-6xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                Безопасность без магии и абсолютных обещаний
              </h1>
            </MotionReveal>
            <div className="mt-9 grid gap-8 lg:grid-cols-12">
              <p className="max-w-3xl text-lg leading-8 text-ink-muted lg:col-span-8">
                Здесь видно, что уже подтверждено кодом и тестами, где существует только основа и
                что ещё предстоит внедрить. Статусы описывают текущую систему, а не идеальную
                картину без рисков.
              </p>
              <div className="flex items-start gap-4 border-l border-accent/35 pl-5 lg:col-span-4">
                <ShieldCheck aria-hidden="true" className="mt-1 size-6 shrink-0 text-accent" />
                <p className="text-sm leading-6 text-ink-muted">
                  Защита снижает вероятность и влияние инцидента, но не превращает систему в
                  неуязвимую.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-line py-16 sm:py-24" aria-labelledby="control-map">
          <Container>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Control map · {securityControls.length}
                </p>
                <h2
                  className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl"
                  id="control-map"
                >
                  Карта защитных контролей
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-ink-muted">
                Реализовано — подтверждено текущим кодом. Основа — есть часть контура. Запланировано
                — контроль ещё нельзя считать работающим.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {securityControls.map((control) => (
                <Surface
                  className="flex min-h-80 flex-col p-6"
                  data-security-control
                  key={control.code}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-ink-faint">{control.code}</span>
                    <Badge tone={statusTones[control.status]}>{statusLabels[control.status]}</Badge>
                  </div>
                  <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
                    {control.group}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                    {control.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink-muted">{control.summary}</p>
                  <div className="mt-auto border-t border-line pt-5">
                    <p className="text-xs leading-5 text-ink">{control.evidence}</p>
                    <p className="mt-3 text-xs leading-5 text-ink-faint">
                      Дальше: {control.nextStep}
                    </p>
                  </div>
                </Surface>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-surface-inset py-16 sm:py-24" aria-labelledby="validation-lab">
          <Container>
            <Badge tone="warning">Safe educational simulation</Badge>
            <h2
              className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl"
              id="validation-lab"
            >
              Как работает валидация ввода
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-muted">
              Выберите назначение поля и отправьте текст серверу. Симуляция применит ограничение
              длины, проверку управляющих символов и контекстное правило, а интерфейс покажет
              результат как текст.
            </p>
            <div className="mt-10">
              <InputValidationLab />
            </div>
          </Container>
        </section>

        <section className="border-y border-line py-16 sm:py-24" aria-labelledby="reality-check">
          <Container>
            <div className="flex items-center gap-4">
              <Layers3 aria-hidden="true" className="size-7 text-accent" />
              <h2
                className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl"
                id="reality-check"
              >
                Границы защиты
              </h2>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2">
              {securityRealityChecks.map((item, index) => (
                <article className="bg-surface-raised p-7 sm:p-9" key={item.title}>
                  <span className="font-mono text-xs text-accent">0{index + 1}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-ink-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-24">
          <Container>
            <Surface className="flex flex-col justify-between gap-8 p-8 sm:p-12 lg:flex-row lg:items-end">
              <div>
                <Badge tone="stable">Next signal</Badge>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                  Сначала диагностировать процесс, затем усиливать рискованные точки
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/diagnostic" icon={<ArrowRight aria-hidden="true" />}>
                  Начать диагностику
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Обсудить защищённое решение
                </ButtonLink>
              </div>
            </Surface>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
