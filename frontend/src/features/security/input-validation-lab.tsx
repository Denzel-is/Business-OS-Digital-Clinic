"use client";

import { useState, type FormEvent } from "react";
import { Check, ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import {
  inputValidationRequestSchema,
  inputValidationResponseSchema,
  type InputValidationResponse,
} from "@/lib/api/contracts";

const outcomeLabels = {
  ACCEPTED: "Принято правилами поля",
  REJECTED: "Отклонено правилами поля",
  REVIEW_REQUIRED: "Нужна проверка контекста",
} as const;

export function InputValidationLab() {
  const [context, setContext] = useState("SUPPORT_MESSAGE");
  const [value, setValue] = useState("Покажите <b>пример</b> как обычный текст");
  const [result, setResult] = useState<InputValidationResponse>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(undefined);

    const parsed = inputValidationRequestSchema.safeParse({ context, value });
    if (!parsed.success) {
      setError("Введите от 1 до 240 символов и выберите контекст.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/security/input-validation", {
        body: JSON.stringify(parsed.data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setResult(inputValidationResponseSchema.parse(await response.json()));
    } catch {
      setError("Симуляция временно недоступна. Текст не был сохранён.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <Surface className="p-6 sm:p-8 lg:col-span-5">
        <form onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="validation-context">
            Контекст поля
          </label>
          <select
            className="mt-2 min-h-12 w-full rounded-control border border-line-strong bg-surface-inset px-4 text-ink"
            id="validation-context"
            onChange={(event) => setContext(event.target.value)}
            value={context}
          >
            <option value="DISPLAY_NAME">Отображаемое имя · максимум 60</option>
            <option value="SEARCH_QUERY">Поисковый запрос · максимум 120</option>
            <option value="SUPPORT_MESSAGE">Сообщение · максимум 240</option>
          </select>

          <div className="mt-6 flex items-end justify-between gap-4">
            <label className="text-sm font-semibold" htmlFor="validation-value">
              Учебный текст
            </label>
            <span className="font-mono text-xs text-ink-faint">{value.length} / 240</span>
          </div>
          <textarea
            className="mt-2 min-h-36 w-full resize-y rounded-control border border-line-strong bg-surface-inset p-4 leading-6 text-ink"
            id="validation-value"
            maxLength={240}
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
          <Button className="mt-5 w-full sm:w-auto" disabled={pending} type="submit">
            {pending ? "Проверяю…" : "Применить правила"}
          </Button>
          <p className="mt-5 text-xs leading-5 text-ink-faint">
            Лаборатория не исполняет ввод, не сканирует сайты, не имитирует DDoS и не проверяет
            SQL-инъекции. Она показывает только серверные правила одного поля.
          </p>
        </form>
      </Surface>

      <Surface aria-live="polite" className="min-h-80 p-6 sm:p-8 lg:col-span-7" variant="inset">
        {error ? (
          <div className="flex gap-3 text-danger" role="alert">
            <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
        {!error && !result ? (
          <div className="grid min-h-64 place-items-center text-center text-ink-muted">
            <div>
              <ShieldAlert aria-hidden="true" className="mx-auto size-8 text-accent" />
              <p className="mt-4 font-semibold text-ink">Результат появится здесь</p>
              <p className="mt-2 max-w-md text-sm leading-6">
                Разметкоподобные символы останутся текстом благодаря безопасному выводу React.
              </p>
            </div>
          </div>
        ) : null}
        {result ? (
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Результат</p>
            <h3 className="mt-3 text-2xl font-semibold">{outcomeLabels[result.outcome]}</h3>
            <p className="mt-5 text-sm text-ink-muted">Нормализованное превью:</p>
            <code
              className="mt-2 block overflow-x-auto rounded-control border border-line bg-canvas p-4 text-sm text-warning"
              data-validation-preview
            >
              {result.normalizedPreview}
            </code>
            <ul className="mt-6 space-y-4">
              {result.rules.map((rule) => (
                <li className="flex gap-3" key={rule.code}>
                  {rule.passed ? (
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                  ) : (
                    <X aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger" />
                  )}
                  <div>
                    <p className="font-semibold">{rule.label}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{rule.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-xs leading-5 text-ink-faint">
              {result.explanation}
            </p>
          </div>
        ) : null}
      </Surface>
    </div>
  );
}
