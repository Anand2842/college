-- Migration: 008_triggers
-- Description: Database triggers for automatic audit logging and data integrity
-- Supabase Admin Controls System

-- =============================================================================
-- ROLE CHANGE AUDIT TRIGGER
-- =============================================================================

-- Automatically log role changes to audit_logs
CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if role actually changed
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        INSERT INTO public.audit_logs (
            actor_id,
            actor_email,
            action,
            target_table,
            target_id,
            before_data,
            after_data
        ) VALUES (
            auth.uid(),
            (SELECT email FROM public.profiles WHERE id = auth.uid()),
            'role_change',
            'profiles',
            NEW.id,
            jsonb_build_object('role', OLD.role, 'is_active', OLD.is_active),
            jsonb_build_object('role', NEW.role, 'is_active', NEW.is_active)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_role_change
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_active IS DISTINCT FROM NEW.is_active)
    EXECUTE FUNCTION public.audit_role_change();

-- =============================================================================
-- REGISTRATION STATUS CHANGE AUDIT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.audit_registration_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.audit_logs (
            actor_id,
            actor_email,
            action,
            target_table,
            target_id,
            before_data,
            after_data
        ) VALUES (
            auth.uid(),
            (SELECT email FROM public.profiles WHERE id = auth.uid()),
            'registration_status_change',
            'registrations',
            NEW.id,
            jsonb_build_object(
                'status', OLD.status,
                'assigned_to', OLD.assigned_to,
                'review_notes', OLD.review_notes
            ),
            jsonb_build_object(
                'status', NEW.status,
                'assigned_to', NEW.assigned_to,
                'review_notes', NEW.review_notes,
                'reviewed_at', NEW.reviewed_at
            )
        );
    END IF;
    
    -- Auto-set reviewed_at when status changes from pending
    IF OLD.status = 'pending' AND NEW.status != 'pending' AND NEW.reviewed_at IS NULL THEN
        NEW.reviewed_at := NOW();
    END IF;
    
    -- Auto-assign to current moderator if not assigned
    IF NEW.status = 'under_review' AND NEW.assigned_to IS NULL THEN
        NEW.assigned_to := auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_registration_status_change
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_registration_status_change();

-- =============================================================================
-- NOTIFICATION TRIGGER (Optional - for realtime)
-- =============================================================================

-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read) WHERE NOT read;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "notifications_select_own"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "notifications_update_own"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- System can insert notifications
CREATE POLICY "notifications_insert_system"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Function to notify moderators of new registrations
CREATE OR REPLACE FUNCTION public.notify_new_registration()
RETURNS TRIGGER AS $$
DECLARE
    moderator RECORD;
BEGIN
    -- Notify all active moderators and admins
    FOR moderator IN
        SELECT id FROM public.profiles
        WHERE role IN ('moderator', 'admin', 'superadmin')
        AND is_active = true
    LOOP
        INSERT INTO public.notifications (user_id, type, title, message, data)
        VALUES (
            moderator.id,
            'new_registration',
            'New Registration Submitted',
            'A new registration is pending review.',
            jsonb_build_object('registration_id', NEW.id, 'user_id', NEW.user_id)
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_registration
    AFTER INSERT ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_registration();

-- Function to notify user of registration status update
CREATE OR REPLACE FUNCTION public.notify_registration_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, type, title, message, data)
        VALUES (
            NEW.user_id,
            'registration_update',
            'Registration Status Updated',
            CASE NEW.status
                WHEN 'approved' THEN 'Your registration has been approved!'
                WHEN 'rejected' THEN 'Your registration was not approved.'
                WHEN 'under_review' THEN 'Your registration is now under review.'
                WHEN 'resubmit_requested' THEN 'Please update and resubmit your registration.'
                ELSE 'Your registration status has been updated.'
            END,
            jsonb_build_object(
                'registration_id', NEW.id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'review_notes', NEW.review_notes
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_registration_update_notify
    AFTER UPDATE ON public.registrations
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.notify_registration_update();
