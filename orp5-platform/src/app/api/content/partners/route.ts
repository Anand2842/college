export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { invalidateHomepageCache } from '@/lib/cms';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from('Partner').select('*').order('order');
        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error fetching partners' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseAdmin();
        const body = await req.json();

        if (Array.isArray(body)) {
            // Bulk update partners
            for (let i = 0; i < body.length; i++) {
                const p = body[i];
                await supabase.from('Partner').upsert({
                    id: p.id || crypto.randomUUID(),
                    name: p.name,
                    logoUrl: p.logoUrl || p.imageUrl || '',
                    website: p.website || '',
                    category: p.category || 'Supported by',
                    order: p.order !== undefined ? p.order : i,
                    updatedAt: new Date().toISOString()
                });
            }
        } else if (body && body.name) {
            // Single partner upsert
            await supabase.from('Partner').upsert({
                id: body.id || crypto.randomUUID(),
                name: body.name,
                logoUrl: body.logoUrl || body.imageUrl || '',
                website: body.website || '',
                category: body.category || 'Supported by',
                order: body.order || 0,
                updatedAt: new Date().toISOString()
            });
        }

        invalidateHomepageCache();
        revalidatePath('/');
        revalidatePath('/about');

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error saving partners' }, { status: 500 });
    }
}
