import { test, expect } from "./fixtures";
import { MOCK_FEED_URL, setupLargeMockFeed } from "./helpers/mockFeeds";

test.describe("Unvisited List Collapsing", () => {
  test("should show first 20 items and expand the rest with consistent spacing", async ({
    page,
  }) => {
    await setupLargeMockFeed(page, 25);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('[data-testid="new-item"]:visible')).toHaveCount(
      20
    );
    const hiddenItemsSummary = page.locator(
      'summary:has-text("See other 5 unvisited")'
    );
    await expect(hiddenItemsSummary).toBeVisible();

    await hiddenItemsSummary.click();
    await expect(page.locator('[data-testid="new-item"]:visible')).toHaveCount(
      25
    );

    const { bounds, expectedGap } = await page
      .getByTestId("new-item")
      .evaluateAll((items) => ({
        bounds: items.map((item) => {
          const { top, bottom } = item.getBoundingClientRect();
          return { top, bottom };
        }),
        expectedGap: parseFloat(getComputedStyle(items[0]).fontSize) * 0.5,
      }));

    // Measure every row gap in both lists, including the formerly hidden rows.
    for (const listBounds of [bounds.slice(0, 20), bounds.slice(20)]) {
      for (let index = 1; index < listBounds.length; index++) {
        const gap = listBounds[index].top - listBounds[index - 1].bottom;
        expect(gap).toBeCloseTo(expectedGap, 0);
      }
    }

    const summaryBottom = await hiddenItemsSummary.evaluate(
      (summary) => summary.getBoundingClientRect().bottom
    );
    const summaryToFirstHiddenItemGap = bounds[20].top - summaryBottom;
    expect(summaryToFirstHiddenItemGap).toBeGreaterThanOrEqual(0);
    expect(summaryToFirstHiddenItemGap).toBeLessThanOrEqual(expectedGap + 1);
  });
});
