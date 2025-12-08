# Supabase Admin Control System

A complete, frontend-only admin control surface built with Supabase, featuring role-based access control, document management, and moderator workflows.

## Features

- **🔐 Role-Based Access Control**: Users → Moderators → Admins hierarchy with RLS enforcement
- **📝 Document Submission**: Users submit documents; moderators review; admins oversee
- **👥 User Management**: Invite users, assign roles, deactivate accounts
- **📊 Admin Dashboard**: Stats, metrics, and quick actions
- **🔔 Realtime Notifications**: Instant updates for new submissions
- **📋 Audit Logging**: Complete trail of all privileged actions
- **👤 Impersonation**: Admin debugging feature with audit trail
- **📁 Secure Storage**: RLS-protected file uploads

## Quick Start

### 1. Clone and Install

```bash
cd supabase-admin/frontend
npm install
```

### 2. Configure Environment

```bash
cp ../supabase.env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run Migrations

```bash
# Using Supabase CLI
cd ../migrations
supabase db push

# Or run SQL files manually in Supabase Dashboard
```

### 4. Start Development Server

```bash
npm run dev
```

## Project Structure

```
supabase-admin/
├── migrations/           # SQL migrations
│   ├── 001_create_profiles.sql
│   ├── 002_create_registrations.sql
│   ├── 003_create_media.sql
│   ├── 004_create_audit_logs.sql
│   ├── 005_create_invitations.sql
│   ├── 006_rls_policies.sql
│   ├── 007_storage_buckets.sql
│   └── 008_triggers.sql
├── edge-functions/       # Supabase Edge Functions
│   ├── inviteUser/
│   └── generateImpersonationToken/
├── frontend/             # Next.js application
│   └── src/
│       ├── app/          # Pages
│       ├── components/   # React components
│       ├── hooks/        # Custom hooks
│       └── services/     # Supabase client
├── docs/                 # Documentation
│   ├── runbook.md
│   ├── rls-policies.md
│   └── acceptance-tests.md
├── tests/                # Playwright tests
└── supabase.env.example  # Environment template
```

## Role Hierarchy

| Role | Permissions |
|------|-------------|
| `user` | Submit registrations, view own data |
| `moderator` | Review pending registrations, add notes |
| `admin` | Manage users, roles, view all data |
| `superadmin` | All admin + invite admins |

## Key Components

### Layouts
- `AdminLayout` - Admin dashboard shell
- `ModeratorLayout` - Moderator dashboard shell
- `UserAccountLayout` - User dashboard shell

### Components
- `RoleToggleButton` - Role management with confirmation
- `InvitationModal` - User invitation UI
- `ImpersonationModal` - Admin impersonation UI
- `ModeratorQueue` - Registration review queue
- `AuditLogViewer` - Audit log display
- `RegistrationForm` - Document submission form
- `MediaPreview` - PDF/image preview modal
- `PermissionGuard` - Route protection wrapper

## Edge Functions

### inviteUser
Secure user invitation with role assignment.

```bash
supabase functions deploy inviteUser
```

### generateImpersonationToken
Admin impersonation with audit trail.

```bash
supabase functions deploy generateImpersonationToken
```

## Testing

```bash
# Run Playwright tests
npm run test

# Run with UI
npm run test:ui
```

## Deployment

See [docs/runbook.md](docs/runbook.md) for complete deployment instructions.

### Quick Deploy

1. Create Supabase project
2. Run migrations
3. Deploy Edge Functions
4. Configure auth URLs
5. Deploy frontend to Vercel/Netlify

## Security

- **RLS Policies**: All tables protected with row-level security
- **Service Role**: Never exposed to client; only in Edge Functions
- **Audit Trail**: All privileged actions logged
- **File Validation**: Type and size checks on uploads

## Documentation

- [Runbook](docs/runbook.md) - Deployment guide
- [RLS Policies](docs/rls-policies.md) - Security documentation
- [Acceptance Tests](docs/acceptance-tests.md) - Testing checklist

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)
- **Testing**: Playwright

## License

MIT
