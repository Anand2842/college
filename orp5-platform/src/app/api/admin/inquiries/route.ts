import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// GET all inquiries
export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('Inquiry')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('Error fetching inquiries:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}
