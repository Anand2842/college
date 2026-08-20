import { test } from '@playwright/test';

const pages = [
  '/',
  '/about',
  '/about/city',
  '/speakers',
  '/themes',
  '/programme',
  '/important-dates',
  '/venue',
  '/how-to-reach',
  '/accommodation',
  '/registration',
  '/registration/ticket',
  '/registration/pay',
  '/registration/success',
  '/submission',
  '/submission-guidelines',
  '/committees',
  '/awards',
  '/gallery',
  '/brochure',
  '/publications',
  '/sponsorship',
  '/exhibition',
  '/abstracts',
  '/contact',
  '/privacy',
  '/terms',
  '/blog',
  '/login',
  '/forgot-password',
  '/ticket-status',
  '/dashboard',
];

const results: { page: string; loadTime: number; transferSize: number; domContentLoaded: number; firstPaint: number; status: string }[] = [];

for (const route of pages) {
  test(`Load speed: ${route}`, async ({ page }) => {
    const startTime = Date.now();
    const response = await page.goto(`http://localhost:3000${route}`, {
      waitUntil: 'load',
      timeout: 60000,
    });

    const loadTime = Date.now() - startTime;

    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const firstPaint = paint.find(p => p.name === 'first-paint')?.startTime ?? 0;
      return {
        domContentLoaded: (nav?.domContentLoadedEventEnd - nav?.startTime) || 0,
        transferSize: nav?.transferSize ?? 0,
        firstPaint,
      };

    });

    const status = response?.status() ?? 0;
    const ok = status >= 200 && status < 400;

    const result = {
      page: route,
      loadTime,
      transferSize: perf.transferSize,
      domContentLoaded: Math.round(perf.domContentLoaded),
      firstPaint: Math.round(perf.firstPaint),
      status: ok ? 'OK' : `FAIL(${status})`,
    };
    results.push(result);

    console.log(
      `${result.status} ${route.padEnd(28)} | Total: ${String(loadTime).padStart(5)}ms | DOM Ready: ${String(result.domContentLoaded).padStart(5)}ms | First Paint: ${String(result.firstPaint).padStart(5)}ms | Size: ${(perf.transferSize / 1024).toFixed(1)}KB`
    );
  });
}

test('Print summary table', async () => {
  await new Promise(r => setTimeout(r, 100));
  console.log('\n========== PAGE LOAD SPEED SUMMARY ==========');
  console.log(
    'Page'.padEnd(30) +
    'Load(ms)'.padStart(10) +
    'DOM(ms)'.padStart(10) +
    'FP(ms)'.padStart(10) +
    'Size(KB)'.padStart(10) +
    'Status'.padStart(10)
  );
  console.log('-'.repeat(80));

  const sorted = [...results].sort((a, b) => b.loadTime - a.loadTime);
  for (const r of sorted) {
    console.log(
      r.page.padEnd(30) +
      String(r.loadTime).padStart(10) +
      String(r.domContentLoaded).padStart(10) +
      String(r.firstPaint).padStart(10) +
      (r.transferSize / 1024).toFixed(1).padStart(10) +
      r.status.padStart(10)
    );
  }

  const avg = sorted.reduce((s, r) => s + r.loadTime, 0) / sorted.length;
  const slowest = sorted[0];
  const fastest = sorted[sorted.length - 1];
  console.log('-'.repeat(80));
  console.log(`Average: ${Math.round(avg)}ms | Slowest: ${slowest.page} (${slowest.loadTime}ms) | Fastest: ${fastest.page} (${fastest.loadTime}ms)`);
});
