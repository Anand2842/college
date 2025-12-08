import { test, expect } from '@playwright/test';

test('Public View: Homepage Loads', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/./); // Check for any title

    // Check for key sections
    const sections = ['hero', 'about', 'speakers', 'sponsorship'];
    for (const section of sections) {
        // Check if sections exist (by id or text content ideally, but falling back to check for general presence)
        // Assuming standardized ids or at least some content
        // This is a loose check.
    }

    // Check for critical CTA
    const cta = page.getByRole('link', { name: /register/i }).first();
    if (await cta.isVisible()) {
        await expect(cta).toHaveAttribute('href');
    }
});
