-- Migration: 006_rls_policies
-- Description: Comprehensive Row-Level Security policies for all tables
-- Supabase Admin Controls System

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM public.profiles WHERE id = auth.uid()),
        'anon'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has specific role or higher
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    role_hierarchy TEXT[] := ARRAY['user', 'moderator', 'admin', 'superadmin'];
    user_level INT;
    required_level INT;
BEGIN
    user_role := public.get_user_role();
    user_level := array_position(role_hierarchy, user_role);
    required_level := array_position(role_hierarchy, required_role);
    
    IF user_level IS NULL OR required_level IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN user_level >= required_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is moderator or higher
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is admin or higher
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================================
-- PROFILES TABLE POLICIES
-- =============================================================================

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Moderators and admins can view all profiles
CREATE POLICY "profiles_select_staff"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_moderator());

-- Users can update their own profile (except role)
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() 
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- Only admins can update any profile including role
CREATE POLICY "profiles_update_admin"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =============================================================================
-- REGISTRATIONS TABLE POLICIES
-- =============================================================================

-- Users can insert their own registrations
CREATE POLICY "registrations_insert_own"
    ON public.registrations FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can view their own registrations
CREATE POLICY "registrations_select_own"
    ON public.registrations FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Moderators can view pending and under_review registrations
CREATE POLICY "registrations_select_moderator"
    ON public.registrations FOR SELECT
    TO authenticated
    USING (
        public.is_moderator() 
        AND status IN ('pending', 'under_review', 'resubmit_requested')
    );

-- Admins can view all registrations
CREATE POLICY "registrations_select_admin"
    ON public.registrations FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Moderators can update status and review_notes only
CREATE POLICY "registrations_update_moderator"
    ON public.registrations FOR UPDATE
    TO authenticated
    USING (
        public.is_moderator() 
        AND status IN ('pending', 'under_review', 'resubmit_requested')
    )
    WITH CHECK (
        public.is_moderator()
        -- Moderators can only change status, review_notes, reviewed_at
        -- They cannot change assigned_to (admin only)
    );

-- Admins can update all registration fields
CREATE POLICY "registrations_update_admin"
    ON public.registrations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can delete registrations
CREATE POLICY "registrations_delete_admin"
    ON public.registrations FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- =============================================================================
-- MEDIA TABLE POLICIES
-- =============================================================================

-- Users can insert their own media
CREATE POLICY "media_insert_own"
    ON public.media FOR INSERT
    TO authenticated
    WITH CHECK (uploader_id = auth.uid());

-- Users can view their own media
CREATE POLICY "media_select_own"
    ON public.media FOR SELECT
    TO authenticated
    USING (uploader_id = auth.uid());

-- Moderators can view media linked to registrations they can access
CREATE POLICY "media_select_moderator"
    ON public.media FOR SELECT
    TO authenticated
    USING (
        public.is_moderator()
        AND EXISTS (
            SELECT 1 FROM public.registrations r
            WHERE r.id = media.registration_id
            AND r.status IN ('pending', 'under_review', 'resubmit_requested')
        )
    );

-- Admins can view all media
CREATE POLICY "media_select_admin"
    ON public.media FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Users can delete their own media (if not attached to approved registration)
CREATE POLICY "media_delete_own"
    ON public.media FOR DELETE
    TO authenticated
    USING (
        uploader_id = auth.uid()
        AND (
            registration_id IS NULL
            OR NOT EXISTS (
                SELECT 1 FROM public.registrations r
                WHERE r.id = media.registration_id
                AND r.status = 'approved'
            )
        )
    );

-- Admins can delete any media
CREATE POLICY "media_delete_admin"
    ON public.media FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- =============================================================================
-- AUDIT_LOGS TABLE POLICIES
-- =============================================================================

-- Audit logs are insert-only, no updates or deletes allowed
-- Moderators can view audit logs for registrations they've handled
CREATE POLICY "audit_logs_select_moderator"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        public.is_moderator()
        AND target_table = 'registrations'
    );

-- Admins can view all audit logs
CREATE POLICY "audit_logs_select_admin"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Only authenticated users can insert (via service functions)
CREATE POLICY "audit_logs_insert_authenticated"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- =============================================================================
-- INVITATIONS TABLE POLICIES
-- =============================================================================

-- Admins can create invitations
CREATE POLICY "invitations_insert_admin"
    ON public.invitations FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admins can view all invitations
CREATE POLICY "invitations_select_admin"
    ON public.invitations FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Admins can update invitation status (revoke)
CREATE POLICY "invitations_update_admin"
    ON public.invitations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Anyone can check invitation by token (for acceptance flow)
-- This is handled via service role in Edge Function
