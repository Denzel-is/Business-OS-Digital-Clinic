import { z } from "zod";

export const systemStatusSchema = z.object({
  service: z.literal("business-os-backend"),
  status: z.literal("available"),
});

export type SystemStatus = z.infer<typeof systemStatusSchema>;

export const diagnosticEvaluationRequestSchema = z
  .object({
    aiUsage: z.enum(["NONE", "EXPERIMENTING", "EMBEDDED", "UNCONTROLLED"]),
    analytics: z.enum(["REAL_TIME", "BASIC", "MANUAL", "NONE"]),
    businessType: z.enum(["RETAIL", "SERVICES", "SAAS", "MANUFACTURING", "NONPROFIT", "OTHER"]),
    digitalProduct: z.enum(["MODERN", "OUTDATED", "UNSTABLE", "NONE"]),
    existingSystems: z.enum(["INTEGRATED", "PARTIAL", "FRAGMENTED", "NONE"]),
    expectedResult: z.enum([
      "SAVE_TIME",
      "GROW_REVENUE",
      "IMPROVE_EXPERIENCE",
      "REDUCE_RISK",
      "GAIN_VISIBILITY",
    ]),
    leadHandling: z.enum(["AUTOMATED", "PARTIAL", "MANUAL", "CHAOTIC"]),
    manualOperations: z.enum(["NONE", "RARE", "REGULAR", "DOMINANT"]),
    personalData: z.enum(["NONE", "LIMITED", "REGULAR", "SENSITIVE"]),
    primaryProblem: z.enum([
      "LOST_LEADS",
      "MANUAL_WORK",
      "LOW_CONVERSION",
      "UNSTABLE_SYSTEMS",
      "SECURITY_RISKS",
      "POOR_UX",
    ]),
    teamSize: z.enum([
      "SOLO",
      "TWO_TO_TEN",
      "ELEVEN_TO_FIFTY",
      "FIFTY_ONE_TO_TWO_HUNDRED",
      "OVER_TWO_HUNDRED",
    ]),
  })
  .strict();

export const diagnosticEvaluationResponseSchema = z.object({
  cases: z.array(z.string()),
  disclaimer: z.string(),
  findings: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
      severity: z.enum(["HIGH", "MEDIUM", "LOW"]),
      title: z.string(),
    }),
  ),
  implementationSequence: z.array(z.string()),
  priorities: z.array(z.string()),
  recommendations: z.array(z.string()),
  score: z.number().int().min(0).max(100),
  services: z.array(z.string()),
  status: z.string(),
});

export type DiagnosticEvaluationRequest = z.infer<typeof diagnosticEvaluationRequestSchema>;
export type DiagnosticEvaluationResponse = z.infer<typeof diagnosticEvaluationResponseSchema>;

export const inputValidationRequestSchema = z
  .object({
    context: z.enum(["DISPLAY_NAME", "SEARCH_QUERY", "SUPPORT_MESSAGE"]),
    value: z.string().trim().min(1).max(240),
  })
  .strict();

export const inputValidationResponseSchema = z.object({
  explanation: z.string(),
  normalizedPreview: z.string(),
  outcome: z.enum(["ACCEPTED", "REVIEW_REQUIRED", "REJECTED"]),
  rules: z.array(
    z.object({
      code: z.string(),
      detail: z.string(),
      label: z.string(),
      passed: z.boolean(),
    }),
  ),
});

export type InputValidationRequest = z.infer<typeof inputValidationRequestSchema>;
export type InputValidationResponse = z.infer<typeof inputValidationResponseSchema>;
