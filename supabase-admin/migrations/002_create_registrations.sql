-- Migration: 002_create_registrations
-- Description: Creates the registrations table for document submissions workflow
-- Supabase Admin Controls System

-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'resubmit_requested')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    priority INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_assigned_to ON public.registrations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_registrations_submitted_at ON public.registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_tags ON public.registrations USING GIN(tags);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Apply updated_at trigger
CREATE TRIGGER on_registrations_updated
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.registrations IS 'User registration/document submissions with approval workflow';
COMMENT ON COLUMN public.registrations.status IS 'Workflow status: pending, under_review, approved, rejected, resubmit_requested';
COMMENT ON COLUMN public.registrations.data IS 'JSONB field for flexible form data storage';
