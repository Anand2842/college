-- Migration: 012_create_abstracts
-- Description: Creates the abstracts table for paper submissions
-- Participant Portal Feature

-- Create abstracts table
CREATE TABLE IF NOT EXISTS public.abstracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    abstract_text TEXT NOT NULL,
    category TEXT NOT NULL,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'revision_requested')),
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_abstracts_user_id ON public.abstracts(user_id);
CREATE INDEX IF NOT EXISTS idx_abstracts_status ON public.abstracts(status);

-- Enable RLS
ALTER TABLE public.abstracts ENABLE ROW LEVEL SECURITY;

-- Apply updated_at trigger
CREATE TRIGGER on_abstracts_updated
    BEFORE UPDATE ON public.abstracts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies

-- Users can insert their own abstracts
CREATE POLICY "abstracts_insert_own"
    ON public.abstracts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can view their own abstracts
CREATE POLICY "abstracts_select_own"
    ON public.abstracts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins/Moderators can view all abstracts
CREATE POLICY "abstracts_select_admin"
    ON public.abstracts FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'moderator', 'superadmin')
        )
    );

-- Admins/Moderators can update abstracts (for reviews)
CREATE POLICY "abstracts_update_admin"
    ON public.abstracts FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'moderator', 'superadmin')
        )
    );

COMMENT ON TABLE public.abstracts IS 'Scientific paper/abstract submissions linked to user accounts';
