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

        const { data, error } = await supabase
            .from('blog_posts')
            // @ts-ignore
            .update(body as any)
            .eq('id', id)
            .select()
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
