import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
                *,
                profiles (
                    display_name,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching blog posts:", error);
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = getSupabaseAdmin();

        // We need to set the author_id. For now, since we don't have session in API route easily
        // without passing it or decoding jwt, and this is an admin route,
        // we might just accept it from body or default to null.
        // In a real app we'd verify the user.

        // Sanitize body to remove fields that might not exist in DB yet (e.g. category)
        const { category, ...safeBody } = body;

        const { data, error } = await supabase
            .from('blog_posts')
            // @ts-ignore
            .insert([safeBody] as any)
            .select()
            .single();

        if (error) {
            console.error("Error creating blog post:", error);
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
