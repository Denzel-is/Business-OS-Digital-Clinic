import type { InputHTMLAttributes } from "react";

import { classNames } from "@/lib/styles/class-names";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  error?: string;
  hint?: string;
  id: string;
  label: string;
}

export function TextField({ className, error, hint, id, label, ...props }: TextFieldProps) {
  const descriptionIds = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={descriptionIds || undefined}
        aria-invalid={Boolean(error)}
        className={classNames(
          "min-h-12 w-full rounded-control border bg-surface-inset px-4 text-ink placeholder:text-ink-faint hover:border-line-strong focus:border-accent",
          error ? "border-danger" : "border-line",
          className,
        )}
        id={id}
        {...props}
      />
      {hint ? (
        <p className="mt-2 text-xs leading-5 text-ink-muted" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-xs leading-5 text-danger" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
