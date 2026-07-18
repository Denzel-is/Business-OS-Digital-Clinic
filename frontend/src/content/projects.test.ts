import { describe, expect, it } from "vitest";

import { projectCategories, projectLabels, projects } from "@/content/projects";

describe("project catalog content", () => {
  it("contains six unique and honestly labeled demo projects", () => {
    expect(projects).toHaveLength(6);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(6);
    expect(new Set(projects.map((project) => project.title)).size).toBe(6);

    for (const project of projects) {
      expect(projectLabels).toContain(project.label);
      expect(project.constraints.length).toBeGreaterThan(30);
      expect(project.checks.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("represents every required category", () => {
    const representedCategories = new Set(projects.flatMap((project) => project.categories));

    expect([...representedCategories].sort()).toEqual([...projectCategories].sort());
  });
});
