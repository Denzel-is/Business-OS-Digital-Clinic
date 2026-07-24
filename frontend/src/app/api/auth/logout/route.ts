import { NextResponse } from "next/server";

import { copyBackendSetCookies } from "@/lib/api/backend-session";
import { prepareCsrf } from "@/lib/api/csrf";
import { getServerEnvironment } from "@/lib/api/server-environment";

export async function POST(request: Request) {
  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const prepared = await prepareCsrf(request.headers.get("cookie"));
  const response = await fetch(new URL("/api/v1/auth/logout", BACKEND_PUBLIC_URL), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Cookie: prepared.backendCookie,
      [prepared.csrf.headerName]: prepared.csrf.token,
    },
    method: "POST",
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Не удалось завершить сессию." }, { status: 502 });
  }

  const nextResponse = new NextResponse(null, { status: 204 });
  copyBackendSetCookies(prepared.response.headers, nextResponse.headers);
  copyBackendSetCookies(response.headers, nextResponse.headers);
  return nextResponse;
}
