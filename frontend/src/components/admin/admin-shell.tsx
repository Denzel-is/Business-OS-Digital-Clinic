import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/admin/logout-button";
import type { AdminResourceSlug, AuthSession } from "@/lib/api/contracts";
import { classNames } from "@/lib/styles/class-names";

const navigation: Array<{
  label: string;
  slug: AdminResourceSlug;
  system?: boolean;
}> = [
  { label: "Проекты", slug: "projects" },
  { label: "Категории", slug: "categories" },
  { label: "Медиа", slug: "media" },
  { label: "Услуги", slug: "services" },
  { label: "Лиды", slug: "leads" },
  { label: "Диагностика", slug: "diagnostics" },
  { label: "SEO", slug: "seo" },
  { label: "Пользователи", slug: "users", system: true },
  { label: "Журнал аудита", slug: "audit-logs", system: true },
  { label: "Настройки", slug: "settings", system: true },
];

interface AdminShellProps {
  active?: AdminResourceSlug;
  children: ReactNode;
  session: AuthSession;
}

export function AdminShell({ active, children, session }: AdminShellProps) {
  const isAdministrator = session.roles.includes("ADMIN");

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-surface px-5 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link className="block" href="/admin">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Business OS
          </span>
          <strong className="mt-2 block text-lg text-ink">Control room</strong>
        </Link>
        <nav
          aria-label="Разделы администрирования"
          className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
        >
          {navigation
            .filter((item) => !item.system || isAdministrator)
            .map((item) => (
              <Link
                aria-current={active === item.slug ? "page" : undefined}
                className={classNames(
                  "rounded-control border px-3 py-2.5 text-sm transition-colors",
                  active === item.slug
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-transparent text-ink-muted hover:border-line hover:bg-white/5 hover:text-ink",
                )}
                href={`/admin/${item.slug}`}
                key={item.slug}
              >
                {item.label}
              </Link>
            ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-ink">{session.displayName}</p>
            <p className="font-mono text-xs text-ink-faint">{session.roles.join(" · ")}</p>
          </div>
          <LogoutButton />
        </header>
        <main className="px-5 py-8 sm:px-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
