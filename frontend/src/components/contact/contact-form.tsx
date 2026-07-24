"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { contactRequestSchema, type ContactRequest } from "@/lib/api/contracts";

interface ContactFormProps {
  turnstileSiteKey: string | undefined;
}

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ContactRequest>({
    defaultValues: {
      consent: false as true,
      email: "",
      message: "",
      name: "",
      turnstileToken: "",
      website: "",
    },
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token =
      event.currentTarget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
        ?.value ?? "";
    await handleSubmit(async (values) => {
      setResult("idle");
      setMessage("");
      const parsed = contactRequestSchema.safeParse({
        ...values,
        consent: values.consent === true,
        turnstileToken: token,
      });
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const field = issue.path[0];
          if (typeof field === "string" && field in values) {
            setError(field as keyof ContactRequest, { message: issue.message });
          }
        }
        return;
      }

      const response = await fetch("/api/contact", {
        body: JSON.stringify(parsed.data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }).catch(() => null);
      if (!response?.ok) {
        const body = response ? ((await response.json()) as { message?: string }) : null;
        setMessage(body?.message ?? "Не удалось отправить обращение.");
        setResult("error");
        return;
      }

      reset();
      setResult("success");
      setMessage("Обращение принято. Я свяжусь с вами после первичного разбора.");
    })(event);
  }

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          async
          defer
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form className="space-y-5" noValidate onSubmit={submit}>
        <TextField
          autoComplete="name"
          {...(errors.name?.message ? { error: errors.name.message } : {})}
          id="contact-name"
          label="Имя"
          {...register("name")}
        />
        <TextField
          autoComplete="email"
          {...(errors.email?.message ? { error: errors.email.message } : {})}
          id="contact-email"
          label="Email"
          type="email"
          {...register("email")}
        />
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="contact-message">
            Что нужно разобрать
          </label>
          <textarea
            className="min-h-40 w-full resize-y rounded-control border border-line bg-surface-inset px-4 py-3 text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-accent"
            id="contact-message"
            maxLength={2000}
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-2 text-xs text-danger">{errors.message.message}</p>
          ) : null}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <input autoComplete="off" id="contact-website" tabIndex={-1} {...register("website")} />
        </div>
        <label className="flex items-start gap-3 text-sm leading-6 text-ink-muted">
          <input className="mt-1 size-4 accent-accent" type="checkbox" {...register("consent")} />
          <span>
            Я согласен на обработку имени, email и текста обращения исключительно для ответа на этот
            запрос.
          </span>
        </label>
        {errors.consent ? (
          <p className="text-xs text-danger">Для отправки необходимо явное согласие.</p>
        ) : null}
        {turnstileSiteKey ? (
          <div className="cf-turnstile" data-action="contact" data-sitekey={turnstileSiteKey} />
        ) : (
          <p className="text-xs text-ink-faint">
            Turnstile отключён только для локальной разработки.
          </p>
        )}
        {message ? (
          <p
            aria-live="polite"
            className={
              result === "success"
                ? "rounded-control border border-accent/40 bg-accent/10 p-3 text-sm text-accent"
                : "rounded-control border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
            }
          >
            {message}
          </p>
        ) : null}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Отправляем…" : "Отправить обращение"}
        </Button>
      </form>
    </>
  );
}
