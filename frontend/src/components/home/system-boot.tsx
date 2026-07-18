import { Check, CircleDashed } from "lucide-react";

import { Container } from "@/components/ui/container";

const bootSignals = [
  { label: "Interface", state: "online", stable: true },
  { label: "Security baseline", state: "active", stable: true },
  { label: "Interactive diagnostic", state: "preparing", stable: false },
] as const;

export function SystemBoot() {
  return (
    <section aria-label="Статус цифровой клиники" className="border-b border-line bg-surface-inset">
      <Container className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
          System boot / Business OS Digital Clinic
        </p>
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-3">
          {bootSignals.map((signal) => (
            <li
              className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.12em]"
              key={signal.label}
            >
              {signal.stable ? (
                <Check aria-hidden="true" className="size-3.5 text-accent" />
              ) : (
                <CircleDashed aria-hidden="true" className="size-3.5 text-warning" />
              )}
              <span className="text-ink-faint">{signal.label}</span>
              <span className={signal.stable ? "text-accent" : "text-warning"}>{signal.state}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
