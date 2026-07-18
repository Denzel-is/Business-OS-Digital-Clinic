"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  projectCategories,
  projects,
  type ProjectCategory,
  type ProjectCase,
} from "@/content/projects";

type ProjectFilter = "Все" | ProjectCategory;

export function ProjectCatalog() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("Все");
  const visibleProjects =
    activeFilter === "Все"
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter));

  return (
    <>
      <div aria-label="Фильтр проектов" className="flex flex-wrap gap-2" role="group">
        {(["Все", ...projectCategories] as const).map((category) => (
          <button
            aria-pressed={activeFilter === category}
            className="min-h-10 rounded-full border border-line px-4 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
            key={category}
            onClick={() => setActiveFilter(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint"
      >
        Показано проектов: {visibleProjects.length}
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        {visibleProjects.map((project, index) => (
          <ProjectCard index={index} key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}

interface ProjectCardProps {
  index: number;
  project: ProjectCase;
}

function ProjectCard({ index, project }: ProjectCardProps) {
  return (
    <article
      className={`group flex min-h-[34rem] flex-col overflow-hidden rounded-panel border border-line bg-surface-raised transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-accent/35 ${index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
      data-project-card={project.slug}
    >
      <ProjectCardVisual project={project} />
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone="neutral">{project.label}</Badge>
          <span className="font-mono text-xs text-accent">{project.code}</span>
        </div>
        <h2 className="mt-7 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          {project.title}
        </h2>
        <p className="mt-5 leading-7 text-ink-muted">{project.summary}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <span
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
        <Link
          className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-semibold text-ink hover:text-accent"
          href={`/projects/${project.slug}`}
        >
          Открыть разбор
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function ProjectCardVisual({ project }: { project: ProjectCase }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-48 overflow-hidden border-b border-line bg-surface-inset p-6"
    >
      <div className="absolute inset-0 editorial-grid opacity-45" />
      <div className="relative grid h-full grid-cols-4 items-center gap-2">
        {project.flow.map((step, index) => (
          <div className="relative" key={step}>
            <div className="grid min-h-16 place-items-center rounded-control border border-accent/25 bg-canvas/90 px-2 text-center font-mono text-[0.55rem] uppercase tracking-[0.08em] text-ink-muted">
              {step}
            </div>
            {index < project.flow.length - 1 ? (
              <span className="absolute left-full top-1/2 h-px w-2 bg-accent/50" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
