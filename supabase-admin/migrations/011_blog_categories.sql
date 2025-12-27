-- Add category column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Add an index for faster filtering by category
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
