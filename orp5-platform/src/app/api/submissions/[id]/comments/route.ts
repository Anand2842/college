import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/utils/supabase/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabaseAdmin = getSupabaseAdmin();

        // Verify caller is authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data, error } = await supabaseAdmin
            .from('submission_comments')
            .select('*')
            .eq('submission_id', id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Comments GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch comments', details: error?.message }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { message, authorName, authorRole } = body;

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Verify caller is authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get profile role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const resolvedRole = authorRole || profile?.role || 'author';

        const supabaseAdmin = getSupabaseAdmin();

        // Insert comment
        const { data: comment, error } = await supabaseAdmin
            .from('submission_comments')
            .insert({
                submission_id: id,
                author_id: user.id,
                author_name: authorName || user.email || 'Unknown',
                author_role: resolvedRole,
                message: message.trim(),
            })
            .select()
            .single();

        if (error) throw error;

        // Fetch the submission to get author info for email notification
        const { data: submission } = await supabaseAdmin
            .from('abstracts')
            .select('title, email, author_name, user_id')
            .eq('id', id)
            .single();

        // Send email notification
        if (submission) {
            const { sendCommentNotificationEmail } = await import('@/lib/email');

            if (resolvedRole === 'moderator' || resolvedRole === 'admin' || resolvedRole === 'superadmin') {
                // Notify the author
                if (submission.email) {
                    sendCommentNotificationEmail(
                        submission.email,
                        submission.author_name || 'Author',
                        submission.title,
                        resolvedRole,
                        message.trim(),
                        id
                    ).catch((err: any) => console.error('Failed to send comment email to author:', err));
                }
            } else {
                // Author replied — notify admin/moderator
                const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
                if (adminEmail) {
                    sendCommentNotificationEmail(
                        adminEmail,
                        'Moderator',
                        submission.title,
                        'author',
                        message.trim(),
                        id
                    ).catch((err: any) => console.error('Failed to send author reply notification:', err));
                }
            }
        }

        return NextResponse.json({ success: true, comment });
    } catch (error: any) {
        console.error('Comments POST error:', error);
        return NextResponse.json({ error: 'Failed to post comment', details: error?.message }, { status: 500 });
    }
}
