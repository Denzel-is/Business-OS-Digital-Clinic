import { ArrowRight, ScanLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { businessVitals } from "@/content/home";

export function BusinessVitals() {
  return (
    <section className="border-b border-line bg-surface-inset py-24 sm:py-32" id="vitals">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <Badge>02 / Sticky Business Vitals</Badge>
          <h2 className="text-balance mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
            От проблемного сигнала к управляемому процессу
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-ink-muted">
            Это не обещание результата, а карта возможного перехода после диагностики и
            проектирования.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-control border border-accent/25 bg-accent/10 px-4 py-3 text-xs text-accent">
            <ScanLine aria-hidden="true" className="size-4" />
            Демонстрационная симуляция
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 border-b border-line pb-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
            <span>Before</span>
            <span aria-hidden="true">/</span>
            <span>Target state</span>
          </div>
          <ol>
            {businessVitals.map((vital, index) => (
              <li
                className="grid gap-5 border-b border-line py-7 sm:grid-cols-[2.3rem_1fr_auto_1fr] sm:items-center"
                key={vital.label}
              >
                <span className="font-mono text-xs text-ink-faint">0{index + 1}</span>
                <div>
                  <p className="text-sm text-ink-faint">{vital.label}</p>
                  <p className="mt-2 font-medium text-ink-muted">{vital.before}</p>
                </div>
                <ArrowRight aria-hidden="true" className="hidden size-4 text-accent sm:block" />
                <div className="border-l border-accent/35 pl-4">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent sm:hidden">
                    Target state
                  </p>
                  <p className="mt-2 font-semibold text-ink sm:mt-0">{vital.after}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-5 text-ink-faint">
            На motion-этапе переход будет показан последовательно при прокрутке. Значения останутся
            явно демонстрационными.
          </p>
        </div>
      </Container>
    </section>
  );
}
