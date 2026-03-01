import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/auth";
import { mockNotebooksApi } from "./helpers/mock-api";

test.describe("Dashboard", () => {
  test("authenticated user sees notebook cards and new notebook button", async ({ page }) => {
    await loginAsTestUser(page);
    await mockNotebooksApi(page);

    await page.goto("/dashboard");

    // Wait for notebook cards to render
    await expect(page.getByText("Machine Learning Basics")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("React Patterns")).toBeVisible();

    // New notebook button should be present
    const newBtn = page.getByRole("button", { name: /new/i }).or(
      page.getByRole("link", { name: /new/i })
    );
    await expect(newBtn.first()).toBeVisible();
  });
});
