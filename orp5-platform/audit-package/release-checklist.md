# Release Checklist

## Critical User Journeys
- [ ] Visitor can view Homepage without errors.
- [ ] Visitor can navigate to all primary menu items (About, Speakers, Programme, etc).
- [ ] Visitor can view Speaker details.
- [ ] Visitor can likely register (Button leads to form).
- [ ] Admin can log in (Untested).
- [ ] Admin can upload file (UI Verified).

## Launch Requirements
- [ ] **Fix Broken Links**: Scan for `href="#"` and replace.
- [ ] **SEO**: Ensure `title` and `description` are unique for every page.
- [ ] **Security**: Verify `NEXT_PUBLIC_SUPABASE_URL` is set in production.
- [ ] **Performance**: Run Lighthouse on production URL (Mobile Score > 70).
- [ ] **Analytics**: Verify GA/GTM tags if required.

## Rollback Plan
1. Keep previous deployment active in Vercel.
2. If critical bug found, "Promote" previous deployment instantly.
