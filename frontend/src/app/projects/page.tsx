import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ProjectCatalog } from "@/features/projects/project-catalog";

export const metadata: Metadata = {
  description:
    "Шесть честно маркированных демонстрационных разборов Web, Applications, AI, Automation, UX/UI, Security, Data и Bots.",
  title: "Проекты и кейсы",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="editorial-grid border-b border-line py-16 sm:py-24">
          <Container>
            <Badge tone="stable">Projects / Stage 09</Badge>
            <h1 className="text-balance mt-7 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              Разборы решений без вымышленных побед
            </h1>
            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <p className="max-w-3xl text-lg leading-8 text-ink-muted lg:col-span-8">
                Каждый материал показывает постановку задачи, архитектурный ход, проверяемые сигналы
                и ограничения. Это демонстрационные проекты без настоящих клиентов, отзывов и
                финансовых результатов.
              </p>
              <p className="border-l border-warning/40 pl-5 text-sm leading-6 text-warning lg:col-span-4">
                Метки Concept, Educational, Personal и Demo сохраняются на карточке и странице
                разбора.
              </p>
            </div>
          </Container>
        </section>
        <section className="bg-surface-inset py-16 sm:py-24">
          <Container>
            <ProjectCatalog />
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
