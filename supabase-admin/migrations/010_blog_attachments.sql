-- Migration: 010_blog_attachments
-- Description: Add pdf_url column to blog_posts

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

COMMENT ON COLUMN public.blog_posts.pdf_url IS 'URL to an attached PDF file for the blog post';
