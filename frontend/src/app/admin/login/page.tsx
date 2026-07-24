import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Вход в панель",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main
      className="editorial-grid grid min-h-screen place-items-center px-5 py-12"
      id="main-content"
    >
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <Surface className="w-full max-w-md p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Защищённая зона</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Панель управления</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Доступ разрешён только администраторам и редакторам с активной учётной записью.
        </p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <Link className="mt-6 inline-block text-sm text-ink-muted hover:text-accent" href="/">
          ← Вернуться на сайт
        </Link>
      </Surface>
    </main>
  );
}
