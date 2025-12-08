import { test, expect } from '@playwright/test';

test('Auth: Login Page Loads', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); // Assuming /login or /admin/login
    // Adjust based on actual route. Trying /admin for now as it's common
    const response = await page.goto('/admin');

    // Expect redirection to login if not authenticated
    // and check for email/password fields
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
});
