import { expect, test, type Page } from "@playwright/test";

function collectBrowserErrors(page: Page) {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  return browserErrors;
}

test("renders the homepage without broken media or horizontal overflow", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  const failedRequests: string[] = [];
  page.on("requestfailed", (request) => failedRequests.push(request.url()));

  const response = await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Диагностирую цифровые проблемы бизнеса",
  );
  await expect(page.getByText("Демонстрационная симуляция")).toBeVisible();
  await expect(page.getByText("Concept Project")).toBeVisible();
  await expect(page.locator('img[src*="hero-poster.svg"]')).toBeVisible();
  await expect(page.locator("[data-vitals-motion]")).toHaveAttribute(
    "data-motion-mode",
    "enhanced",
  );
  await expect(page.locator("[data-security-visual]")).toHaveAttribute(
    "data-motion-mode",
    "enhanced",
  );
  await expect(page.locator("[data-security-visual] canvas")).toHaveCount(1);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["content-security-policy"]).toContain("object-src 'none'");
  expect(response?.headers()["strict-transport-security"]).toContain("max-age=63072000");
  expect(failedRequests).toEqual([]);
  expect(browserErrors).toEqual([]);
});

test("keeps homepage navigation keyboard and mobile accessible", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Перейти к содержанию" })).toBeFocused();

  await page.locator("summary").click();
  await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Мобильная навигация" }).getByRole("link", {
      name: "Решения",
    }),
  ).toHaveAttribute("href", "/#solutions");
  await expect(page.locator("[data-security-visual]")).toHaveAttribute(
    "data-motion-mode",
    "compact",
  );
  await expect(page.locator("[data-security-visual] canvas")).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  expect(browserErrors).toEqual([]);
});

test("uses static homepage fallbacks when reduced motion is requested", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator('[data-motion-parallax="hero-media"]')).toHaveAttribute(
    "data-motion-mode",
    "reduced",
  );
  await expect(page.locator("[data-vitals-motion]")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator("[data-security-visual]")).toHaveAttribute(
    "data-motion-mode",
    "reduced",
  );
  await expect(page.locator("[data-security-visual] canvas")).toHaveCount(0);
  await expect(page.locator("[data-motion-reveal]").first()).toHaveAttribute(
    "data-motion-mode",
    "reduced",
  );

  const scanLineDisplay = await page
    .locator(".media-scan-line")
    .evaluate((element) => getComputedStyle(element).display);

  expect(scanLineDisplay).toBe("none");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-vitals-motion]")).toHaveAttribute(
    "data-motion-mode",
    "enhanced",
  );
  await expect(page.locator("[data-security-visual]")).toHaveAttribute(
    "data-motion-mode",
    "enhanced",
  );
  await expect(page.locator("[data-security-visual] canvas")).toHaveCount(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-vitals-motion]")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator("[data-security-visual]")).toHaveAttribute(
    "data-motion-mode",
    "reduced",
  );
  await expect(page.locator("[data-security-visual] canvas")).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});

test("completes the diagnostic without sending contact data", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  let evaluationPayload: Record<string, unknown> | undefined;

  await page.route("**/api/diagnostic/evaluate", async (route) => {
    evaluationPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      contentType: "application/json",
      json: {
        cases: ["Автоматизация обработки заявок", "Аналитический дашборд"],
        disclaimer:
          "Предварительная диагностика основана только на выбранных ответах и не заменяет полноценный аудит.",
        findings: [
          {
            code: "lead-loss",
            description: "Нужно проследить путь заявки от канала до ответственного.",
            severity: "HIGH",
            title: "Потери в обработке заявок",
          },
        ],
        implementationSequence: ["Подтвердить симптомы данными."],
        priorities: ["Потери в обработке заявок"],
        recommendations: ["Собрать единую воронку."],
        score: 48,
        services: ["Автоматизация"],
        status: "Высокое цифровое трение",
      },
      status: 200,
    });
  });

  await page.goto("/diagnostic");

  const choices = [
    "Услуги",
    "11–50",
    "Заявки теряются",
    "Регулярная",
    "Разрознены",
    "Устарел",
    "Вручную",
    "Ручные отчёты",
    "Эксперименты",
    "Регулярно",
    "Рост выручки",
  ];

  for (const choice of choices) {
    await page.getByText(choice, { exact: true }).click();
    await page.getByRole("button", { name: "Продолжить" }).click();
  }

  await page.getByRole("textbox", { name: "Имя" }).fill("Тестовый пользователь");
  await page.getByRole("textbox", { name: "Email" }).fill("private@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Получить предварительный результат" }).click();

  await expect(
    page.getByRole("heading", { name: "Предварительная карта цифрового здоровья" }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Business Health Score" })).toHaveAttribute(
    "aria-valuenow",
    "48",
  );
  expect(evaluationPayload).toBeDefined();
  expect(evaluationPayload).not.toHaveProperty("contactName");
  expect(evaluationPayload).not.toHaveProperty("contactEmail");
  expect(evaluationPayload).not.toHaveProperty("contactConsent");
  expect(Object.keys(evaluationPayload ?? {})).toHaveLength(11);
  expect(browserErrors).toEqual([]);
});

test("filters honest project cases and opens a detailed breakdown", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  await page.goto("/projects");

  await expect(page.getByRole("link", { name: "Открыть разбор" })).toHaveCount(6);
  await page.getByRole("button", { name: "Bots" }).click();
  await expect(page.getByText("Показано проектов: 1")).toBeVisible();
  await expect(page.getByText("Telegram-бот клиентского сервиса")).toBeVisible();
  await expect(page.getByText("Редизайн интернет-магазина")).toHaveCount(0);

  await page.getByRole("link", { name: "Открыть разбор" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Telegram-бот клиентского сервиса" }),
  ).toBeVisible();
  await expect(page.getByText("Personal Project")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Честное ограничение" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Что проверять, а не обещать" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  expect(browserErrors).toEqual([]);
});

test("keeps the design system accessible and responsive on a narrow viewport", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-system");

  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Клиническая точность UI",
  );
  await expect(
    page.getByRole("progressbar", { name: "Операционная устойчивость" }),
  ).toHaveAttribute("aria-valuenow", "82");
  await expect(page.getByRole("textbox", { name: "Рабочий email" })).toBeVisible();

  const viewportState = await page.evaluate(() => {
    const button = document.querySelector("button");
    const transitionDuration = button
      ? Number.parseFloat(getComputedStyle(button).transitionDuration) * 1000
      : Number.POSITIVE_INFINITY;

    return {
      hasHorizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
      transitionDuration,
    };
  });

  expect(viewportState.hasHorizontalOverflow).toBe(false);
  expect(viewportState.transitionDuration).toBeLessThanOrEqual(0.01);
  expect(browserErrors).toEqual([]);
});

test("runs the safe Security Center validation simulation without rendering input as markup", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page);
  let validationPayload: Record<string, unknown> | undefined;

  await page.route("**/api/security/input-validation", async (route) => {
    validationPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      contentType: "application/json",
      json: {
        explanation: "Симуляция ничего не выполняет и не определяет наличие уязвимости.",
        normalizedPreview: "<b>пример</b>",
        outcome: "REVIEW_REQUIRED",
        rules: [
          {
            code: "output-context",
            detail: "Разметкоподобный текст показывается только как текст.",
            label: "Контекст вывода",
            passed: false,
          },
        ],
      },
      status: 200,
    });
  });

  await page.goto("/security");

  await expect(page.locator("[data-security-control]")).toHaveCount(16);
  await page.getByRole("textbox", { name: "Учебный текст" }).fill("<b>пример</b>");
  await page.getByRole("button", { name: "Применить правила" }).click();
  await expect(page.getByRole("heading", { name: "Нужна проверка контекста" })).toBeVisible();
  await expect(page.locator("[data-validation-preview]")).toHaveText("<b>пример</b>");
  await expect(page.locator("[data-validation-preview] b")).toHaveCount(0);
  await expect(page.getByText(/DDoS нельзя остановить только Java-приложением/)).toBeVisible();
  expect(validationPayload).toEqual({ context: "SUPPORT_MESSAGE", value: "<b>пример</b>" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
  expect(browserErrors).toEqual([]);
});
