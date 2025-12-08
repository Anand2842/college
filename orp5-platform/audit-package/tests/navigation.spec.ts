import { test, expect } from '@playwright/test';

test('Navigation: Links are functional', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const links = await page.getByRole('link').all();
    for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('mailto') && !href.startsWith('tel')) {
            // Just check they are not empty or #
            expect(href).not.toBe('');
            expect(href).not.toBe('#');
        }
    }
});
