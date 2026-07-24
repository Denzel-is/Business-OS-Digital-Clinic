import type { Metadata } from "next";
import { ClipboardCheck, DatabaseZap, ShieldCheck } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { DiagnosticWizard } from "@/features/diagnostic/diagnostic-wizard";

export const metadata: Metadata = {
  description:
    "Пошаговая предварительная диагностика цифровых процессов без сохранения контактных данных.",
  title: "Business Diagnostic",
};

const guarantees = [
  { icon: ClipboardCheck, label: "12 понятных шагов" },
  { icon: DatabaseZap, label: "Без сохранения ответов" },
  { icon: ShieldCheck, label: "Предварительно, не аудит" },
] as const;

export default function DiagnosticPage() {
  return (
    <>
      <SiteHeader />
      <main className="editorial-grid min-h-screen" id="main-content">
        <section className="border-b border-line py-16 sm:py-24">
          <Container>
            <MotionReveal variant="wipe">
              <Badge tone="stable">Business Diagnostic / 5–7 минут</Badge>
              <h1 className="text-balance mt-7 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                Найдите цифровое трение до выбора решения
              </h1>
            </MotionReveal>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-ink-muted sm:text-xl">
              Ответьте на вопросы о процессе, системах и рисках. За несколько минут вы получите
              предварительный Business Health Score и поймёте, какие сигналы стоит проверить
              первыми.
            </p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {guarantees.map((guarantee) => {
                const Icon = guarantee.icon;
                return (
                  <li
                    className="flex items-center gap-3 border-t border-line pt-4 text-sm text-ink-muted"
                    key={guarantee.label}
                  >
                    <Icon aria-hidden="true" className="size-4 text-accent" />
                    {guarantee.label}
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
        <section className="bg-surface-inset py-16 sm:py-24" id="diagnostic-form">
          <Container>
            <DiagnosticWizard />
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
