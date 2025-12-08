# Runbook: ORP5 Platform Pre-release Verification

## Required Credentials
- **Admin Login**: justfun2842@gmail.com / 123456789
- **Environment Variables** (if missing, mark checks as unverified):
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for admin operations)

## Environment Setup
```bash
cd orp5-platform
npm install
npx playwright install --with-deps
```

## Static Analysis Commands
```bash
# 1. Linting (capture warnings/errors)
npm run lint

# 2. Type Checking
npx tsc --noEmit

# 3. Build Verification
npm run build

# 4. Security Scan
grep -r "dangerouslySetInnerHTML\|innerHTML" src/
grep -r "NEXT_PUBLIC_" src/
```

## Automated Testing
```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run audit tests (if available)
npx playwright test tests/audit/ --headed=false

# Run all tests
npx playwright test
```

## Runtime Verification Steps
1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server should start on http://localhost:3000

2. **Authentication Testing**
   - Navigate to `/login`
   - Login with: justfun2842@gmail.com / 123456789
   - Verify redirect to `/admin/dashboard`
   - Try accessing `/admin/dashboard` in incognito (should redirect to login)

3. **Page Navigation Testing**
   - Visit all public pages from homepage navigation
   - Check console for JavaScript errors
   - Verify no 404/500 network errors in DevTools

4. **Admin Functionality Testing**
   - Login as admin
   - Test CMS editing on pages like `/admin/pages/home`
   - Verify data saves and appears on public pages
   - Test file uploads if applicable

5. **Registration Flow Testing**
   - Visit `/registration`
   - Fill out form and submit
   - Verify success page and email confirmation

## Performance & Accessibility Testing
```bash
# Lighthouse (requires Chrome/Chromium)
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Accessibility testing with axe-core
npx playwright test tests/audit-visual-a11y.spec.ts
```

## API Contract Verification
1. **Content APIs**: Check `/api/content/*` endpoints return expected JSON structure
2. **Registration API**: Test `/api/register` with valid/invalid data
3. **Admin APIs**: Verify `/api/admin/*` endpoints work with authentication

## Manual Verification Checklist
- [ ] All pages load without console errors
- [ ] Admin routes properly protected
- [ ] Forms submit successfully
- [ ] Responsive design works on mobile
- [ ] No broken images or links
- [ ] Content editable in admin panels
- [ ] Database connections working

## Common Issues & Troubleshooting
- **Build fails**: Check TypeScript errors, missing dependencies
- **Auth issues**: Verify Supabase credentials and RLS policies
- **CORS errors**: Check API routes and Supabase configuration
- **Test failures**: Ensure browsers installed and ports available

## Output Files to Capture
- `audit-lint-results.txt`: ESLint output
- `audit-typecheck-results.txt`: TypeScript check output
- `lighthouse-report.json`: Performance metrics
- `playwright-report/`: Test results
- Screenshots of critical pages and admin flows
