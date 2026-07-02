const { chromium, devices } = require('playwright');

const iPhone = devices['iPhone 12 Pro'];

const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Registration', path: '/registration' },
  { name: 'Speakers', path: '/speakers' },
  { name: 'Committees', path: '/committees' },
  { name: 'Contact', path: '/contact' },
  { name: 'Programme', path: '/programme' },
  { name: 'Themes', path: '/themes' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Blog', path: '/blog' },
  { name: 'Accommodation', path: '/accommodation' },
  { name: 'How to Reach', path: '/how-to-reach' },
  { name: 'Important Dates', path: '/important-dates' },
  { name: 'Publications', path: '/publications' },
  { name: 'Awards', path: '/awards' },
  { name: 'Sponsorship', path: '/sponsorship' },
  { name: 'Exhibition', path: '/exhibition' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms', path: '/terms' },
  { name: 'Venue', path: '/venue' },
  { name: 'Abstracts', path: '/abstracts' },
  { name: 'Submission Guidelines', path: '/submission-guidelines' },
  { name: 'Ticket Status', path: '/ticket-status' },
  { name: 'Feed', path: '/feed.xml' }
];

const BASE_URL = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...iPhone,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  const issues = [];

  for (const p of pages) {
    const url = `${BASE_URL}${p.path}`;
    console.log(`\n📱 Testing: ${p.name} (${url})`);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = response ? response.status() : 'N/A';
      console.log(`   Status: ${status}`);

      // Check for common mobile UI issues
      const pageIssues = await page.evaluate(() => {
        const results = [];

        // Check for horizontal overflow
        if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
          results.push({
            type: 'HORIZONTAL_OVERFLOW',
            detail: `Page width ${document.documentElement.scrollWidth}px exceeds viewport ${document.documentElement.clientWidth}px`
          });
        }

        // Check for elements overflowing viewport
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 10) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? `.${String(el.className).split(' ').slice(0, 2).join('.')}` : '';
            results.push({
              type: 'ELEMENT_OVERFLOW',
              detail: `<${tag}${cls}> overflows right edge (right: ${Math.round(rect.right)}px, viewport: ${window.innerWidth}px)`
            });
          }
        }

        // Check for text too small to read
        const textElements = document.querySelectorAll('p, span, a, li, td, th, label, h1, h2, h3, h4, h5, h6');
        for (const el of textElements) {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize < 12 && el.textContent.trim().length > 0) {
            results.push({
              type: 'SMALL_TEXT',
              detail: `<${el.tagName.toLowerCase()}> has font-size ${fontSize}px: "${el.textContent.trim().substring(0, 50)}"`
            });
          }
        }

        // Check for tap targets too small (less than 44x44 for mobile)
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        for (const el of interactiveElements) {
          const rect = el.getBoundingClientRect();
          if ((rect.width > 0 && rect.width < 44) || (rect.height > 0 && rect.height < 44)) {
            const tag = el.tagName.toLowerCase();
            const text = el.textContent.trim().substring(0, 30);
            results.push({
              type: 'SMALL_TAP_TARGET',
              detail: `<${tag}> "${text}" is ${Math.round(rect.width)}x${Math.round(rect.height)}px (min 44x44)`
            });
          }
        }

        // Check for missing alt attributes on images
        const images = document.querySelectorAll('img');
        for (const img of images) {
          if (!img.alt && img.alt !== '') {
            results.push({
              type: 'MISSING_ALT',
              detail: `<img> missing alt attribute: src=${img.src.substring(0, 80)}`
            });
          }
        }

        // Check for fixed positioned elements blocking content
        const fixedElements = document.querySelectorAll('*');
        for (const el of fixedElements) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && el.offsetHeight > 200) {
            const tag = el.tagName.toLowerCase();
            results.push({
              type: 'LARGE_FIXED_ELEMENT',
              detail: `<${tag}> is fixed and ${Math.round(el.offsetHeight)}px tall — may block content`
            });
          }
        }

        // Check for overlapping elements (z-index issues)
        const buttons = document.querySelectorAll('button, a.btn, a[class*="button"], a[class*="cta"]');
        for (const btn of buttons) {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const topEl = document.elementFromPoint(centerX, centerY);
          if (topEl && topEl !== btn && !btn.contains(topEl) && !topEl.contains(btn)) {
            results.push({
              type: 'OVERLAPPING_ELEMENT',
              detail: `Button/link "${btn.textContent.trim().substring(0, 30)}" is covered by <${topEl.tagName.toLowerCase()}>`
            });
          }
        }

        // Check for broken CSS (layout issues)
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        if (computedStyle.overflowX === 'auto' || computedStyle.overflowX === 'scroll') {
          results.push({
            type: 'BODY_SCROLL',
            detail: 'Body has horizontal scroll'
          });
        }

        // Check for long words causing overflow
        const textNodes = document.querySelectorAll('p, div, span, td, li, h1, h2, h3, h4, h5, h6');
        for (const node of textNodes) {
          const text = node.textContent;
          if (text) {
            const words = text.split(/\s+/);
            for (const word of words) {
              if (word.length > 30) {
                results.push({
                  type: 'LONG_WORD',
                  detail: `Long word "${word.substring(0, 40)}..." may cause overflow`
                });
              }
            }
          }
        }

        return results;
      });

      if (pageIssues.length > 0) {
        console.log(`   ⚠️  Found ${pageIssues.length} issues:`);
        const uniqueIssues = {};
        for (const issue of pageIssues) {
          if (!uniqueIssues[issue.type]) {
            uniqueIssues[issue.type] = [];
          }
          uniqueIssues[issue.type].push(issue.detail);
        }
        for (const [type, details] of Object.entries(uniqueIssues)) {
          console.log(`   - ${type}: ${details.length} occurrence(s)`);
          for (const detail of details.slice(0, 3)) {
            console.log(`     ${detail}`);
          }
          if (details.length > 3) {
            console.log(`     ... and ${details.length - 3} more`);
          }
        }
        issues.push({ page: p.name, url: p.path, issues: uniqueIssues, count: pageIssues.length });
      } else {
        console.log(`   ✅ No issues found`);
      }

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Take screenshot
      await page.screenshot({ 
        path: `/Users/anand/Downloads/10 dec college/college/orp5-platform/screenshots/mobile-${p.path.replace(/\//g, '_') || 'home'}.png`,
        fullPage: false 
      });

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      issues.push({ page: p.name, url: p.path, error: error.message });
    }
  }

  // Summary
  console.log('\n\n📊 MOBILE UI/UX AUDIT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total pages tested: ${pages.length}`);
  console.log(`Pages with issues: ${issues.length}`);
  console.log(`Pages without issues: ${pages.length - issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n📋 Issues by page:');
    for (const issue of issues) {
      console.log(`\n  ${issue.page} (${issue.url}):`);
      if (issue.error) {
        console.log(`    ❌ ${issue.error}`);
      } else {
        for (const [type, details] of Object.entries(issue.issues)) {
          console.log(`    - ${type}: ${details.length} issue(s)`);
        }
      }
    }
  }

  await browser.close();
})();
