# RLS Policies Documentation

This document explains the Row-Level Security (RLS) policies implemented in the Supabase Admin Control System.

## Role Hierarchy

```
superadmin > admin > moderator > user > anon
```

Helper functions:
- `get_user_role()`: Returns current user's role
- `has_role(required_role)`: Checks if user has role or higher
- `is_moderator()`: Shorthand for `has_role('moderator')`
- `is_admin()`: Shorthand for `has_role('admin')`

## Profiles Table

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| `profiles_select_own` | SELECT | authenticated | Own profile (`id = auth.uid()`) |
| `profiles_select_staff` | SELECT | moderator+ | All profiles |
| `profiles_update_own` | UPDATE | authenticated | Own profile, cannot change role |
| `profiles_update_admin` | UPDATE | admin+ | Any profile including role |

**Key Points:**
- Users can read/update their own profile
- Users cannot change their own role
- Only admins can change roles
- Role changes trigger audit log

## Registrations Table

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| `registrations_insert_own` | INSERT | authenticated | Only own registrations |
| `registrations_select_own` | SELECT | authenticated | Own registrations |
| `registrations_select_moderator` | SELECT | moderator+ | Pending/under_review/resubmit_requested |
| `registrations_select_admin` | SELECT | admin+ | All registrations |
| `registrations_update_moderator` | UPDATE | moderator+ | Status and notes only |
| `registrations_update_admin` | UPDATE | admin+ | All fields |
| `registrations_delete_admin` | DELETE | admin+ | Any registration |

**Key Points:**
- Users can only create registrations for themselves
- Moderators see registrations needing review
- Moderators can update status and notes
- Only admins can reassign or delete

## Media Table

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| `media_insert_own` | INSERT | authenticated | Own uploads only |
| `media_select_own` | SELECT | authenticated | Own files |
| `media_select_moderator` | SELECT | moderator+ | Files linked to reviewable registrations |
| `media_select_admin` | SELECT | admin+ | All files |
| `media_delete_own` | DELETE | authenticated | Own files (if not in approved registration) |
| `media_delete_admin` | DELETE | admin+ | Any file |

**Key Points:**
- Users can upload files to their own folder
- Users cannot delete files after registration is approved
- Moderators see files for registrations they can review

## Audit Logs Table

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| `audit_logs_select_moderator` | SELECT | moderator+ | Registration-related logs only |
| `audit_logs_select_admin` | SELECT | admin+ | All logs |
| `audit_logs_insert_authenticated` | INSERT | authenticated | All (via functions) |

**Key Points:**
- Audit logs are append-only (no updates or deletes)
- Moderators can see registration-related activity
- Admins can see all activity

## Invitations Table

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| `invitations_insert_admin` | INSERT | admin+ | Create invitations |
| `invitations_select_admin` | SELECT | admin+ | View all invitations |
| `invitations_update_admin` | UPDATE | admin+ | Revoke invitations |

**Key Points:**
- Only admins can manage invitations
- Invitation acceptance is handled by Edge Function with service role

## Storage Policies

### user-docs Bucket

| Policy | Action | Condition |
|--------|--------|-----------|
| `user_docs_insert_own` | INSERT | Path starts with `{user_id}/` |
| `user_docs_select_own` | SELECT | Path starts with `{user_id}/` |
| `user_docs_select_moderator` | SELECT | is_moderator() |
| `user_docs_select_admin` | SELECT | is_admin() |
| `user_docs_delete_own` | DELETE | Path starts with `{user_id}/` |
| `user_docs_delete_admin` | DELETE | is_admin() |

### avatars Bucket (Public)

| Policy | Action | Condition |
|--------|--------|-----------|
| `avatars_select_public` | SELECT | Public access |
| `avatars_insert_own` | INSERT | Path starts with `{user_id}/` |
| `avatars_update_own` | UPDATE | Path starts with `{user_id}/` |
| `avatars_delete_own` | DELETE | Path starts with `{user_id}/` |

### exports Bucket

| Policy | Action | Condition |
|--------|--------|-----------|
| `exports_*` | ALL | is_admin() only |

## Testing RLS

Test with Supabase CLI:

```bash
# As a specific user
supabase db test --file tests/rls_test.sql

# Or in SQL Editor
SET request.jwt.claims = '{"sub": "user-uuid-here"}';
SELECT * FROM profiles; -- Should only show own profile
```
