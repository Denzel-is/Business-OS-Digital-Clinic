import Link from "next/link";
import { Activity } from "lucide-react";

import { Container } from "@/components/ui/container";
import { homeNavigation } from "@/content/home";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-inset py-12">
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link className="inline-flex items-center gap-3 font-semibold" href="#top">
            <Activity aria-hidden="true" className="size-5 text-accent" />
            Business OS: Digital Clinic
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-ink-muted">
            Диагностика цифровых проблем и проектирование быстрых, удобных и защищённых IT-систем.
          </p>
        </div>
        <nav aria-label="Навигация в подвале" className="grid grid-cols-2 gap-3 md:col-span-4">
          {homeNavigation.map((item) => (
            <Link
              className="text-sm text-ink-muted hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:col-span-3 md:text-right">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-faint">
            Independent digital practice
          </p>
          <p className="mt-4 text-sm text-ink-muted">Demo content is explicitly labeled.</p>
        </div>
      </Container>
    </footer>
  );
}
