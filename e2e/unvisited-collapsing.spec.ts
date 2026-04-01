import { test, expect } from "./fixtures";
import { MOCK_FEED_URL, setupLargeMockFeed } from "./helpers/mockFeeds";

test.describe("Unvisited List Collapsing", () => {
  test("should show first 20 items and collapse the rest", async ({ page }) => {
    await setupLargeMockFeed(page, 25);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('[data-testid="new-item"]:visible')).toHaveCount(20);
    const hiddenItemsSummary = page.locator(
      'summary:has-text("See other 5 unvisited")'
    );
    await expect(hiddenItemsSummary).toBeVisible();

    await hiddenItemsSummary.click();
    await expect(page.locator('[data-testid="new-item"]:visible')).toHaveCount(25);
  });
});
