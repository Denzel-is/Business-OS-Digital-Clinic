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
  ).toHaveAttribute("href", "#solutions");
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
