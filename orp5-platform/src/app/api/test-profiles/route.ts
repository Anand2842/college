import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = getSupabaseAdmin();
    const { data: profiles, error } = await supabase.from('profiles').select('*');
    return NextResponse.json({ profiles, error });
}
