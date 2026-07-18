import type { ReactNode } from "react";

type PageStateKind = "empty" | "error" | "loading";

interface PageStateProps {
  action?: ReactNode;
  description: string;
  kind: PageStateKind;
  title: string;
}

export function PageState({ action, description, kind, title }: PageStateProps) {
  const isError = kind === "error";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <section
        aria-live={isError ? "assertive" : "polite"}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-8"
        role={isError ? "alert" : "status"}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{kind}</p>
        <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-slate-300">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </section>
    </main>
  );
}
