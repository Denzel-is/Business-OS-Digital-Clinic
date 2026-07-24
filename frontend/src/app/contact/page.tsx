import type { Metadata } from "next";
import { Send } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Связаться",
  description: "Безопасная форма первичного обращения без лишнего сбора данных.",
};

export default function ContactPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;

  return (
    <>
      <SiteHeader />
      <main className="editorial-grid py-16 sm:py-24" id="main-content">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <MotionReveal variant="wipe">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Danila Borodin / первичный контакт
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
                Опишите симптом, а не готовое решение
              </h1>
            </MotionReveal>
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              Нужны только имя, обратный адрес и контекст задачи. Не отправляйте пароли,
              персональные данные клиентов или конфиденциальные документы.
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-ink-muted">
              <li>До 2000 символов без файлов.</li>
              <li>Сохранение только после явного согласия.</li>
              <li>Honeypot, rate limit и Turnstile-ready проверка.</li>
            </ul>
            <div className="mt-8 rounded-panel border border-accent/25 bg-accent/8 p-5">
              <p className="font-semibold text-ink">Удобнее написать напрямую?</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Коротко опишите процесс и главную точку потерь — отвечу лично.
              </p>
              <a
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-4 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
                href="https://t.me/dborrov"
                rel="noreferrer"
                target="_blank"
              >
                <Send aria-hidden="true" className="size-4" />
                Telegram @dborrov
              </a>
            </div>
          </div>
          <Surface className="p-6 sm:p-8 lg:col-span-7">
            <ContactForm turnstileSiteKey={turnstileSiteKey} />
          </Surface>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
