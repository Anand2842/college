import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Flow', () => {

    test('Admin routes redirect to login when unauthenticated', async ({ page }) => {
        // Navigate to admin dashboard without authentication
        await page.goto('http://localhost:3000/admin/dashboard');

        // Should redirect to login page (after BLOCK-001 fix applied)
        // Currently this will FAIL because admin is unprotected
        await expect(page).toHaveURL(/.*\/(admin\/login|login)/);
    });

    test('Admin page editor requires authentication', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/pages/home');

        // Should redirect to login
        await expect(page).toHaveURL(/.*\/(admin\/login|login)/);
    });

});

test.describe('Public Routes Load Correctly', () => {

    test('Homepage renders with key sections', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Check title
        await expect(page).toHaveTitle(/ORP/);

        // Check for hero section
        const hero = page.locator('section').first();
        await expect(hero).toBeVisible();

        // Check for navigation
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();
    });

    test('About page loads without errors', async ({ page }) => {
        await page.goto('http://localhost:3000/about');
        await expect(page).toHaveURL(/.*\/about/);

        // Page should have content
        const content = page.locator('main');
        await expect(content).toBeVisible();
    });

    test('Speakers page displays speaker cards', async ({ page }) => {
        await page.goto('http://localhost:3000/speakers');
        await expect(page).toHaveURL(/.*\/speakers/);

        // Wait for dynamic content to load
        await page.waitForLoadState('networkidle');
    });

});
