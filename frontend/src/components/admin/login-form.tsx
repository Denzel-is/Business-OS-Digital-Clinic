"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => null);

    if (!response?.ok) {
      const body = response ? ((await response.json()) as { message?: string }) : null;
      setMessage(body?.message ?? "Сервис входа временно недоступен.");
      setPending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="space-y-5" noValidate onSubmit={submit}>
      <TextField
        autoComplete="username"
        id="email"
        label="Email"
        name="email"
        placeholder="admin@example.com"
        required
        type="email"
      />
      <TextField
        autoComplete="current-password"
        id="password"
        label="Пароль"
        name="password"
        required
        type="password"
      />
      {message ? (
        <p
          aria-live="polite"
          className="rounded-control border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
        >
          {message}
        </p>
      ) : null}
      <Button
        className="w-full"
        disabled={pending}
        icon={<LockKeyhole aria-hidden />}
        type="submit"
      >
        {pending ? "Проверяем…" : "Войти в панель"}
      </Button>
    </form>
  );
}
