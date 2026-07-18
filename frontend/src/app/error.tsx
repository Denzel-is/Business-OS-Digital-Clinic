"use client";

import { PageState } from "@/components/foundation/page-state";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <PageState
      action={<Button onClick={reset}>Повторить</Button>}
      description="Не удалось отобразить страницу. Повторите попытку."
      kind="error"
      title="Что-то пошло не так"
    />
  );
}
