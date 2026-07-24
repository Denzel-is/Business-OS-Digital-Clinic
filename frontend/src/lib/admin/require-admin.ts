import "server-only";

import { redirect } from "next/navigation";

import { hasAdminAccess } from "@/lib/admin/access";
import { getAuthSession } from "@/lib/api/backend-session";

export async function requireAdminSession() {
  const session = await getAuthSession();
  if (!hasAdminAccess(session)) {
    redirect("/admin/login");
  }
  return session;
}
