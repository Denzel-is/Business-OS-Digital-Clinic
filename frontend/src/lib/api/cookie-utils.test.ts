import { describe, expect, it } from "vitest";

import { copyBackendSetCookies, filterBackendCookieHeader } from "@/lib/api/cookie-utils";

describe("backend cookie allowlist", () => {
  it("forwards only the session and CSRF cookies", () => {
    expect(
      filterBackendCookieHeader(
        "analytics=track-me; BUSINESS_OS_SESSION=session-value; arbitrary=secret; XSRF-TOKEN=csrf-value",
      ),
    ).toBe("BUSINESS_OS_SESSION=session-value; XSRF-TOKEN=csrf-value");
  });

  it("copies only allowlisted Set-Cookie headers", () => {
    const source = new Headers();
    source.append(
      "Set-Cookie",
      "BUSINESS_OS_SESSION=session-value; Path=/; HttpOnly; SameSite=Lax",
    );
    source.append("Set-Cookie", "tracking=value; Path=/");
    const target = new Headers();

    copyBackendSetCookies(source, target);

    expect(target.get("set-cookie")).toContain("BUSINESS_OS_SESSION=session-value");
    expect(target.get("set-cookie")).not.toContain("tracking=value");
  });
});
