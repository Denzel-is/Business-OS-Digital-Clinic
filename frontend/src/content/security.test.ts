import { describe, expect, it } from "vitest";

import { securityControls } from "@/content/security";

describe("security control map", () => {
  it("contains every required control exactly once with an honest status", () => {
    expect(securityControls).toHaveLength(16);
    expect(new Set(securityControls.map((control) => control.title)).size).toBe(16);
    expect(securityControls.map((control) => control.title)).toEqual(
      expect.arrayContaining([
        "Input Validation",
        "Authentication",
        "Authorization",
        "API Security",
        "Database Security",
        "Session Security",
        "Rate Limiting",
        "Bot Protection",
        "Security Headers",
        "Audit Logging",
        "Secrets Management",
        "Backups",
        "Monitoring",
        "Dependency Security",
        "CDN and WAF",
        "Incident Response",
      ]),
    );
    expect(securityControls.every((control) => control.status !== undefined)).toBe(true);
  });
});
