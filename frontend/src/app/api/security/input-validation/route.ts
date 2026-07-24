import { evaluateInputValidation } from "@/lib/api/client";
import { inputValidationRequestSchema } from "@/lib/api/contracts";

const maximumRequestBytes = 4096;

function problem(status: number, title: string, detail: string) {
  return Response.json(
    { detail, status, title, type: "about:blank" },
    { headers: { "Cache-Control": "no-store" }, status },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maximumRequestBytes) {
    return problem(413, "Payload too large", "Учебный запрос превышает допустимый размер.");
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return problem(400, "Malformed request", "Не удалось прочитать учебный запрос.");
  }

  if (new TextEncoder().encode(rawBody).byteLength > maximumRequestBytes) {
    return problem(413, "Payload too large", "Учебный запрос превышает допустимый размер.");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return problem(400, "Malformed request", "Не удалось прочитать учебный запрос.");
  }

  const parsed = inputValidationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return problem(400, "Validation failed", "Проверьте контекст и текст до 240 символов.");
  }

  try {
    return Response.json(await evaluateInputValidation(parsed.data), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return problem(502, "Simulation unavailable", "Учебная проверка временно недоступна.");
  }
}
