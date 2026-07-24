import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Secure intake
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Опишите симптом, а не готовое решение
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              Нужны только имя, обратный адрес и контекст задачи. Не отправляйте пароли,
              персональные данные клиентов или конфиденциальные документы.
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-ink-muted">
              <li>До 2000 символов без файлов.</li>
              <li>Сохранение только после явного согласия.</li>
              <li>Honeypot, rate limit и Turnstile-ready проверка.</li>
            </ul>
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
