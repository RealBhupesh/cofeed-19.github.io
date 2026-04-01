import { Page } from "@playwright/test";

export const MOCK_FEED_URL = "https://example.com/feed.xml";

export const MOCK_RSS_FEED = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Test Article 1</title>
      <link>https://example.com/article1</link>
      <pubDate>Mon, 20 Feb 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Test Article 2</title>
      <link>https://example.com/article2</link>
      <pubDate>Sun, 19 Feb 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const getMockFeedItems = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const itemNumber = index + 1;
    return `
    <item>
      <title>Test Article ${itemNumber}</title>
      <link>https://example.com/article${itemNumber}</link>
      <pubDate>Mon, ${String(itemNumber).padStart(2, "0")} Feb 2026 00:00:00 GMT</pubDate>
    </item>`;
  }).join("");

export async function setupMockFeed(page: Page) {
  await page.route(MOCK_FEED_URL, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/rss+xml",
      body: MOCK_RSS_FEED,
    });
  });
}

export async function setupLargeMockFeed(page: Page, count = 25) {
  const feed = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Large Test Feed</title>
    <link>https://example.com</link>${getMockFeedItems(count)}
  </channel>
</rss>`;

  await page.route(MOCK_FEED_URL, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/rss+xml",
      body: feed,
    });
  });
}
