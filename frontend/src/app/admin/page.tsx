import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Surface } from "@/components/ui/surface";
import { getAdminOverview } from "@/lib/api/backend-session";
import { requireAdminSession } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Панель управления",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const overview = await getAdminOverview();

  return (
    <AdminShell session={session}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Stage 12 · RBAC</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Операционный обзор
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-ink-muted">
        Данные читаются из PostgreSQL через защищённый backend. Права проверяются на каждом запросе,
        а не только в интерфейсе.
      </p>
      <section
        aria-label="Разделы панели"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {overview.modules.map((module) => (
          <Link href={`/admin/${module.slug}`} key={module.slug}>
            <Surface className="h-full p-5 transition-colors hover:border-accent/50">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-semibold text-ink">{module.label}</h2>
                <span className="rounded-full border border-line px-2 py-1 font-mono text-[0.65rem] text-ink-faint">
                  {module.scope}
                </span>
              </div>
              <p className="mt-6 text-3xl font-semibold text-accent">{module.itemCount}</p>
              <p className="mt-1 text-xs text-ink-muted">записей в базе</p>
            </Surface>
          </Link>
        ))}
      </section>
    </AdminShell>
  );
}
