-- Migration: 013_make_registration_user_id_nullable
-- Description: Makes user_id nullable in registrations table to support public/guest registrations
-- Supabase Admin Controls System

-- Make user_id nullable
ALTER TABLE public.registrations ALTER COLUMN user_id DROP NOT NULL;

-- Comment
COMMENT ON COLUMN public.registrations.user_id IS 'User ID of the registrant. Nullable for guest/public registrations.';
