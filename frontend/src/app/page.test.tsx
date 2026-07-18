import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("frontend foundation page", () => {
  it("renders the product heading and honestly marks the foundation state", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Business OS: Digital Clinic" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Дизайн-система и полноценная главная страница/)).toBeInTheDocument();
  });
});
