import "server-only";

import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/api/backend-session";

export async function requireAdminSession() {
  const session = await getAuthSession();
  if (
    !session.authenticated ||
    !session.roles.some((role) => role === "ADMIN" || role === "EDITOR")
  ) {
    redirect("/admin/login");
  }
  return session;
}
