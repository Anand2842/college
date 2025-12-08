-- Migration: 004_create_audit_logs
-- Description: Creates the audit_logs table for governance and compliance
-- Supabase Admin Controls System

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT, -- Denormalized for historical record
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    before_data JSONB,
    after_data JSONB,
    reason TEXT, -- Required for role changes
    ip_address INET,
    user_agent TEXT,
    impersonated_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_table ON public.audit_logs(target_table);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_impersonated ON public.audit_logs(impersonated_user_id) WHERE impersonated_user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create helper function to log audit entries
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_actor_id UUID,
    p_action TEXT,
    p_target_table TEXT,
    p_target_id UUID DEFAULT NULL,
    p_before_data JSONB DEFAULT NULL,
    p_after_data JSONB DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_impersonated_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_actor_email TEXT;
    v_log_id UUID;
BEGIN
    -- Get actor email for denormalization
    SELECT email INTO v_actor_email FROM public.profiles WHERE id = p_actor_id;
    
    INSERT INTO public.audit_logs (
        actor_id, actor_email, action, target_table, target_id,
        before_data, after_data, reason, impersonated_user_id
    ) VALUES (
        p_actor_id, v_actor_email, p_action, p_target_table, p_target_id,
        p_before_data, p_after_data, p_reason, p_impersonated_user_id
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail for all privileged actions';
COMMENT ON COLUMN public.audit_logs.impersonated_user_id IS 'If action was performed while impersonating, the target user ID';
COMMENT ON COLUMN public.audit_logs.reason IS 'Required explanation for role changes and sensitive actions';
