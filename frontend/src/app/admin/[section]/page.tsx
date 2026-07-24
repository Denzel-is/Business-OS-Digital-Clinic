import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Surface } from "@/components/ui/surface";
import { canAccessAdminResource } from "@/lib/admin/access";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { adminResourceSlugSchema, type AdminResourceSlug } from "@/lib/api/contracts";
import { getAdminResource } from "@/lib/api/backend-session";

export const metadata: Metadata = {
  title: "Раздел панели",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminSectionPageProps {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminSectionPage({ params, searchParams }: AdminSectionPageProps) {
  const { section } = await params;
  const parsedResource = adminResourceSlugSchema.safeParse(section);
  if (!parsedResource.success) {
    notFound();
  }

  const session = await requireAdminSession();
  const resource: AdminResourceSlug = parsedResource.data;
  if (!canAccessAdminResource(session, resource)) {
    notFound();
  }

  const query = await searchParams;
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage - 1 : 0;
  const result = await getAdminResource(resource, page);

  return (
    <AdminShell active={resource} session={session}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{result.resource}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {result.label}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">{result.totalItems} записей</p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-faint">
          read-only foundation
        </span>
      </div>

      <Surface className="mt-8 overflow-hidden">
        {result.items.length ? (
          <div className="divide-y divide-line">
            {result.items.map((item) => (
              <article
                className="grid gap-2 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                key={item.id}
              >
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-ink">{item.title}</h2>
                  <p className="mt-1 truncate text-sm text-ink-muted">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="rounded-full border border-line px-2 py-1 font-mono text-[0.65rem] text-accent">
                    {item.status}
                  </span>
                  <time className="text-xs text-ink-faint" dateTime={item.createdAt}>
                    {new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
                      new Date(item.createdAt),
                    )}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="font-semibold text-ink">Записей пока нет</p>
            <p className="mt-2 text-sm text-ink-muted">
              Раздел подключён к базе. Изменяющие операции пока намеренно недоступны.
            </p>
          </div>
        )}
      </Surface>
    </AdminShell>
  );
}
