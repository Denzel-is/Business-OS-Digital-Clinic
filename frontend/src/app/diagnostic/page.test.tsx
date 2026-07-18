import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DiagnosticPage from "@/app/diagnostic/page";

describe("business diagnostic page", () => {
  it("starts with an accessible first step and clear privacy boundary", () => {
    render(<DiagnosticPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Найдите цифровое трение до выбора решения",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Какой у вас тип бизнеса?" })).toBeInTheDocument();
    expect(screen.getByText("Предварительная оценка · без сохранения")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Прогресс диагностики" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
  });
});
