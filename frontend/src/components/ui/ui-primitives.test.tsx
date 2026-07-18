import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { TextField } from "@/components/ui/text-field";

describe("design system primitives", () => {
  it("exposes button behavior through native semantics", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Сохранить</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("connects field errors to the corresponding input", () => {
    render(<TextField error="Введите корректный email" id="email" label="Email" type="email" />);

    const input = screen.getByRole("textbox", { name: "Email" });
    const error = screen.getByText("Введите корректный email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
  });

  it("clamps progress values to the valid accessible range", () => {
    render(<ProgressMeter label="Здоровье системы" value={140} />);

    expect(screen.getByRole("progressbar", { name: "Здоровье системы" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
