"use client";

import { useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck, LockKeyhole } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { DiagnosticResult } from "@/features/diagnostic/diagnostic-result";
import { diagnosticSteps } from "@/features/diagnostic/diagnostic-content";
import {
  diagnosticEvaluationRequestSchema,
  diagnosticEvaluationResponseSchema,
  type DiagnosticEvaluationRequest,
  type DiagnosticEvaluationResponse,
} from "@/lib/api/contracts";

interface DiagnosticFormValues extends DiagnosticEvaluationRequest {
  contactConsent: boolean;
  contactEmail: string;
  contactName: string;
}

const contactStepIndex = diagnosticSteps.length;
const totalSteps = diagnosticSteps.length + 1;

function evaluationPayload(values: DiagnosticFormValues): DiagnosticEvaluationRequest {
  return {
    aiUsage: values.aiUsage,
    analytics: values.analytics,
    businessType: values.businessType,
    digitalProduct: values.digitalProduct,
    existingSystems: values.existingSystems,
    expectedResult: values.expectedResult,
    leadHandling: values.leadHandling,
    manualOperations: values.manualOperations,
    personalData: values.personalData,
    primaryProblem: values.primaryProblem,
    teamSize: values.teamSize,
  };
}

export function DiagnosticWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<DiagnosticEvaluationResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [contactNotice, setContactNotice] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    trigger,
  } = useForm<DiagnosticFormValues>({
    defaultValues: {
      contactConsent: false,
      contactEmail: "",
      contactName: "",
    },
    mode: "onTouched",
  });

  const currentStep = diagnosticSteps[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const moveNext = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!currentStep) {
      return;
    }

    const isValid = await trigger(currentStep.field);
    if (isValid) {
      setCurrentStepIndex((index) => Math.min(contactStepIndex, index + 1));
    }
  };

  const submit: SubmitHandler<DiagnosticFormValues> = async (values) => {
    setSubmissionError(null);
    const payload = diagnosticEvaluationRequestSchema.parse(evaluationPayload(values));

    try {
      const response = await fetch("/api/diagnostic/evaluate", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Diagnostic request failed");
      }

      const parsedResult = diagnosticEvaluationResponseSchema.parse(await response.json());
      setContactNotice(
        values.contactConsent && values.contactEmail
          ? "Согласие отмечено, но контакт остался только в памяти этой формы: текущая версия его не отправляет и не сохраняет."
          : "Контактные данные не передавались и не сохранялись.",
      );
      setResult(parsedResult);
      window.scrollTo({ behavior: "smooth", top: 0 });
    } catch {
      setSubmissionError(
        "Не удалось получить расчёт. Ответы и контактные данные не были сохранены — попробуйте ещё раз.",
      );
    }
  };

  const restart = () => {
    reset({ contactConsent: false, contactEmail: "", contactName: "" });
    setCurrentStepIndex(0);
    setResult(null);
    setSubmissionError(null);
    setContactNotice("");
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  if (result) {
    return <DiagnosticResult contactNotice={contactNotice} onRestart={restart} result={result} />;
  }

  const currentError = currentStep ? errors[currentStep.field]?.message : undefined;

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-surface-raised">
      <div className="border-b border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
            Step {String(currentStepIndex + 1).padStart(2, "0")} / {totalSteps}
          </p>
          <p className="text-xs text-ink-faint">Предварительная оценка · без сохранения</p>
        </div>
        <div
          aria-label="Прогресс диагностики"
          aria-valuemax={totalSteps}
          aria-valuemin={1}
          aria-valuenow={currentStepIndex + 1}
          className="mt-5 h-1 overflow-hidden rounded-full bg-surface-inset"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form className="p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit(submit)}>
        {currentStep ? (
          <fieldset>
            <legend className="max-w-4xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {currentStep.question}
            </legend>
            <p className="mt-4 max-w-2xl leading-7 text-ink-muted">{currentStep.hint}</p>
            <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-faint">
              {currentStep.systemLabel}
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {currentStep.options.map((option) => (
                <label className="group cursor-pointer" key={option.value}>
                  <input
                    className="peer sr-only"
                    type="radio"
                    value={option.value}
                    {...register(currentStep.field, { required: "Выберите один вариант." })}
                  />
                  <span className="block min-h-32 rounded-control border border-line bg-canvas p-5 transition-[border-color,background-color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-line-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                    <span className="block font-semibold text-ink">{option.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-ink-muted">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {currentError ? (
              <p className="mt-5 text-sm text-danger" role="alert">
                {String(currentError)}
              </p>
            ) : null}
          </fieldset>
        ) : (
          <fieldset>
            <legend className="max-w-4xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Контактные данные
            </legend>
            <p className="mt-4 max-w-2xl leading-7 text-ink-muted">
              Поля необязательны и не участвуют в оценке. В этой диагностике они остаются только в
              памяти браузера и не входят в API-запрос.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Имя
                <input
                  autoComplete="name"
                  className="mt-2 min-h-12 w-full rounded-control border border-line bg-canvas px-4 text-ink placeholder:text-ink-faint"
                  placeholder="Как к вам обращаться"
                  type="text"
                  {...register("contactName", { maxLength: 120 })}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Email
                <input
                  autoComplete="email"
                  className="mt-2 min-h-12 w-full rounded-control border border-line bg-canvas px-4 text-ink placeholder:text-ink-faint"
                  placeholder="name@example.com"
                  type="email"
                  {...register("contactEmail", {
                    maxLength: 254,
                    pattern: {
                      message: "Введите корректный email.",
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    },
                    validate: (value, values) =>
                      !values.contactConsent || Boolean(value) || "Для согласия укажите email.",
                  })}
                />
                {errors.contactEmail?.message ? (
                  <span className="mt-2 block text-sm text-danger" role="alert">
                    {errors.contactEmail.message}
                  </span>
                ) : null}
              </label>
            </div>
            <label className="mt-6 flex max-w-3xl items-start gap-3 rounded-control border border-line bg-canvas p-4 text-sm leading-6 text-ink-muted">
              <input
                className="mt-1 size-4 accent-[var(--ds-color-accent)]"
                type="checkbox"
                {...register("contactConsent")}
              />
              Разрешаю использовать контакт только после отдельного подтверждения отправки. Текущая
              версия ничего не сохраняет.
            </label>
            <div className="mt-6 flex items-start gap-3 text-xs leading-5 text-ink-faint">
              <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />В
              запрос оценки отправляются только ответы о процессе. Имя, email и согласие исключены
              из payload программно.
            </div>
          </fieldset>
        )}

        <div aria-live="polite" className="mt-10 min-h-6">
          {isSubmitting ? (
            <p className="text-sm text-accent">Формирую предварительную карту…</p>
          ) : null}
          {submissionError ? (
            <p className="text-sm text-danger" role="alert">
              {submissionError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-line bg-transparent px-5 text-sm font-semibold text-ink-muted disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentStepIndex === 0 || isSubmitting}
            onClick={() => setCurrentStepIndex((index) => Math.max(0, index - 1))}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Назад
          </button>
          {currentStep ? (
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-accent bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-strong"
              onClick={moveNext}
              type="button"
            >
              Продолжить
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          ) : (
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-accent bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-strong disabled:cursor-wait disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              Получить предварительный результат
              <ClipboardCheck aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
