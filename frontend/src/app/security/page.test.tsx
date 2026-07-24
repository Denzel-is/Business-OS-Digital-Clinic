import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SecurityPage from "@/app/security/page";

describe("security center", () => {
  it("shows the complete honest control map and safe validation lab", () => {
    const { container } = render(<SecurityPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Безопасность без магии и абсолютных обещаний",
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-security-control]")).toHaveLength(16);
    expect(screen.getByRole("heading", { name: "Input Validation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Incident Response" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Учебный текст" })).toBeInTheDocument();
    expect(screen.getByText(/DDoS нельзя остановить только Java-приложением/)).toBeInTheDocument();
    expect(screen.getByText(/Публичный контент нельзя полностью защитить/)).toBeInTheDocument();
  });
});
