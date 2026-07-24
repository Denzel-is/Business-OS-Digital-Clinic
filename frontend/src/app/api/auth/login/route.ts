import { NextResponse } from "next/server";
import { z } from "zod";

import { copyBackendSetCookies } from "@/lib/api/cookie-utils";
import { prepareCsrf } from "@/lib/api/csrf";
import { getServerEnvironment } from "@/lib/api/server-environment";

const loginSchema = z
  .object({
    email: z.email().max(320),
    password: z.string().min(1).max(200),
  })
  .strict();

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Проверьте формат введённых данных." }, { status: 400 });
  }

  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const prepared = await prepareCsrf(request.headers.get("cookie"));
  const response = await fetch(new URL("/api/v1/auth/login", BACKEND_PUBLIC_URL), {
    body: JSON.stringify(parsed.data),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: prepared.backendCookie,
      [prepared.csrf.headerName]: prepared.csrf.token,
    },
    method: "POST",
  });

  if (!response.ok) {
    const status = response.status === 401 ? 401 : 502;
    return NextResponse.json(
      {
        message:
          status === 401
            ? "Email или пароль указаны неверно."
            : "Сервис входа временно недоступен.",
      },
      { status },
    );
  }

  const nextResponse = NextResponse.json(await response.json(), {
    headers: { "Cache-Control": "no-store" },
  });
  copyBackendSetCookies(prepared.response.headers, nextResponse.headers);
  copyBackendSetCookies(response.headers, nextResponse.headers);
  return nextResponse;
}
