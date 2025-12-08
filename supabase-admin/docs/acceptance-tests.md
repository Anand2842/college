# Acceptance Tests

Step-by-step verification checklist for the Supabase Admin Control System.

## Test Credentials (Replace with actual)

```
Test User: user@test.com / password123
Test Moderator: moderator@test.com / password123
Test Admin: admin@test.com / password123
```

---

## 1. User Registration Flow

### 1.1 New User Signup
- [ ] Navigate to `/signup`
- [ ] Enter email, password, display name
- [ ] Click "Create Account"
- [ ] Verify confirmation email received
- [ ] Verify profile created in `profiles` table with `role = 'user'`

### 1.2 User Login
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Click "Sign In"
- [ ] Verify redirect to `/account`

---

## 2. Document Submission Flow

### 2.1 Submit Registration
- [ ] Login as test user
- [ ] Navigate to `/account`
- [ ] Fill out registration form
- [ ] Upload PDF and image files
- [ ] Click "Submit Registration"
- [ ] Verify success message

### 2.2 Verify Storage
- [ ] Check Supabase Storage `user-docs` bucket
- [ ] Verify file exists at `{user_id}/{registration_id}/filename.pdf`
- [ ] Verify `media` table has record with correct `uploader_id`

### 2.3 Verify Database
- [ ] Check `registrations` table
- [ ] Verify `status = 'pending'`
- [ ] Verify `user_id` matches authenticated user

---

## 3. Moderator Review Flow

### 3.1 View Queue
- [ ] Login as moderator
- [ ] Navigate to `/moderator`
- [ ] Verify pending registration appears in queue
- [ ] Verify realtime update when new submission arrives

### 3.2 Review Submission
- [ ] Click "Review" on a pending item
- [ ] Verify documents preview works
- [ ] Add review notes
- [ ] Click "Approve"
- [ ] Verify status changes to `approved`

### 3.3 Verify Audit Log
- [ ] Check `audit_logs` table
- [ ] Verify entry with `action = 'registration_status_change'`
- [ ] Verify `actor_id` is moderator's ID

### 3.4 Bulk Actions
- [ ] Select multiple registrations
- [ ] Click "Approve All"
- [ ] Verify all selected items are approved

---

## 4. Admin User Management

### 4.1 View Users
- [ ] Login as admin
- [ ] Navigate to `/admin/users`
- [ ] Verify all users are visible
- [ ] Test search functionality
- [ ] Test role filter

### 4.2 Change User Role
- [ ] Click on role badge for a user
- [ ] Select new role
- [ ] Enter reason in confirmation modal
- [ ] Click "Confirm Change"
- [ ] Verify role updated in UI
- [ ] Verify `audit_logs` entry created

### 4.3 Deactivate User
- [ ] Click action menu on a user
- [ ] Click "Deactivate"
- [ ] Verify `is_active = false` in database
- [ ] Verify user cannot login

---

## 5. Invitation System

### 5.1 Send Invitation
- [ ] Login as admin
- [ ] Navigate to `/admin/invitations`
- [ ] Click "Invite User"
- [ ] Enter email and select role
- [ ] Click "Send Invitation"
- [ ] Verify invitation created in `invitations` table
- [ ] Verify invite email sent (or copy token)

### 5.2 Accept Invitation
- [ ] Open invite link or navigate to `/auth/accept-invite?token=xxx`
- [ ] Complete signup
- [ ] Verify user created with invited role

---

## 6. RLS Enforcement

### 6.1 User Cannot Access Others' Data
- [ ] Login as user
- [ ] Try to query another user's registrations via browser console
- [ ] Verify empty result (RLS blocks)

### 6.2 Moderator Cannot Change Roles
- [ ] Login as moderator
- [ ] Navigate to `/admin/users`
- [ ] Verify access denied or redirect

### 6.3 Admin Can See All Data
- [ ] Login as admin
- [ ] Navigate to `/admin/registrations`
- [ ] Verify all registrations visible regardless of status

---

## 7. Impersonation

### 7.1 Start Impersonation
- [ ] Login as admin
- [ ] Navigate to `/admin/users`
- [ ] Click action menu on a user
- [ ] Click "Impersonate"
- [ ] Enter reason (min 10 chars)
- [ ] Click "Start Impersonation"
- [ ] Verify login URL generated

### 7.2 Verify Audit Trail
- [ ] Check `audit_logs` table
- [ ] Verify entry with `action = 'impersonation_started'`
- [ ] Verify `impersonated_user_id` is set

### 7.3 Use Impersonation Session
- [ ] Open login URL in new tab
- [ ] Verify logged in as target user
- [ ] Navigate and perform actions
- [ ] Close tab to end session

---

## 8. Audit Logs

### 8.1 View Logs
- [ ] Login as admin
- [ ] Navigate to `/admin/audit`
- [ ] Verify logs visible with filters
- [ ] Test search functionality
- [ ] Test action filter

### 8.2 Export CSV
- [ ] Click "Export CSV"
- [ ] Verify file downloads
- [ ] Open CSV and verify data

---

## 9. Notifications

### 9.1 Realtime Notifications
- [ ] Login as moderator in one browser
- [ ] Submit registration as user in another browser
- [ ] Verify notification appears for moderator

### 9.2 Mark as Read
- [ ] Click notification bell
- [ ] Click checkmark on notification
- [ ] Verify marked as read (styling changes)

---

## 10. Security Checks

### 10.1 File Upload Validation
- [ ] Try uploading .exe file
- [ ] Verify rejection
- [ ] Try uploading file > 10MB
- [ ] Verify rejection

### 10.2 API Rate Limiting
- [ ] Make rapid API calls
- [ ] Verify rate limiting (if configured)

### 10.3 JWT Expiration
- [ ] Wait for session to expire
- [ ] Try to make API call
- [ ] Verify 401 error and redirect to login

---

## Result Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| User Registration | | | |
| Document Submission | | | |
| Moderator Review | | | |
| Admin Management | | | |
| Invitations | | | |
| RLS Enforcement | | | |
| Impersonation | | | |
| Audit Logs | | | |
| Notifications | | | |
| Security | | | |

**Overall Result**: PASS / FAIL

**Tested By**: _______________

**Date**: _______________
