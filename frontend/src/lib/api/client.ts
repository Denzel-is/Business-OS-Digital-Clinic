import "server-only";

import { systemStatusSchema, type SystemStatus } from "@/lib/api/contracts";
import { getServerEnvironment } from "@/lib/api/server-environment";

export class BackendRequestError extends Error {
  constructor(readonly status: number) {
    super("Backend request failed");
    this.name = "BackendRequestError";
  }
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
