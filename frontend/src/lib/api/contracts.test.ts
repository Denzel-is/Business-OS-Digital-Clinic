import { describe, expect, it } from "vitest";

import { systemStatusSchema } from "@/lib/api/contracts";

describe("system status contract", () => {
  it("accepts the backend foundation response", () => {
    expect(
      systemStatusSchema.parse({ service: "business-os-backend", status: "available" }),
    ).toEqual({ service: "business-os-backend", status: "available" });
  });

  it("rejects an unexpected backend status", () => {
    expect(() =>
      systemStatusSchema.parse({ service: "business-os-backend", status: "degraded" }),
    ).toThrow();
  });
});
