# Runbook: ORP-5 Platform Audit

## Prerequisites

```bash
# Required environment variables (add to .env)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # For admin operations
NEXT_PUBLIC_SITE_URL=https://your-production-url.com  # For metadataBase
```

## Quick Audit Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Lint Check
```bash
npm run lint
# Expected: 0 errors, ~50 warnings (acceptable)
```

### 3. Type Check
```bash
npx tsc --noEmit
# Expected: No errors
```

### 4. Production Build
```bash
npm run build
# Expected: Success with metadataBase warning only
```

### 5. Run Tests
```bash
# Start dev server first (in separate terminal)
npm run dev

# Run Playwright tests
npx playwright test tests/critical-flows.spec.ts
# Expected: 4/4 tests passing
```

### 6. Lighthouse Audit (requires production server)
```bash
npm run build && npm run start
# In new terminal:
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```

### 7. Accessibility Audit
```bash
# Install axe-cli if not present
npm install -g @axe-core/cli

# Run accessibility check
axe http://localhost:3000 --exit
```

## Manual Verification Checklist

1. Open http://localhost:3000 in incognito
2. Navigate to all main pages (About, Registration, Speakers, etc.)
3. Open DevTools > Console - note any errors
4. Open DevTools > Network - check for failed requests
5. Visit http://localhost:3000/admin - verify auth behavior
6. Test registration form submission
7. Test admin page editing (if auth implemented)

## CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/audit.yml
name: Pre-Release Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - name: Run Playwright tests
        run: npx playwright test
```

## Security Scan
```bash
# Check for exposed secrets
grep -r "SUPABASE" --include="*.tsx" --include="*.ts" src/
# Should only find NEXT_PUBLIC_* references
```
