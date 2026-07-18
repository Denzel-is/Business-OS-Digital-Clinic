"use client";

import { PageState } from "@/components/foundation/page-state";

interface GlobalErrorProps {
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <PageState
      action={
        <button
          className="rounded-full bg-emerald-300 px-5 py-2 font-semibold text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200"
          onClick={reset}
          type="button"
        >
          Повторить
        </button>
      }
      description="Не удалось отобразить страницу. Повторите попытку."
      kind="error"
      title="Что-то пошло не так"
    />
  );
}
