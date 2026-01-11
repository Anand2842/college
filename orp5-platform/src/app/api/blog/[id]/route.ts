import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = getSupabaseAdmin();

        // Sanitize body to remove fields that might not exist in DB yet (e.g. category)
        const { category, ...safeBody } = JSON.parse(JSON.stringify(body));

        const { data, error } = await supabase
            .from('blog_posts')
            // @ts-ignore
            .update(safeBody as any)
            .eq('id', id)
            .select('id, title, slug, content, excerpt, cover_image, is_published, published_at, created_at, updated_at, author_id')
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
