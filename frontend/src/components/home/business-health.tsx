import { ClipboardCheck, Gauge, SearchCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";
import { Surface } from "@/components/ui/surface";

const healthQuestions = [
  "Где заявка ждёт человека дольше всего?",
  "Какая операция повторяется каждый день?",
  "Как команда замечает ошибку до клиента?",
] as const;

export function BusinessHealth() {
  return (
    <section className="border-b border-line py-24 sm:py-32" id="health">
      <Container>
        <MotionReveal variant="rise">
          <SectionIntro
            description="Здоровье цифровой системы нельзя честно определить без данных. Поэтому индикатор начинается не с красивой цифры, а с вопросов о процессе, пользователях и рисках."
            eyebrow="01 / Business Health Indicator"
            id="health-title"
            title="Сначала измеряем. Потом назначаем решение"
          />
        </MotionReveal>
        <MotionReveal className="mt-16" delay={0.08} variant="wipe">
          <Surface className="overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-line p-7 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-4">
                  <Badge tone="warning">Assessment required</Badge>
                  <Gauge aria-hidden="true" className="size-6 text-warning" />
                </div>
                <p className="mt-16 font-mono text-[clamp(5rem,13vw,9rem)] font-medium leading-none tracking-[-0.09em] text-ink">
                  —
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  Business Health Score
                </p>
                <p className="mt-3 max-w-md leading-7 text-ink-muted">
                  Не измерено. Демонстрационная оценка не подменяет полноценный аудит.
                </p>
              </div>
              <div className="p-7 sm:p-10 lg:col-span-7">
                <div className="flex items-center gap-3">
                  <SearchCheck aria-hidden="true" className="size-5 text-accent" />
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                    Primary examination
                  </p>
                </div>
                <ol className="mt-8 space-y-4">
                  {healthQuestions.map((question, index) => (
                    <li
                      className="grid grid-cols-[2rem_1fr] gap-3 border-t border-line pt-4"
                      key={question}
                    >
                      <span className="font-mono text-xs text-ink-faint">0{index + 1}</span>
                      <span className="text-base leading-7 text-ink-muted">{question}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <ButtonLink href="/diagnostic" icon={<ClipboardCheck aria-hidden="true" />}>
                    Пройти диагностику
                  </ButtonLink>
                  <p className="max-w-xs text-xs leading-5 text-ink-faint">
                    Расчёт выполняется сервером. Ответы и контакты не сохраняются.
                  </p>
                </div>
              </div>
            </div>
          </Surface>
        </MotionReveal>
      </Container>
    </section>
  );
}
