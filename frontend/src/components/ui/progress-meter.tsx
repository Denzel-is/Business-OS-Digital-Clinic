interface ProgressMeterProps {
  label: string;
  value: number;
}

export function ProgressMeter({ label, value }: ProgressMeterProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-mono text-xs text-accent">{normalizedValue}/100</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="h-2 overflow-hidden rounded-full bg-surface-inset"
        role="progressbar"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${normalizedValue}%` }} />
      </div>
    </div>
  );
}
