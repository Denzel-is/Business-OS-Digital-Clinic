import type { AdminResourceSlug, AuthSession } from "@/lib/api/contracts";

const SYSTEM_RESOURCES: readonly AdminResourceSlug[] = ["users", "audit-logs", "settings"];

export function hasAdminAccess(session: AuthSession): boolean {
  return (
    session.authenticated && session.roles.some((role) => role === "ADMIN" || role === "EDITOR")
  );
}

export function canAccessAdminResource(session: AuthSession, resource: AdminResourceSlug): boolean {
  if (!hasAdminAccess(session)) {
    return false;
  }
  return !SYSTEM_RESOURCES.includes(resource) || session.roles.includes("ADMIN");
}

export function isSystemResource(resource: AdminResourceSlug): boolean {
  return SYSTEM_RESOURCES.includes(resource);
}
