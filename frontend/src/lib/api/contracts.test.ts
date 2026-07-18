import { describe, expect, it } from "vitest";

import {
  diagnosticEvaluationRequestSchema,
  diagnosticEvaluationResponseSchema,
  systemStatusSchema,
} from "@/lib/api/contracts";

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

describe("diagnostic contracts", () => {
  const request = {
    aiUsage: "EXPERIMENTING",
    analytics: "MANUAL",
    businessType: "SERVICES",
    digitalProduct: "OUTDATED",
    existingSystems: "FRAGMENTED",
    expectedResult: "GROW_REVENUE",
    leadHandling: "MANUAL",
    manualOperations: "REGULAR",
    personalData: "REGULAR",
    primaryProblem: "LOST_LEADS",
    teamSize: "ELEVEN_TO_FIFTY",
  } as const;

  it("accepts complete evaluation answers and rejects contact fields", () => {
    expect(diagnosticEvaluationRequestSchema.parse(request)).toEqual(request);
    expect(() =>
      diagnosticEvaluationRequestSchema.parse({ ...request, contactEmail: "private@example.com" }),
    ).toThrow();
  });

  it("validates the preliminary assessment response", () => {
    expect(
      diagnosticEvaluationResponseSchema.parse({
        cases: ["Автоматизация обработки заявок"],
        disclaimer: "Предварительно и не заменяет аудит.",
        findings: [
          {
            code: "lead-loss",
            description: "Описание",
            severity: "HIGH",
            title: "Потери заявок",
          },
        ],
        implementationSequence: ["Проверить процесс"],
        priorities: ["Потери заявок"],
        recommendations: ["Собрать события"],
        score: 54,
        services: ["Автоматизация"],
        status: "Высокое цифровое трение",
      }).score,
    ).toBe(54);
  });
});
