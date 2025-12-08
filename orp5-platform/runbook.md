# Runbook: Pre-release Frontend Verification

## Environment Setup
Required Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: (Supabase URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Supabase Anon Key)
*Note: If these are missing, some runtime verification steps may fail or rely on mocks.*

## Static Analysis
Run these commands from the project root:

```bash
# 1. Linting
npm run lint > audit-lint-results.txt

# 2. Type Checking
npx tsc --noEmit > audit-typecheck-results.txt

# 3. Security Scan (Manual Grep)
grep -r "dangerouslySetInnerHTML" src > audit-security-innerhtml.txt
grep -r "NEXT_PUBLIC_" src > audit-env-usage.txt
```

## Automated Tests
```bash
# Install dependencies
npx playwright install chromium

# Run specific audit tests
npx playwright test tests/audit --reporter=json > audit-test-results.json
```

## Runtime Verification
1. Start dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Check Console for errors.
4. Check Network tab for 4xx/5xx errors.
