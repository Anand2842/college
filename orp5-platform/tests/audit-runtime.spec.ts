import { test, expect } from '@playwright/test';
import fs from 'fs';

const TARGET_URLS = [
    '/',
    '/about',
    '/committees',
    '/registration',
    '/admin', // Should redirect or show login
    '/admin/dashboard', // Should be protected
    '/sponsorship',
    '/contact'
];

test.describe('Audit Runtime Crawler', () => {
    const consoleErrors: string[] = [];
    const validConsoleErrors: string[] = [];
    const networkFailures: string[] = [];
    const mockUsage: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Capture Console
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                const text = msg.text();
                // Filter out unimportant noisy warnings if needed
                consoleErrors.push(`[${msg.type()}] ${page.url()}: ${text}`);
            }
        });

        // Capture Network
        page.on('requestfailed', request => {
            networkFailures.push(`[FAILED] ${request.url()} - ${request.failure()?.errorText}`);
        });

        page.on('response', response => {
            if (response.status() >= 400) {
                networkFailures.push(`[${response.status()}] ${response.url()}`);
            }
        });
    });

    test.afterAll(() => {
        // Write report
        const report = {
            consoleErrors,
            networkFailures,
            mockUsage
        };
        fs.writeFileSync('../evidence/orp5-platform/runtime-audit.json', JSON.stringify(report, null, 2));
    });

    for (const path of TARGET_URLS) {
        test(`Crawl ${path}`, async ({ page }) => {
            try {
                await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 10000 });

                // Check for Mock Data
                const content = await page.content();
                if (content.includes('Lorem ipsum') || content.includes('placeholder.com')) {
                    mockUsage.push(`${path}: Found Lorem ipsum or placeholder.com`);
                }

                // Additional mock check
                const visibleText = await page.evaluate(() => document.body.innerText);
                if (visibleText.includes('Mock Data')) {
                    mockUsage.push(`${path}: Found "Mock Data" text`);
                }

            } catch (e) {
                console.log(`Failed to load ${path}: ${e}`);
                networkFailures.push(`[LOAD_FAIL] ${path}: ${e}`);
            }
        });
    }
});
