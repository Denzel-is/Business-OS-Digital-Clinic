import { NextResponse } from "next/server";

import { contactRequestResponseSchema, contactRequestSchema } from "@/lib/api/contracts";
import { getServerEnvironment } from "@/lib/api/server-environment";

const MAXIMUM_BODY_BYTES = 12 * 1024;

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAXIMUM_BODY_BYTES) {
    return NextResponse.json({ message: "Запрос слишком большой." }, { status: 413 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAXIMUM_BODY_BYTES) {
    return NextResponse.json({ message: "Запрос слишком большой." }, { status: 413 });
  }

  const parsed = contactRequestSchema.safeParse(
    (() => {
      try {
        return JSON.parse(rawBody) as unknown;
      } catch {
        return null;
      }
    })(),
  );
  if (!parsed.success) {
    return NextResponse.json({ message: "Проверьте обязательные поля формы." }, { status: 400 });
  }

  const { BACKEND_PUBLIC_URL } = getServerEnvironment();
  const response = await fetch(new URL("/api/v1/contact-requests", BACKEND_PUBLIC_URL), {
    body: JSON.stringify(parsed.data),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    const status = response.status === 429 ? 429 : 502;
    return NextResponse.json(
      {
        message:
          status === 429
            ? "Слишком много обращений. Попробуйте позднее."
            : "Не удалось отправить обращение. Попробуйте ещё раз.",
      },
      { status },
    );
  }

  const result = contactRequestResponseSchema.parse(await response.json());
  return NextResponse.json(result, {
    status: 202,
    headers: { "Cache-Control": "no-store" },
  });
}
