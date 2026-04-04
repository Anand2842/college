import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// PATCH to update is_read status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = getSupabaseAdmin();
        const body = await req.json();

        // params.id is available, but Next.js 15+ may require `await params` in some contexts. We use it directly here.
        const id = params.id;

        const { data, error } = await (supabase.from('Inquiry') as any)
            .update({ is_read: body.is_read })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating inquiry:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}
