import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  BACKEND_PUBLIC_URL: z.url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export function getServerEnvironment() {
  const environment = serverEnvironmentSchema.parse(process.env);

  if (environment.NODE_ENV === "production" && !environment.BACKEND_PUBLIC_URL) {
    throw new Error("BACKEND_PUBLIC_URL must be configured in production");
  }

  return {
    BACKEND_PUBLIC_URL: environment.BACKEND_PUBLIC_URL ?? "http://localhost:8080",
  };
}
