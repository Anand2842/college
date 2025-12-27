-- Migration: 014_allow_public_registration_inserts
-- Description: Adds RLS policy to allow public (anonymous) and authenticated users to submit registrations
-- Supabase Admin Controls System

-- Allow public inserts
CREATE POLICY "registrations_insert_public"
    ON public.registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Comment
COMMENT ON POLICY "registrations_insert_public" ON public.registrations IS 'Allows anyone (including guests) to submit a new registration form.';
