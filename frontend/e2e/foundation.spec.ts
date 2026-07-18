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

test("renders the foundation without horizontal overflow and returns security headers", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page);

  const response = await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Business OS: Digital Clinic",
  );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["content-security-policy"]).toContain("object-src 'none'");
  expect(response?.headers()["strict-transport-security"]).toContain("max-age=63072000");
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
