import "server-only";

import {
  diagnosticEvaluationResponseSchema,
  inputValidationResponseSchema,
  systemStatusSchema,
  type DiagnosticEvaluationRequest,
  type DiagnosticEvaluationResponse,
  type InputValidationRequest,
  type InputValidationResponse,
  type SystemStatus,
} from "@/lib/api/contracts";
import { getServerEnvironment } from "@/lib/api/server-environment";

export class BackendRequestError extends Error {
  constructor(readonly status: number) {
    super("Backend request failed");
    this.name = "BackendRequestError";
  }
}

export async function evaluateInputValidation(
  request: InputValidationRequest,
): Promise<InputValidationResponse> {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const endpoint = new URL("/api/v1/security/input-validation-demo", BACKEND_PUBLIC_URL);
  const response = await fetch(endpoint, {
    body: JSON.stringify(request),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new BackendRequestError(response.status);
  }

  return inputValidationResponseSchema.parse(await response.json());
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const endpoint = new URL("/api/v1/system/status", BACKEND_PUBLIC_URL);
  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new BackendRequestError(response.status);
  }

  return systemStatusSchema.parse(await response.json());
}

export async function evaluateDiagnostic(
  request: DiagnosticEvaluationRequest,
): Promise<DiagnosticEvaluationResponse> {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const endpoint = new URL("/api/v1/diagnostics/evaluate", BACKEND_PUBLIC_URL);
  const response = await fetch(endpoint, {
    body: JSON.stringify(request),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new BackendRequestError(response.status);
  }

  return diagnosticEvaluationResponseSchema.parse(await response.json());
}
