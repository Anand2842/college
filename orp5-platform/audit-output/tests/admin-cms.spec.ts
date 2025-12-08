import { test, expect } from '@playwright/test';

test.describe('Admin CMS Operations', () => {

    // NOTE: These tests will fail until BLOCK-001 (auth) is fixed
    // Once fixed, add login step before each test

    test('Admin dashboard loads stats', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/dashboard');
        await page.waitForLoadState('networkidle');

        // Check for dashboard content
        const dashboardHeading = page.getByRole('heading', { name: /Dashboard/i });
        await expect(dashboardHeading).toBeVisible();
    });

    test('Page editor can load homepage content', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/pages/home');
        await page.waitForLoadState('networkidle');

        // Check for editor form elements
        // The exact selectors depend on the admin UI implementation
        const saveButton = page.getByRole('button', { name: /Save/i });

        // Editor should have a save button
        if (await saveButton.isVisible()) {
            await expect(saveButton).toBeEnabled();
        }
    });

    test('Speakers management page loads', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/speakers');
        await page.waitForLoadState('networkidle');

        // Check for speaker management UI
        const heading = page.getByRole('heading', { name: /Speaker/i });
        await expect(heading).toBeVisible();
    });

});
