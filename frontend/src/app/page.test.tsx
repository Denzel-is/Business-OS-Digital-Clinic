import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("homepage", () => {
  it("renders the diagnostic message and every planned editorial section", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Диагностирую цифровые проблемы бизнеса",
      }),
    ).toBeInTheDocument();

    const sectionHeadings = [
      "Сначала измеряем. Потом назначаем решение",
      "От проблемного сигнала к управляемому процессу",
      "Симптомы, которые бизнес видит каждый день",
      "Не начинаю с кода. Начинаю с процесса",
      "Назначения под задачу, а не под модный стек",
      "Показываю ход решения, не вымышленные победы",
      "Безопасность — система слоёв",
      "Перевожу между бизнесом, интерфейсом и кодом",
      "Начните не с решения. Начните с симптома",
    ];

    for (const heading of sectionHeadings) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
    }
  });

  it("labels simulated and preliminary content honestly", () => {
    render(<HomePage />);

    expect(screen.getByText("Демонстрационная симуляция")).toBeInTheDocument();
    expect(screen.getByText(/Не измерено\. Демонстрационная оценка/)).toBeInTheDocument();
    expect(screen.getByText("Concept Project")).toBeInTheDocument();
    expect(screen.getByText("Educational Project")).toBeInTheDocument();
    expect(screen.getByText("Demo Case")).toBeInTheDocument();
    expect(screen.getByText(/ничего не сохраняется/)).toBeInTheDocument();
    expect(screen.getAllByText("Danila Borodin").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /@dborrov/ }).length).toBeGreaterThan(0);
  });

  it("keeps motion enhancements attached to meaningful static content", () => {
    render(<HomePage />);

    expect(document.querySelector('[data-motion-parallax="hero-media"]')).toBeInTheDocument();
    expect(document.querySelector("[data-vitals-motion]")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Трёхмерная схема многоуровневой защиты" }),
    ).toHaveAttribute("data-security-visual");
  });

  it("links calls to action only to implemented page sections", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "Начать первичный осмотр" })).toHaveAttribute(
      "href",
      "/diagnostic",
    );
    expect(screen.getByRole("link", { name: "Посмотреть метод" })).toHaveAttribute(
      "href",
      "#treatment",
    );
    expect(screen.getByRole("link", { name: "Начать диагностику" })).toHaveAttribute(
      "href",
      "/diagnostic",
    );
  });
});
