import "server-only";

import { cookies } from "next/headers";

import {
  adminOverviewSchema,
  adminResourcePageSchema,
  authSessionSchema,
  type AdminOverview,
  type AdminResourcePage,
  type AdminResourceSlug,
  type AuthSession,
} from "@/lib/api/contracts";
import { BackendRequestError } from "@/lib/api/client";
import { BACKEND_COOKIE_NAMES } from "@/lib/api/cookie-utils";
import { getServerEnvironment } from "@/lib/api/server-environment";

export async function backendCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return BACKEND_COOKIE_NAMES.map((name) => {
    const value = cookieStore.get(name)?.value;
    return value ? `${name}=${value}` : null;
  })
    .filter((cookie): cookie is string => cookie !== null)
    .join("; ");
}

async function authenticatedGet(path: string): Promise<Response> {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const response = await fetch(new URL(path, BACKEND_PUBLIC_URL), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Cookie: await backendCookieHeader(),
    },
  });

  if (!response.ok) {
    throw new BackendRequestError(response.status);
  }
  return response;
}

export async function getAuthSession(): Promise<AuthSession> {
  const response = await authenticatedGet("/api/v1/auth/session");
  return authSessionSchema.parse(await response.json());
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const response = await authenticatedGet("/api/v1/admin/overview");
  return adminOverviewSchema.parse(await response.json());
}

export async function getAdminResource(
  resource: AdminResourceSlug,
  page = 0,
): Promise<AdminResourcePage> {
  const systemResources: AdminResourceSlug[] = ["users", "audit-logs", "settings"];
  const scope = systemResources.includes(resource) ? "system" : "content";
  const path = `/api/v1/admin/${scope}/${resource}?page=${page}&size=20`;
  const response = await authenticatedGet(path);
  return adminResourcePageSchema.parse(await response.json());
}
