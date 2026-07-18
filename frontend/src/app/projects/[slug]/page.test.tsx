import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectDetailPage from "@/app/projects/[slug]/page";

describe("project detail page", () => {
  it("keeps the project label, constraints, and verification language visible", async () => {
    render(
      await ProjectDetailPage({
        params: Promise.resolve({ slug: "secure-client-portal" }),
      }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Защищённый клиентский портал" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Concept Project")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Честное ограничение" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Что проверять, а не обещать" }),
    ).toBeInTheDocument();
  });
});
