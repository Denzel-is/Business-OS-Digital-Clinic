import { ArrowDown, ArrowUpRight, Stethoscope } from "lucide-react";

import { HeroMedia } from "@/components/home/hero-media";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="editorial-grid border-b border-line py-16 sm:py-24 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6 xl:col-span-7">
          <Badge tone="stable">Digital clinic for business</Badge>
          <h1 className="text-balance mt-8 max-w-5xl text-[clamp(3.4rem,7.2vw,7.8rem)] font-semibold leading-[0.87] tracking-[-0.075em]">
            Диагностирую цифровые проблемы бизнеса
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-ink-muted sm:text-2xl">
            И превращаю их в быстрые, удобные и защищённые IT-системы — без лишней технологии ради
            технологии.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#health" icon={<Stethoscope aria-hidden="true" />}>
              Начать первичный осмотр
            </ButtonLink>
            <ButtonLink
              href="#treatment"
              icon={<ArrowDown aria-hidden="true" />}
              variant="secondary"
            >
              Посмотреть метод
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-6 border-t border-line pt-7 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">01</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">Процесс до интерфейса</p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">02</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">Безопасность до релиза</p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">03</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">Измерение после запуска</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 xl:col-span-5">
          <HeroMedia />
          <a
            className="mt-4 inline-flex items-center gap-2 text-xs text-ink-faint hover:text-ink"
            href="#symptoms"
          >
            Найти знакомый симптом
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
