-- Migration: 003_create_media
-- Description: Creates the media table for linking uploaded files to storage
-- Supabase Admin Controls System

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    bucket TEXT NOT NULL DEFAULT 'user-docs',
    filename TEXT NOT NULL,
    url TEXT,
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    content_type TEXT NOT NULL,
    size INTEGER NOT NULL CHECK (size > 0 AND size <= 10485760), -- 10MB max
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_uploader_id ON public.media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_registration_id ON public.media(registration_id);
CREATE INDEX IF NOT EXISTS idx_media_bucket ON public.media(bucket);
CREATE INDEX IF NOT EXISTS idx_media_content_type ON public.media(content_type);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.media IS 'Metadata for uploaded files stored in Supabase Storage';
COMMENT ON COLUMN public.media.size IS 'File size in bytes, max 10MB (10485760 bytes)';
COMMENT ON COLUMN public.media.path IS 'Path within the storage bucket';
