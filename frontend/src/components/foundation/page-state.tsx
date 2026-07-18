import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";

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
    <main className="flex min-h-screen items-center bg-canvas py-16">
      <Container>
        <Surface
          aria-live={isError ? "assertive" : "polite"}
          className="mx-auto max-w-3xl p-8 sm:p-12"
          role={isError ? "alert" : "status"}
        >
          <Badge tone={isError ? "critical" : "neutral"}>{kind}</Badge>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-xl leading-7 text-ink-muted">{description}</p>
          {action ? <div className="mt-8">{action}</div> : null}
        </Surface>
      </Container>
    </main>
  );
}
