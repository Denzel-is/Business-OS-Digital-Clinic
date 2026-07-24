import { NextResponse } from "next/server";

import { filterBackendCookieHeader } from "@/lib/api/cookie-utils";
import { getServerEnvironment } from "@/lib/api/server-environment";

export async function GET(request: Request) {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const response = await fetch(new URL("/api/v1/auth/session", BACKEND_PUBLIC_URL), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Cookie: filterBackendCookieHeader(request.headers.get("cookie")),
    },
  });

  if (!response.ok) {
    return NextResponse.json({ authenticated: false }, { status: 502 });
  }
  return NextResponse.json(await response.json(), {
    headers: { "Cache-Control": "no-store" },
  });
}
