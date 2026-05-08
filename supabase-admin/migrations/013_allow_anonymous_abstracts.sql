-- Migration: 013_allow_anonymous_abstracts
-- Description: Makes user_id optional for guest submissions and adds personal details fields

-- 1. Drop the NOT NULL constraint on user_id
ALTER TABLE public.abstracts ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add columns to store the author's details directly in the abstract
ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS institution TEXT;

-- 3. (Optional) Update RLS policies to allow anonymous inserts if necessary
-- Note: Since the API uses `supabaseAdmin` (Service Role Key), it bypasses RLS,
-- so we do not strictly need an RLS policy for anonymous inserts via the API.
