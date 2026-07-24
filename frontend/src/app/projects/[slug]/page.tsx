import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, TriangleAlert } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { findProject, projects } from "@/content/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    return { title: "Проект не найден" };
  }

  return {
    description: project.summary,
    title: project.title,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="editorial-grid border-b border-line py-16 sm:py-24">
          <Container>
            <Link
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
              href="/projects"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Все проекты
            </Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="stable">{project.label}</Badge>
                  <span className="font-mono text-xs text-accent">{project.code}</span>
                </div>
                <h1 className="text-balance mt-7 text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                  {project.title}
                </h1>
              </div>
              <p className="text-lg leading-8 text-ink-muted lg:col-span-4">{project.summary}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <span
                  className="rounded-full border border-line px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint"
                  key={category}
                >
                  {category}
                </span>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-line py-16 sm:py-24">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Badge>Problem frame</Badge>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">
                Что диагностируется
              </h2>
              <p className="mt-6 text-lg leading-8 text-ink-muted">{project.challenge}</p>
            </div>
            <div className="rounded-panel border border-line bg-surface-raised p-7 lg:col-span-7 lg:p-10">
              <div className="flex items-center gap-3 text-warning">
                <TriangleAlert aria-hidden="true" className="size-5" />
                <h2 className="font-mono text-xs uppercase tracking-[0.14em]">
                  Честное ограничение
                </h2>
              </div>
              <p className="mt-6 text-lg leading-8 text-ink-muted">{project.constraints}</p>
            </div>
          </Container>
        </section>

        <section className="border-b border-line bg-surface-inset py-16 sm:py-24">
          <Container>
            <Badge tone="stable">Solution path</Badge>
            <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
              Как устроен ход решения
            </h2>
            <ol className="mt-12 grid gap-3 lg:grid-cols-4">
              {project.flow.map((step, index) => (
                <li className="min-h-40 rounded-panel border border-line bg-canvas p-6" key={step}>
                  <span className="font-mono text-xs text-accent">0{index + 1}</span>
                  <p className="mt-10 text-xl font-semibold">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {project.approach.map((item) => (
                <article
                  className="rounded-panel border border-line bg-surface-raised p-6"
                  key={item}
                >
                  <FlaskConical aria-hidden="true" className="size-5 text-accent" />
                  <p className="mt-5 leading-7 text-ink-muted">{item}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-24">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Badge>Verification signals</Badge>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">
                Что проверять, а не обещать
              </h2>
              <p className="mt-6 leading-7 text-ink-muted">
                Эти сигналы задают способ проверки будущего внедрения. Они не являются результатами
                клиента или измерениями этого демонстрационного проекта.
              </p>
            </div>
            <ul className="space-y-3 lg:col-span-7">
              {project.checks.map((check) => (
                <li
                  className="flex items-start gap-4 rounded-control border border-line bg-surface-raised p-5"
                  key={check}
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="leading-7 text-ink-muted">{check}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-t border-line bg-surface-inset py-16">
          <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Next step</p>
              <p className="mt-3 text-2xl font-semibold">Сначала проверьте собственный симптом</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="secondary">
                Обсудить похожую задачу
              </ButtonLink>
              <ButtonLink href="/diagnostic" icon={<ArrowRight aria-hidden="true" />}>
                Пройти диагностику
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
