import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <main className="editorial-grid flex min-h-screen items-center bg-canvas py-20 text-ink">
      <Container>
        <section aria-labelledby="foundation-title" className="max-w-5xl">
          <Badge tone="stable">System / Stage 05</Badge>
          <h1
            aria-label="Business OS: Digital Clinic"
            id="foundation-title"
            className="text-balance mt-8 text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
          >
            Business OS:
            <br />
            Digital Clinic
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted">
            Frontend foundation и дизайн-система готовы. Полноценная главная страница будет собрана
            отдельным этапом на проверенных токенах и компонентах.
          </p>
          <div className="mt-10">
            <ButtonLink href="/design-system" icon={<ArrowUpRight aria-hidden="true" />}>
              Открыть дизайн-систему
            </ButtonLink>
          </div>
        </section>
      </Container>
    </main>
  );
}
