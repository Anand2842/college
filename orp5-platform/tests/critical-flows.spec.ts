import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {

    test('Homepage Loads and Navigation Works', async ({ page }) => {
        await page.goto('http://localhost:3000/');
        await expect(page).toHaveTitle(/ORP-5/);

        // Test About Link (patched behavior expected)
        const aboutLink = page.getByRole('link', { name: 'About', exact: true });
        await expect(aboutLink).toBeVisible();
        // Assuming patch 01 is applied, this should navigate
        // If not, this test will fail, correctly identifying the issue
        await aboutLink.click();
        await expect(page).toHaveURL(/.*\/about/);
    });

    test('Admin Access Redirects to Dashboard', async ({ page }) => {
        await page.goto('http://localhost:3000/admin');
        // Expect redirect to dashboard
        await expect(page).toHaveURL(/.*\/admin\/dashboard/);
        await expect(page.getByText('Dashboard')).toBeVisible();
    });

    test('Registration Page Loads Form', async ({ page }) => {
        await page.goto('http://localhost:3000/registration');
        // Expecting failure here due to build error, but script should run
        await expect(page.getByText('Registration Opens')).toBeVisible();

        // Check for categories
        const category = page.locator('.grid').first(); // Adjust selector based on actual generic "grid" or specific ID
        await expect(category).toBeVisible();

        // Check for form
        const fullNameInput = page.locator('input[name="fullName"]');
        await expect(fullNameInput).toBeVisible();
    });

    test('Footer Links are Valid', async ({ page }) => {
        await page.goto('http://localhost:3000/');
        const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
        await expect(privacyLink).not.toHaveAttribute('href', '#');
    });

});
