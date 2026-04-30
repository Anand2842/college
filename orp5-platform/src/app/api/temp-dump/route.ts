import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from('Page').select('content').eq('slug', 'awards').single() as any;
        if (data) {
            fs.writeFileSync(path.join(process.cwd(), 'awards_data.json'), JSON.stringify(data.content, null, 2));
            return NextResponse.json({ success: true, message: "Dumped to awards_data.json" });
        }
        return NextResponse.json({ error }, { status: 500 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
