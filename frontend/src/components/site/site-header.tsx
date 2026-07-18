import Link from "next/link";
import { Activity, Menu } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { homeNavigation } from "@/content/home";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95">
      <Container className="flex min-h-16 items-center justify-between gap-5">
        <Link className="inline-flex items-center gap-3 font-semibold tracking-[-0.03em]" href="/">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full border border-accent/35 bg-accent/10 text-accent"
          >
            <Activity className="size-4" />
          </span>
          <span className="hidden sm:inline">Business OS</span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint sm:hidden">
            B/OS
          </span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 lg:flex">
          {homeNavigation.map((item) => (
            <Link
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/diagnostic" size="compact">
            Начать осмотр
          </ButtonLink>
          <details className="relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-control border border-line bg-surface-raised text-ink marker:hidden">
              <Menu aria-hidden="true" className="size-4" />
              <span className="sr-only">Открыть меню</span>
            </summary>
            <nav
              aria-label="Мобильная навигация"
              className="absolute right-0 top-12 w-64 rounded-panel border border-line bg-surface-raised p-3 shadow-2xl"
            >
              {homeNavigation.map((item) => (
                <Link
                  className="block rounded-control px-4 py-3 text-sm font-medium text-ink-muted hover:bg-white/5 hover:text-ink"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
