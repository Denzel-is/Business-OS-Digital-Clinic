import "server-only";

import { z } from "zod";

import { filterBackendCookieHeader, getSetCookieValues } from "@/lib/api/backend-session";
import { getServerEnvironment } from "@/lib/api/server-environment";

const csrfResponseSchema = z.object({
  headerName: z.string(),
  parameterName: z.string(),
  token: z.string().min(1),
});

export async function prepareCsrf(cookieHeader: string | null) {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const currentCookies = filterBackendCookieHeader(cookieHeader);
  const response = await fetch(new URL("/api/v1/security/csrf", BACKEND_PUBLIC_URL), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(currentCookies ? { Cookie: currentCookies } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("CSRF initialization failed");
  }

  const csrf = csrfResponseSchema.parse(await response.json());
  const csrfSetCookie = getSetCookieValues(response.headers).find((cookie) =>
    cookie.startsWith("XSRF-TOKEN="),
  );
  const csrfCookiePair = csrfSetCookie?.split(";", 1)[0];
  const backendCookie = [currentCookies, csrfCookiePair].filter(Boolean).join("; ");

  return {
    backendCookie,
    csrf,
    response,
  };
}
