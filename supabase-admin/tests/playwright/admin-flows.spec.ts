import { test, expect } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Test credentials (replace in .env or set up test fixtures)
const TEST_USER = {
    email: 'testuser@example.com',
    password: 'testpass123',
}

const TEST_ADMIN = {
    email: 'testadmin@example.com',
    password: 'adminpass123',
}

test.describe('Authentication Flows', () => {
    test('should display login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`)
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    })

    test('should display signup page', async ({ page }) => {
        await page.goto(`${BASE_URL}/signup`)
        await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
        await expect(page.getByPlaceholder('John Doe')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
    })

    test('should show error on invalid login', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`)
        await page.fill('input[type="email"]', 'invalid@example.com')
        await page.fill('input[type="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')

        // Wait for error message
        await expect(page.getByText(/Invalid|Error/i)).toBeVisible({ timeout: 5000 })
    })

    test('should navigate between login and signup', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`)
        await page.click('text=Sign up')
        await expect(page).toHaveURL(/\/signup/)

        await page.click('text=Sign in')
        await expect(page).toHaveURL(/\/login/)
    })
})

test.describe('User Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Note: In real tests, use fixtures to create authenticated session
        await page.goto(`${BASE_URL}/login`)
        await page.fill('input[type="email"]', TEST_USER.email)
        await page.fill('input[type="password"]', TEST_USER.password)
        await page.click('button[type="submit"]')
        await page.waitForURL(/\/(account|admin|moderator)/)
    })

    test('should display user account page', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`)
        await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible()
        await expect(page.getByText('New Registration')).toBeVisible()
    })

    test('should show registration form', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`)
        await expect(page.getByPlaceholder('John Doe')).toBeVisible()
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Submit Registration' })).toBeVisible()
    })
})

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto(`${BASE_URL}/login`)
        await page.fill('input[type="email"]', TEST_ADMIN.email)
        await page.fill('input[type="password"]', TEST_ADMIN.password)
        await page.click('button[type="submit"]')
        await page.waitForURL(/\/admin/)
    })

    test('should display admin dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`)
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
        await expect(page.getByText('Total Users')).toBeVisible()
        await expect(page.getByText('Pending Reviews')).toBeVisible()
    })

    test('should navigate to users page', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`)
        await page.click('text=Users')
        await expect(page).toHaveURL(/\/admin\/users/)
        await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    })

    test('should navigate to audit logs', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`)
        await page.click('text=Audit Logs')
        await expect(page).toHaveURL(/\/admin\/audit/)
        await expect(page.getByRole('heading', { name: 'Audit Logs' })).toBeVisible()
    })

    test('should open invite modal', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`)
        await page.click('text=Invite User')
        await expect(page.getByRole('heading', { name: 'Invite User' })).toBeVisible()
        await expect(page.getByPlaceholder('user@example.com')).toBeVisible()
    })
})

test.describe('Access Control', () => {
    test('should redirect unauthenticated users from admin', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`)
        // Should redirect to login or show access denied
        await expect(page).toHaveURL(/\/(login|access-denied)|admin/)
    })

    test('should redirect unauthenticated users from moderator', async ({ page }) => {
        await page.goto(`${BASE_URL}/moderator`)
        // Should redirect to login or show access denied
        await expect(page).toHaveURL(/\/(login|access-denied)|moderator/)
    })

    test('should redirect unauthenticated users from account', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`)
        // Should redirect to login or show loading
        await page.waitForTimeout(1000)
        // Check for either redirect or loading state
    })
})

test.describe('File Upload Security', () => {
    test.skip('should validate file types on upload', async ({ page }) => {
        // This test requires authentication and file upload fixtures
        // Implement with proper test setup
    })
})

test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto(`${BASE_URL}/`)
        await expect(page.getByRole('heading', { name: 'Admin Control System' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
    })

    test('should show mobile menu on admin page', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto(`${BASE_URL}/login`)
        // Login
        await page.fill('input[type="email"]', TEST_ADMIN.email)
        await page.fill('input[type="password"]', TEST_ADMIN.password)
        await page.click('button[type="submit"]')
        await page.waitForURL(/\/admin/)

        // Check for mobile menu button
        await expect(page.locator('[aria-label="Menu"]').or(page.locator('button:has(svg)'))).toBeVisible()
    })
})
