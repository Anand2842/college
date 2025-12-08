# Release Checklist: ORP-5 Platform

## Pre-Release Verification

### Build & Lint
- [ ] `npm run lint` returns 0 errors
- [ ] `npm run build` succeeds without errors
- [ ] All TypeScript type checks pass

### Critical User Journeys
- [ ] **Homepage**: Loads with correct hero, speakers, themes
- [ ] **About**: Navigate from navbar, content renders
- [ ] **Registration Flow**:
  - [ ] Navigate to /registration
  - [ ] Fill form with test data
  - [ ] Submit form - should POST to /api/register
  - [ ] Verify success page shows REAL registration data (currently FAILING)
- [ ] **Speakers**: Page loads with speaker cards from database
- [ ] **Contact**: Form renders, submit sends data

### Admin Panel (CURRENTLY BLOCKING)
- [ ] **Auth Required**: /admin redirects to login if no session
- [ ] **Dashboard**: Displays stats correctly
- [ ] **Page Editor**: Can load, edit, and save page content
- [ ] **Speakers**: Can add/edit/remove speakers
- [ ] **Preview**: Changes reflect on public pages

### Media & Uploads
- [ ] Image upload via admin returns valid Supabase URL
- [ ] Uploaded images display correctly on frontend

### Performance Targets
- [ ] Lighthouse Mobile Score >= 50
- [ ] Lighthouse Desktop Score >= 85
- [ ] First Contentful Paint < 3s

### Accessibility
- [ ] No critical axe-core violations
- [ ] All interactive elements keyboard navigable
- [ ] Images have alt text

### Security
- [ ] No API keys in client bundle (check Network tab)
- [ ] Admin routes protected by authentication
- [ ] No exposed .env values in page source

---

## Deployment Steps

### Staging
1. Push to staging branch
2. Verify build succeeds on hosting platform
3. Run smoke tests on staging URL
4. Verify Supabase connection (check API responses)

### Production
1. Create release tag
2. Deploy to production
3. Verify critical journeys work
4. Monitor error tracking for 1 hour

### Rollback Plan
1. Revert to previous deployment via hosting dashboard
2. If database changes: restore from backup
3. Notify stakeholders of rollback
