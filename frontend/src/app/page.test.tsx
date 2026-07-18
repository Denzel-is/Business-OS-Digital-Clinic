import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("frontend foundation page", () => {
  it("renders the product heading and honestly marks the staged state", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Business OS: Digital Clinic" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Полноценная главная страница будет собрана/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Открыть дизайн-систему/ })).toHaveAttribute(
      "href",
      "/design-system",
    );
  });
});
