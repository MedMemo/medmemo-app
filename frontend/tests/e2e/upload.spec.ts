import { test, expect } from "@playwright/test";

test("user can upload file through drag-drop UI", async ({ page }) => {
  await page.goto("http://localhost:3000"); // frontend dev server

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Browse Files").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("tests/files/test.txt"); // sample file

  // Check file appears in UI
  await expect(page.locator("text=test.txt")).toBeVisible();

  // (Optional) Wait for upload to finish
  await expect(page.locator("text=File uploaded successfully")).toBeVisible();
});
