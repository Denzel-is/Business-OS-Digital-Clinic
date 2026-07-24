import { describe, expect, it } from "vitest";

import { canAccessAdminResource, hasAdminAccess } from "@/lib/admin/access";
import type { AuthSession } from "@/lib/api/contracts";

const anonymous: AuthSession = {
  authenticated: false,
  displayName: "",
  mfaReady: true,
  mfaRequired: false,
  roles: [],
};
const editor: AuthSession = {
  ...anonymous,
  authenticated: true,
  displayName: "Editor",
  roles: ["EDITOR"],
};
const administrator: AuthSession = {
  ...editor,
  displayName: "Administrator",
  roles: ["ADMIN"],
};

describe("admin access policy", () => {
  it("rejects anonymous sessions", () => {
    expect(hasAdminAccess(anonymous)).toBe(false);
    expect(canAccessAdminResource(anonymous, "projects")).toBe(false);
  });

  it("allows editors to content but not system resources", () => {
    expect(canAccessAdminResource(editor, "projects")).toBe(true);
    expect(canAccessAdminResource(editor, "users")).toBe(false);
    expect(canAccessAdminResource(editor, "audit-logs")).toBe(false);
  });

  it("allows administrators to system resources", () => {
    expect(canAccessAdminResource(administrator, "users")).toBe(true);
    expect(canAccessAdminResource(administrator, "settings")).toBe(true);
  });
});
