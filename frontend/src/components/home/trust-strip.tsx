import { Braces, Route, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";

const signals = [
  { icon: Route, label: "Разбор бизнес-процесса" },
  { icon: Sparkles, label: "UX без лишнего трения" },
  { icon: Braces, label: "Frontend + backend + данные" },
  { icon: ShieldCheck, label: "Безопасность по архитектуре" },
] as const;

export function TrustStrip() {
  return (
    <section aria-label="Ключевые компетенции" className="border-b border-line bg-surface-inset">
      <Container>
        <ul className="grid grid-cols-2 xl:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <li
                className={`flex min-h-24 items-center gap-3 border-line p-4 sm:min-h-20 sm:px-5 ${index < 2 ? "border-b" : ""} ${index % 2 === 0 ? "border-r" : ""} xl:min-h-0 xl:border-b-0 xl:border-r xl:last:border-r-0`}
                key={signal.label}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
                <span className="text-sm font-medium text-ink-muted">{signal.label}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
