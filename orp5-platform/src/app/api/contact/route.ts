import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseAdmin();
        const body = await req.json();

        // Validate payload
        if (!body.full_name || !body.email || !body.message) {
            return NextResponse.json(
                { error: "Name, Email, and Message are required" },
                { status: 400 }
            );
        }

        const payload = {
            full_name: body.full_name,
            email: body.email,
            institution: body.institution || null,
            country: body.country || null,
            category: body.category || 'General Inquiry',
            message: body.message,
            is_read: false
        };

        const { error } = await (supabase.from('Inquiry') as any).insert([payload]);

        if (error) {
            console.error(`Error saving inquiry:`, error);
            return NextResponse.json({ error: "Failed to save your message. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Your message has been sent successfully." });
    } catch (e: any) {
        console.error(`Error in inquiry POST:`, e);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
}
