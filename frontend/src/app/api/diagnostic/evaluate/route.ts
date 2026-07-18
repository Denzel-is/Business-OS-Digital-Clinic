import { evaluateDiagnostic } from "@/lib/api/client";
import { diagnosticEvaluationRequestSchema } from "@/lib/api/contracts";

const maximumRequestBytes = 16_384;

function problem(status: number, title: string, detail: string) {
  return Response.json(
    {
      detail,
      status,
      title,
      type: "about:blank",
    },
    {
      headers: { "Cache-Control": "no-store" },
      status,
    },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maximumRequestBytes) {
    return problem(413, "Payload too large", "Диагностический запрос превышает допустимый размер.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return problem(400, "Malformed request", "Не удалось прочитать диагностические ответы.");
  }

  const parsed = diagnosticEvaluationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return problem(400, "Validation failed", "Проверьте, что заполнены все этапы диагностики.");
  }

  try {
    const result = await evaluateDiagnostic(parsed.data);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return problem(
      502,
      "Diagnostic unavailable",
      "Сервис диагностики временно недоступен. Ответы не были сохранены.",
    );
  }
}
