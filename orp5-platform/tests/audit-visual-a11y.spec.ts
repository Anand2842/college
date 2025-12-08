import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

const PAGES = [
    { path: '/', name: 'home' },
    { path: '/registration', name: 'registration' },
    { path: '/admin/dashboard', name: 'admin_dashboard' },
    { path: '/about', name: 'about' }
];

test.describe('Audit Visual & A11y', () => {
    const violationsRaw: any[] = [];

    test.afterAll(() => {
        fs.writeFileSync('../evidence/a11y.json', JSON.stringify(violationsRaw, null, 2));
    });

    for (const { path, name } of PAGES) {
        test(`Analyze ${name} (${path})`, async ({ page }) => {
            await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 5000 });

            // Visual - Screenshot
            await page.screenshot({ path: `../evidence/screenshots/${name}.png`, fullPage: true });

            // A11y - Axe
            try {
                const accessibilityScanResults = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .analyze();

                if (accessibilityScanResults.violations.length > 0) {
                    violationsRaw.push({
                        page: name,
                        url: path,
                        violations: accessibilityScanResults.violations
                    });
                }
            } catch (e) {
                console.log(`Axe failed for ${name}: ${e}`);
            }
        });
    }
});
