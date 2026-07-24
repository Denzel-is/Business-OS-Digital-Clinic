import { Check, Radar, ShieldCheck } from "lucide-react";

import { SecurityDefenseVisual } from "@/components/motion/security-defense-visual";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";
import { securityLayers } from "@/content/home";

export function SecurityPulse() {
  return (
    <section className="border-b border-line py-24 sm:py-32" id="security">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <Badge tone="stable">07 / Security Pulse</Badge>
          <h2 className="text-balance mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
            Безопасность — система слоёв
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ink-muted">
            Код снижает риск, но не останавливает все угрозы сам по себе. Нужны серверные контроли,
            наблюдаемость, резервирование и защита на edge-уровне.
          </p>
          <Surface className="mt-10 border-accent/30 p-6" variant="inset">
            <div className="flex items-start gap-4">
              <ShieldCheck aria-hidden="true" className="mt-1 size-6 shrink-0 text-accent" />
              <div>
                <p className="font-semibold">Без абсолютных обещаний</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Публичный контент невозможно полностью защитить от копирования, а DDoS требует
                  CDN, WAF, rate limiting и защиты origin.
                </p>
              </div>
            </div>
          </Surface>
          <ButtonLink className="mt-6" href="/security" variant="secondary">
            Открыть Security Center
          </ButtonLink>
        </div>

        <Surface className="overflow-hidden lg:col-span-7">
          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Defense model
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Layered controls</h3>
              </div>
              <Radar aria-hidden="true" className="size-7 text-accent" />
            </div>
          </div>
          <SecurityDefenseVisual />
          <div className="p-7 sm:p-10">
            <ul>
              {securityLayers.map((layer, index) => (
                <li
                  className="flex items-center gap-4 border-b border-line py-5 last:border-b-0"
                  key={layer}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10">
                    <Check aria-hidden="true" className="size-3.5 text-accent" />
                  </span>
                  <span className="flex-1 text-sm font-medium sm:text-base">{layer}</span>
                  <span className="font-mono text-[0.62rem] text-ink-faint">0{index + 1}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-5 text-ink-faint">
              Реализованные контроли подтверждаются кодом и тестами. Инфраструктурные меры
              подключаются отдельно для конкретной production-среды.
            </p>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
