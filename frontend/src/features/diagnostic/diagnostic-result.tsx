import { RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
import type { DiagnosticEvaluationResponse } from "@/lib/api/contracts";

interface DiagnosticResultProps {
  contactNotice: string;
  onRestart: () => void;
  result: DiagnosticEvaluationResponse;
}

const severityLabels = {
  HIGH: "Высокий приоритет",
  LOW: "Наблюдение",
  MEDIUM: "Средний приоритет",
} as const;

const severityTones = {
  HIGH: "critical",
  LOW: "neutral",
  MEDIUM: "warning",
} as const;

export function DiagnosticResult({ contactNotice, onRestart, result }: DiagnosticResultProps) {
  return (
    <section aria-labelledby="diagnostic-result-title" className="space-y-6">
      <div className="grid gap-6 rounded-panel border border-accent/30 bg-surface-raised p-7 lg:grid-cols-12 lg:p-10">
        <div className="lg:col-span-4">
          <Badge tone="stable">Preliminary result</Badge>
          <p className="mt-8 font-mono text-[clamp(5rem,12vw,9rem)] leading-none tracking-[-0.09em]">
            {result.score}
          </p>
          <p className="mt-3 text-xl font-semibold">{result.status}</p>
        </div>
        <div className="lg:col-span-8 lg:self-end">
          <h2
            className="text-balance text-4xl font-semibold tracking-[-0.05em]"
            id="diagnostic-result-title"
          >
            Предварительная карта цифрового здоровья
          </h2>
          <div className="mt-8">
            <ProgressMeter label="Business Health Score" value={result.score} />
          </div>
          <p className="mt-6 text-sm leading-6 text-warning">{result.disclaimer}</p>
          <p className="mt-3 text-xs leading-5 text-ink-faint">{contactNotice}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {result.findings.map((finding) => (
          <article className="rounded-panel border border-line bg-canvas p-6" key={finding.code}>
            <Badge tone={severityTones[finding.severity]}>{severityLabels[finding.severity]}</Badge>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{finding.title}</h3>
            <p className="mt-3 leading-7 text-ink-muted">{finding.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <ResultList className="lg:col-span-5" items={result.priorities} title="Приоритеты" />
        <ResultList className="lg:col-span-7" items={result.recommendations} title="Рекомендации" />
        <ResultList className="lg:col-span-4" items={result.services} title="Релевантные услуги" />
        <ResultList className="lg:col-span-4" items={result.cases} title="Подходящие кейсы" />
        <ResultList
          className="lg:col-span-4"
          items={result.implementationSequence}
          title="Порядок внедрения"
        />
      </div>

      <Button icon={<RotateCcw aria-hidden="true" />} onClick={onRestart} variant="secondary">
        Пройти диагностику заново
      </Button>
    </section>
  );
}

interface ResultListProps {
  className: string;
  items: string[];
  title: string;
}

function ResultList({ className, items, title }: ResultListProps) {
  return (
    <section className={`rounded-panel border border-line bg-surface-inset p-6 ${className}`}>
      <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{title}</h3>
      <ol className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-6 text-ink-muted"
            key={item}
          >
            <span className="font-mono text-xs text-ink-faint">0{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
