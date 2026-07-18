import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Database,
  LockKeyhole,
  Server,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Metric } from "@/components/ui/metric";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { SectionIntro } from "@/components/ui/section-intro";
import { Surface } from "@/components/ui/surface";
import { TextField } from "@/components/ui/text-field";

export const metadata: Metadata = {
  title: "Design System",
  description: "Визуальные и интерфейсные основы Business OS: Digital Clinic.",
};

const colorTokens = [
  { name: "Canvas", token: "--ds-color-canvas", value: "#060B0A", width: "lg:col-span-5" },
  { name: "Surface", token: "--ds-color-surface", value: "#0B1210", width: "lg:col-span-3" },
  {
    name: "Surface raised",
    token: "--ds-color-surface-raised",
    value: "#111B18",
    width: "lg:col-span-4",
  },
  { name: "Ink", token: "--ds-color-ink", value: "#F0F0E8", width: "lg:col-span-4" },
  { name: "Clinic accent", token: "--ds-color-accent", value: "#67E8C2", width: "lg:col-span-6" },
  { name: "Critical", token: "--ds-color-danger", value: "#FF746C", width: "lg:col-span-2" },
];

export default function DesignSystemPage() {
  return (
    <main className="bg-canvas text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"
            href="/"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Business OS
          </Link>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
            DS / v0.1
          </span>
        </Container>
      </header>

      <section className="editorial-grid border-b border-line py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Badge tone="stable">Operational interface system</Badge>
            <h1
              aria-label="Клиническая точность UI"
              className="text-balance mt-8 text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.075em]"
            >
              Клиническая
              <br />
              точность UI
            </h1>
          </div>
          <div className="border-l border-line-strong pl-6 lg:col-span-4 lg:mb-3">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              Principle 01
            </p>
            <p className="mt-4 max-w-sm text-lg leading-8 text-ink-muted">
              Сначала диагноз и иерархия. Затем визуальный акцент. Декор никогда не конкурирует с
              решением задачи.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="color-title" className="border-b border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            description="Глубокий графит формирует рабочую среду, молочный текст сохраняет мягкий контраст, а холодный зелёный отмечает действия и стабильные состояния. Красный зарезервирован для реального риска."
            eyebrow="01 / Color system"
            id="color-title"
            title="Цвет сообщает состояние, а не украшает экран"
          />
          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {colorTokens.map((color) => (
              <Surface
                className={`min-h-44 p-5 ${color.width}`}
                key={color.token}
                variant="outline"
              >
                <div
                  aria-hidden="true"
                  className="h-16 rounded-control border border-white/10"
                  style={{ backgroundColor: `var(${color.token})` }}
                />
                <p className="mt-5 text-sm font-semibold">{color.name}</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
                  {color.value}
                </p>
              </Surface>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-24 sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro
              description="Manrope отвечает за ясную кириллическую иерархию. IBM Plex Mono маркирует системные значения, версии и статусы."
              eyebrow="02 / Typography"
              title="Редакционный масштаб и инженерный ритм"
            />
          </div>
          <div className="space-y-12 lg:col-span-7 lg:pt-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Display / 88
              </p>
              <p className="mt-4 text-6xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-8xl">
                Диагноз
                <br />
                до кода
              </p>
            </div>
            <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.035em]">Заголовок модуля</p>
                <p className="mt-3 leading-7 text-ink-muted">
                  Короткий, конкретный и связанный с бизнес-задачей.
                </p>
              </div>
              <div className="font-mono text-xs uppercase leading-6 tracking-[0.14em] text-ink-faint">
                STATUS / STABLE
                <br />
                RESPONSE / 142 MS
                <br />
                REVISION / 05
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            description="Контролы используют явные состояния, видимый focus и минимум декоративных эффектов. Иконки дополняют текст, но не заменяют доступные названия."
            eyebrow="03 / Controls"
            title="Действия читаются до взаимодействия"
          />
          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            <Surface className="p-6 sm:p-8 lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                Buttons
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button icon={<ArrowUpRight aria-hidden="true" />}>Начать диагностику</Button>
                <Button variant="secondary">Изучить подход</Button>
                <Button variant="ghost">Подробнее</Button>
                <Button disabled>Недоступно</Button>
              </div>
              <div className="mt-10 border-t border-line pt-8">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                  Statuses
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Badge tone="stable">Stable</Badge>
                  <Badge>Monitoring</Badge>
                  <Badge tone="warning">Attention</Badge>
                  <Badge tone="critical">Critical</Badge>
                </div>
              </div>
            </Surface>
            <Surface className="p-6 sm:p-8 lg:col-span-5" variant="inset">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                Field anatomy
              </p>
              <div className="mt-8 space-y-7">
                <TextField
                  hint="Не публикуется и используется только для ответа."
                  id="design-email"
                  label="Рабочий email"
                  placeholder="name@company.ru"
                  type="email"
                />
                <TextField
                  error="Опишите симптом конкретнее."
                  id="design-symptom"
                  label="Цифровой симптом"
                  placeholder="Например, заявки теряются"
                />
              </div>
            </Surface>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionIntro
            description="Операционные поверхности различаются композицией и плотностью, а не копируют одну карточку. Значения здесь демонстрационные и не описывают реальный бизнес."
            eyebrow="04 / Operational surfaces"
            title="Интерфейс показывает здоровье системы"
          />
          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            <Surface className="p-7 sm:p-10 lg:col-span-8">
              <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge tone="stable">Demo telemetry</Badge>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Business health
                  </h3>
                </div>
                <span className="font-mono text-6xl font-medium tracking-[-0.08em] text-accent">
                  82
                </span>
              </div>
              <div className="mt-9">
                <ProgressMeter label="Операционная устойчивость" value={82} />
              </div>
              <div className="mt-10 grid gap-9 sm:grid-cols-3">
                <Metric
                  detail="Публичный API отвечает"
                  icon={<Server />}
                  label="API"
                  value="142ms"
                />
                <Metric detail="Данные доступны" icon={<Database />} label="Data" value="99.9%" />
                <Metric
                  detail="Политики активны"
                  icon={<LockKeyhole />}
                  label="Policy"
                  value="12/12"
                />
              </div>
            </Surface>

            <div className="space-y-5 lg:col-span-4">
              <Surface className="p-7" variant="outline">
                <div className="flex items-center justify-between gap-4">
                  <ShieldCheck aria-hidden="true" className="size-6 text-accent" />
                  <Badge tone="stable">Protected</Badge>
                </div>
                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em]">Security pulse</h3>
                <p className="mt-3 leading-7 text-ink-muted">
                  Многослойная защита снижает риск, но не обещает абсолютную безопасность.
                </p>
              </Surface>
              <Surface className="border-danger/35 p-7" variant="inset">
                <TriangleAlert aria-hidden="true" className="size-6 text-danger" />
                <h3 className="mt-8 text-xl font-semibold">Критическое состояние</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Красный появляется только там, где требуется немедленное внимание.
                </p>
              </Surface>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <Activity aria-hidden="true" className="size-4 text-accent" />
              <span>Токены и компоненты готовы для этапа главной страницы.</span>
            </div>
            <ButtonLink href="/" icon={<ArrowUpRight aria-hidden="true" />} variant="secondary">
              Вернуться к системе
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
