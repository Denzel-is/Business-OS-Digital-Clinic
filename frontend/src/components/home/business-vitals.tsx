import { ScanLine } from "lucide-react";

import { BusinessVitalsStory } from "@/components/motion/business-vitals-story";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

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
          <BusinessVitalsStory />
          <p className="mt-6 text-xs leading-5 text-ink-faint">
            Прокрутка последовательно показывает переход. Значения демонстрационные и не подменяют
            измерения в реальном процессе.
          </p>
        </div>
      </Container>
    </section>
  );
}
