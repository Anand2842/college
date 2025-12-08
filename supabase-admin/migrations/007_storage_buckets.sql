-- Migration: 007_storage_buckets
-- Description: Creates storage buckets and policies for file uploads
-- Supabase Admin Controls System

-- Note: Storage buckets are created via Supabase Dashboard or SQL
-- Below are the policies to apply after bucket creation

-- =============================================================================
-- CREATE BUCKETS (Run in Supabase Dashboard > Storage > New Bucket)
-- =============================================================================
-- Bucket: user-docs (Private, 10MB limit)
-- Bucket: avatars (Public, 2MB limit)
-- Bucket: exports (Private, 50MB limit)

-- Or via SQL (Supabase allows this in some versions):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('user-docs', 'user-docs', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']),
    ('avatars', 'avatars', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']),
    ('exports', 'exports', false, 52428800, ARRAY['text/csv', 'application/json'])
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- USER-DOCS BUCKET POLICIES
-- =============================================================================

-- Users can upload to their own folder: user-docs/{user_id}/*
CREATE POLICY "user_docs_insert_own"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'user-docs'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can view their own files
CREATE POLICY "user_docs_select_own"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-docs'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Moderators can view files for registrations they can access
CREATE POLICY "user_docs_select_moderator"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-docs'
        AND public.is_moderator()
    );

-- Admins can view all user-docs
CREATE POLICY "user_docs_select_admin"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-docs'
        AND public.is_admin()
    );

-- Users can delete their own files
CREATE POLICY "user_docs_delete_own"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user-docs'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Admins can delete any user-docs
CREATE POLICY "user_docs_delete_admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user-docs'
        AND public.is_admin()
    );

-- =============================================================================
-- AVATARS BUCKET POLICIES (Public bucket)
-- =============================================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "avatars_select_public"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "avatars_insert_own"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can update their own avatar
CREATE POLICY "avatars_update_own"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can delete their own avatar
CREATE POLICY "avatars_delete_own"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- =============================================================================
-- EXPORTS BUCKET POLICIES
-- =============================================================================

-- Only admins can upload exports
CREATE POLICY "exports_insert_admin"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'exports'
        AND public.is_admin()
    );

-- Only admins can view exports
CREATE POLICY "exports_select_admin"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'exports'
        AND public.is_admin()
    );

-- Only admins can delete exports
CREATE POLICY "exports_delete_admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'exports'
        AND public.is_admin()
    );
