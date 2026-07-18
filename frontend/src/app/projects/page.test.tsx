import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectsPage from "@/app/projects/page";

describe("projects page", () => {
  it("renders all projects and filters by category accessibly", () => {
    render(<ProjectsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Разборы решений без вымышленных побед" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Открыть разбор" })).toHaveLength(6);

    fireEvent.click(screen.getByRole("button", { name: "Bots" }));

    expect(screen.getByText("Telegram-бот клиентского сервиса")).toBeInTheDocument();
    expect(screen.queryByText("Редизайн интернет-магазина")).not.toBeInTheDocument();
    expect(screen.getByText("Показано проектов: 1")).toBeInTheDocument();
  });
});
