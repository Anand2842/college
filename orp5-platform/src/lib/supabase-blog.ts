import { supabase } from './supabase';

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    pdf_url?: string | null;
    author_id: string | null;
    is_published: boolean;
    published_at: string | null;
    tags: string[] | null;
    category?: string;
    created_at: string;
    updated_at: string;
};

export type BlogPostInput = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'published_at' | 'author_id'> & {
    published_at?: string | null;
    author_id?: string | null;
    pdf_url?: string | null;
    category?: string;
};

export async function getPublishedPosts(search?: string) {
    let query = supabase
        .from('blog_posts')
        .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }

    return data;
}

export async function getPostBySlug(slug: string) {
    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching blog post:', error);
        }
        return null;
    }

    return data;
}

// Admin functions

export async function getAllPosts() {
    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
      *,
      profiles (
        display_name
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all blog posts:', error);
        throw error;
    }

    return data;
}

export async function getPostById(id: string) {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching blog post by id:', error);
        throw error;
    }

    return data;
}

export async function getRelatedPosts(currentSlug: string, category?: string, limit = 3) {

    let query = supabase
        .from('blog_posts')
        .select(`
            *,
            profiles(display_name, avatar_url)
        `)
        .eq('is_published', true)
        .neq('slug', currentSlug) // Exclude current post
        .order('published_at', { ascending: false })
        .limit(limit);

    // If category exists, prioritize same category
    if (category && category !== 'General') {
        query = query.eq('category', category);
    }

    const { data } = await query;
    return data as BlogPost[] || [];
}

export async function createPost(post: BlogPostInput) {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

    if (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }

    return data;
}

export async function updatePost(id: string, post: Partial<BlogPostInput>) {
    const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }

    return data;
}

export async function deletePost(id: string) {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}
