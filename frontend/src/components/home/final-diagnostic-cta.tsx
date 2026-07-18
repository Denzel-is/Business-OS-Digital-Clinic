import { ArrowUp, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { diagnosticPrompts } from "@/content/home";

export function FinalDiagnosticCta() {
  return (
    <section className="editorial-grid py-24 sm:py-36" id="diagnostic-cta">
      <Container>
        <div className="rounded-panel border border-accent/30 bg-surface-raised p-7 sm:p-12 lg:p-16">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Badge tone="stable">09 / Final Diagnostic CTA</Badge>
              <h2 className="text-balance mt-7 text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                Начните не с решения. Начните с симптома
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted">
                Подготовьте три ответа — они помогут сделать первый разговор предметным. Контакты не
                запрашиваются и ничего не сохраняется.
              </p>
            </div>
            <ol className="space-y-4 lg:col-span-4">
              {diagnosticPrompts.map((prompt, index) => (
                <li
                  className="grid grid-cols-[2rem_1fr] gap-3 border-t border-line pt-4"
                  key={prompt}
                >
                  <span className="font-mono text-xs text-accent">0{index + 1}</span>
                  <span className="text-sm leading-6 text-ink-muted">{prompt}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <ClipboardList aria-hidden="true" className="size-5 text-accent" />
              Интерактивная анкета будет подключена в модуле Business Diagnostic.
            </div>
            <ButtonLink href="#health" icon={<ArrowUp aria-hidden="true" />} variant="secondary">
              Вернуться к индикатору
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
