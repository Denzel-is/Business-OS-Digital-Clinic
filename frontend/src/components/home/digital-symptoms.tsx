import { AlertCircle } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";
import { digitalSymptoms } from "@/content/home";

export function DigitalSymptoms() {
  return (
    <section className="border-b border-line py-24 sm:py-32" id="symptoms">
      <Container>
        <SectionIntro
          description="Цифровая проблема редко начинается с отсутствия конкретного фреймворка. Обычно она проявляется в очередях, ручных действиях, потерянном контексте и непрозрачных рисках."
          eyebrow="03 / Digital Symptoms"
          title="Симптомы, которые бизнес видит каждый день"
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:grid-cols-12">
          {digitalSymptoms.map((symptom, index) => (
            <article
              className={`min-h-72 bg-canvas p-7 sm:p-9 ${index === 0 || index === 5 ? "lg:col-span-7" : "lg:col-span-5"}`}
              key={symptom.index}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-accent">SYMPTOM / {symptom.index}</span>
                <AlertCircle aria-hidden="true" className="size-5 text-ink-faint" />
              </div>
              <h3 className="mt-16 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                {symptom.title}
              </h3>
              <p className="mt-5 max-w-xl leading-7 text-ink-muted">{symptom.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
