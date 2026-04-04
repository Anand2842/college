
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submission details' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Send Email Notification
        if (data.email) {
            // Dynamically import to avoid circular dependencies if any
            const { sendSubmissionStatusEmail } = await import('@/lib/email');

            // Send email in background (don't await to keep response fast)
            sendSubmissionStatusEmail(
                data.email,
                data.authors || 'Author',
                data.title,
                status as any,
                undefined // notes not yet supported in UI
            ).catch(err => console.error('Failed to send status email:', err));
        }

        return NextResponse.json({ success: true, submission: data });
    } catch (error) {
        console.error('Update submission error:', error);
        return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const supabaseAdmin = getSupabaseAdmin();

        const { error } = await supabaseAdmin
            .from('abstracts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete submission error:', error);
        return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }
}
