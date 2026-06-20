import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = getSupabaseAdmin();
    
    // Check abstracts
    const { data: abstracts, error: absError } = await supabase.from('abstracts').select('*');
    
    // Exact moderator query
    const { data: moderatorData, error: moderatorError } = await supabase.from('abstracts').select(`
        *,
        profiles:user_id (email, display_name)
    `).in('status', ['pending', 'under_review']).order('created_at', { ascending: true });

    return NextResponse.json({
        moderatorData,
        moderatorError,
        abstracts_count: abstracts?.length || 0,
        abstracts_data: abstracts,
        absError,
    });
}
