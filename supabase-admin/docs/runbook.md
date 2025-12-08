# Supabase Admin Controls - Runbook

Complete deployment guide for the Supabase Admin Control System.

## Prerequisites

- Node.js 18+ installed
- Supabase CLI installed: `npm install -g supabase`
- A Supabase project (create at https://supabase.com/dashboard)

## Environment Variables

Create `supabase-admin/frontend/.env.local`:

```env
# Required - Get from Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For Edge Functions (set in Supabase Dashboard > Edge Functions > Secrets)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# SUPABASE_JWT_SECRET=your-jwt-secret
# SITE_URL=https://your-frontend-url.com
```

## Step 1: Database Setup

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations in order
cd supabase-admin/migrations
supabase db push --file 001_create_profiles.sql
supabase db push --file 002_create_registrations.sql
supabase db push --file 003_create_media.sql
supabase db push --file 004_create_audit_logs.sql
supabase db push --file 005_create_invitations.sql
supabase db push --file 006_rls_policies.sql
supabase db push --file 007_storage_buckets.sql
supabase db push --file 008_triggers.sql
```

Or run all at once:
```bash
cat migrations/*.sql | supabase db push
```

## Step 2: Create Storage Buckets

In Supabase Dashboard > Storage:

1. Create bucket `user-docs` (Private, 10MB limit)
2. Create bucket `avatars` (Public, 2MB limit)
3. Create bucket `exports` (Private, 50MB limit)

Or the migration `007_storage_buckets.sql` handles this.

## Step 3: Deploy Edge Functions

```bash
cd supabase-admin/edge-functions

# Set secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set SUPABASE_JWT_SECRET=your-jwt-secret
supabase secrets set SITE_URL=https://your-frontend-url.com

# Deploy functions
supabase functions deploy inviteUser
supabase functions deploy generateImpersonationToken
```

## Step 4: Frontend Setup

```bash
cd supabase-admin/frontend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## Step 5: Create First Admin User

1. Go to your frontend and click "Sign Up"
2. Create an account with email/password
3. In Supabase Dashboard > SQL Editor, run:

```sql
UPDATE profiles 
SET role = 'superadmin' 
WHERE email = 'your-admin-email@example.com';
```

## Step 6: Enable Realtime

In Supabase Dashboard > Database > Replication:

Enable for tables:
- `notifications`
- `registrations`

## Step 7: Configure Auth

In Supabase Dashboard > Authentication > URL Configuration:

- Site URL: `https://your-frontend-url.com`
- Redirect URLs: Add `https://your-frontend-url.com/**`

## Troubleshooting

### RLS Errors
If you get permission denied errors, verify:
1. User is authenticated
2. Profile exists in `profiles` table
3. RLS policies are correctly applied

### Storage Upload Errors
1. Verify bucket exists
2. Check storage policies are applied
3. Ensure file meets type/size restrictions

### Edge Function Errors
1. Check secrets are set: `supabase secrets list`
2. View logs: `supabase functions logs inviteUser`

## Reset Database (Development Only)

```sql
-- DANGER: This deletes all data
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Then re-run migrations.
