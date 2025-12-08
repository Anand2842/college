# Testing Guide

## Setup

### Install Dependencies

```bash
cd supabase-admin/frontend
npm install
npx playwright install
```

### Configure Test Environment

Create `.env.test` with test credentials:

```env
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=testpass123
TEST_ADMIN_EMAIL=testadmin@example.com
TEST_ADMIN_PASSWORD=adminpass123
```

### Create Test Users

Run in Supabase SQL Editor:

```sql
-- Create test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'testuser@example.com',
  crypt('testpass123', gen_salt('bf')),
  NOW()
);

-- Create test admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'testadmin@example.com',
  crypt('adminpass123', gen_salt('bf')),
  NOW()
);

-- Set admin role
UPDATE profiles SET role = 'admin' WHERE email = 'testadmin@example.com';
```

## Running Tests

### All Tests

```bash
npm run test
```

### With UI

```bash
npm run test:ui
```

### Specific Tests

```bash
npx playwright test admin-flows.spec.ts
npx playwright test --grep "login"
```

### Debug Mode

```bash
npx playwright test --debug
```

## Test Structure

```
tests/
└── playwright/
    └── admin-flows.spec.ts  # Main E2E tests
```

## Test Categories

### Authentication
- Login page display
- Signup page display
- Invalid login error
- Navigation between auth pages

### User Dashboard
- Account page display
- Registration form presence

### Admin Dashboard
- Dashboard display
- Navigation to users
- Navigation to audit logs
- Invite modal opening

### Access Control
- Unauthenticated redirect from admin
- Unauthenticated redirect from moderator
- Unauthenticated redirect from account

### Responsive Design
- Mobile viewport functionality
- Mobile menu display

## Adding New Tests

```typescript
test.describe('My New Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-page`)
    await expect(page.getByText('Expected Text')).toBeVisible()
  })
})
```

## CI Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: |
          cd supabase-admin/frontend
          npm ci
          npx playwright install --with-deps
      - name: Run tests
        run: |
          cd supabase-admin/frontend
          npm run test
        env:
          BASE_URL: http://localhost:3000
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```
