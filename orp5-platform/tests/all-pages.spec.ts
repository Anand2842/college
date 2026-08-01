import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', title: /5th International Conference|ORP/i },
  { path: '/about', title: /About/i },
  { path: '/abstracts', title: /Abstracts|Call for Abstracts/i },
  { path: '/accommodation', title: /Accommodation/i },
  { path: '/awards', title: /Awards/i },
  { path: '/blog', title: /Blog|News/i },
  { path: '/brochure', title: /Brochure/i },
  { path: '/committees', title: /Committee|Organizing/i },
  { path: '/contact', title: /Contact/i },
  { path: '/exhibition', title: /Exhibition/i },
  { path: '/gallery', title: /Gallery/i },
  { path: '/how-to-reach', title: /How to Reach/i },
  { path: '/important-dates', title: /Important Dates/i },
  { path: '/privacy', title: /Privacy/i },
  { path: '/programme', title: /Programme|Schedule/i },
  { path: '/publications', title: /Publications/i },
  { path: '/registration', title: /Registration/i },
  { path: '/speakers', title: /Speakers/i },
  { path: '/sponsorship', title: /Sponsorship/i },
  { path: '/submission', title: /Submission/i },
  { path: '/submission-guidelines', title: /Guidelines/i },
  { path: '/terms', title: /Terms/i },
  { path: '/themes', title: /Themes/i },
  { path: '/venue', title: /Venue/i },
  { path: '/ticket-status', title: /Track|Status/i },
  { path: '/login', title: /Login|Sign in/i },
];

test.describe('Full Site Route Verification', () => {
  for (const pageConfig of pages) {
    test(`Route ${pageConfig.path} loads cleanly without console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(pageConfig.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);

      // Verify page title or primary headline
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 10000 });

      // Verify no uncaught console errors
      expect(consoleErrors.filter(e => !e.includes('GTM') && !e.includes('analytics'))).toEqual([]);
    });
  }
});
