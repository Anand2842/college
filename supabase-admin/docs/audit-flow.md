# Audit Flow Documentation

This document explains how audit logging works in the Supabase Admin Control System.

## Overview

All privileged actions are automatically logged to the `audit_logs` table with:
- Who performed the action (actor)
- What was changed (before/after data)
- Why it was done (reason)
- When it happened (timestamp)

## Audit Log Schema

```sql
audit_logs (
  id UUID PRIMARY KEY,
  actor_id UUID,           -- Who performed the action
  actor_email TEXT,        -- Denormalized for historical record
  action TEXT,             -- Action type (e.g., 'role_change')
  target_table TEXT,       -- Which table was affected
  target_id UUID,          -- Which record was affected
  before_data JSONB,       -- State before change
  after_data JSONB,        -- State after change
  reason TEXT,             -- Required for role changes
  ip_address INET,         -- Client IP (if captured)
  user_agent TEXT,         -- Client browser (if captured)
  impersonated_user_id UUID, -- If admin was impersonating
  created_at TIMESTAMPTZ   -- When it happened
)
```

## Automatic Logging (Triggers)

### Role Changes
When a user's role is changed in `profiles`:

```sql
-- Trigger: on_profile_role_change
INSERT INTO audit_logs (actor_id, action, target_table, target_id, before_data, after_data)
VALUES (auth.uid(), 'role_change', 'profiles', NEW.id, 
  {role: OLD.role}, {role: NEW.role});
```

### Registration Status Changes
When a registration status is updated:

```sql
-- Trigger: on_registration_status_change
INSERT INTO audit_logs (actor_id, action, target_table, target_id, before_data, after_data)
VALUES (auth.uid(), 'registration_status_change', 'registrations', NEW.id,
  {status: OLD.status, notes: OLD.review_notes},
  {status: NEW.status, notes: NEW.review_notes});
```

## Manual Logging (Application)

For actions requiring a reason (like role changes), the frontend uses the `create_audit_log` function:

```typescript
await supabase.rpc('create_audit_log', {
  p_actor_id: currentUser.id,
  p_action: 'role_change',
  p_target_table: 'profiles',
  p_target_id: targetUser.id,
  p_before_data: { role: 'user' },
  p_after_data: { role: 'moderator' },
  p_reason: 'Promoted to moderator for Q4 review team',
});
```

## Action Types

| Action | Description | Required Fields |
|--------|-------------|-----------------|
| `role_change` | User role changed | before_data, after_data, reason |
| `registration_status_change` | Registration approved/rejected | before_data, after_data |
| `user_invited` | New user invited | after_data (email, role) |
| `invitation_accepted` | Invite link used | after_data (accepted_by) |
| `impersonation_started` | Admin started impersonating | impersonated_user_id, reason |
| `user_deactivated` | Account disabled | before_data, after_data |
| `user_activated` | Account enabled | before_data, after_data |

## Impersonation Tracking

When an admin impersonates a user, all actions performed during that session have `impersonated_user_id` set:

```sql
-- Actions by admin while impersonating
{
  actor_id: 'admin-uuid',           -- The actual admin
  impersonated_user_id: 'user-uuid', -- Who they're pretending to be
  action: 'some_action',
  ...
}
```

This allows filtering to find all actions performed during impersonation sessions.

## Viewing Audit Logs

### In Admin UI
Navigate to `/admin/audit` to:
- Search by actor, action, or target
- Filter by action type
- Expand entries to see before/after data
- Export to CSV

### Direct Database Query

```sql
-- View recent role changes
SELECT 
  created_at,
  actor_email,
  target_id,
  before_data->>'role' as old_role,
  after_data->>'role' as new_role,
  reason
FROM audit_logs
WHERE action = 'role_change'
ORDER BY created_at DESC
LIMIT 50;

-- Find all impersonation sessions
SELECT 
  created_at,
  actor_email,
  impersonated_user_id,
  reason
FROM audit_logs
WHERE impersonated_user_id IS NOT NULL
ORDER BY created_at DESC;
```

## Retention Policy

Audit logs are append-only and should not be deleted. For compliance:
- No UPDATE or DELETE policies on `audit_logs`
- Regular backups recommended
- Consider archiving old logs to cold storage

## Best Practices

1. **Always provide a reason** for role changes
2. **Never delete audit logs** - they're your compliance record
3. **Review regularly** - check for unusual activity
4. **Export periodically** - for offline audit requirements
