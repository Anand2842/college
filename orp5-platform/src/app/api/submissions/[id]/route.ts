
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/utils/supabase/server';

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
        const { status, notes, moderatorName, title, abstract, category, theme, phone, institution, fileUrl } = body;

        const supabaseAdmin = getSupabaseAdmin();

        // ── CONTENT UPDATE (author resubmission / edit) ──────────────────────
        if (!status && (title || abstract)) {
            // Verify the caller is the owner of this submission
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

            // Fetch the submission first to verify ownership
            const { data: existing } = await supabaseAdmin
                .from('abstracts')
                .select('id, user_id, email, status')
                .eq('id', id)
                .single();

            if (!existing) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

            // Only allow edit if it's the owner AND status is revision or rejected
            const isOwner = existing.user_id === user.id || existing.email === user.email;
            const canEdit = ['revision', 'rejected', 'pending'].includes(existing.status);

            if (!isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            if (!canEdit) return NextResponse.json({ error: 'Cannot edit a submission that has been accepted' }, { status: 400 });

            const updatePayload: Record<string, any> = {
                updated_at: new Date().toISOString(),
                status: 'pending', // Always reset to pending on resubmission
            };
            if (title) updatePayload.title = title;
            if (abstract) updatePayload.abstract_text = abstract;
            if (category) updatePayload.category = category;
            if (theme) updatePayload.topic = theme;
            if (phone !== undefined) updatePayload.phone = phone;
            if (institution !== undefined) updatePayload.institution = institution;
            if (fileUrl !== undefined) updatePayload.file_url = fileUrl;

            // Strictly update only this specific row by primary key
            const { data, error } = await supabaseAdmin
                .from('abstracts')
                .update(updatePayload)
                .eq('id', id)           // Primary key filter
                .select()
                .single();

            if (error) throw error;

            // Add a system comment noting resubmission (non-critical — ignore errors)
            try {
                await supabaseAdmin
                    .from('submission_comments')
                    .insert({
                        submission_id: id,
                        author_name: data.author_name || 'Author',
                        author_role: 'author',
                        message: `[Resubmission] Author updated and resubmitted this abstract.`,
                    });
            } catch { /* non-critical */ }

            revalidatePath('/dashboard');
            revalidatePath('/moderator/dashboard');
            revalidatePath('/admin/submissions');

            return NextResponse.json({ success: true, submission: data });
        }

        // ── STATUS UPDATE (moderator/admin action) ────────────────────────────
        if (!status) {
            return NextResponse.json({ error: 'Status or content update required' }, { status: 400 });
        }

        // PRE-FLIGHT: Verify exactly 1 row exists with this ID before updating
        const { count, error: countError } = await supabaseAdmin
            .from('abstracts')
            .select('id', { count: 'exact', head: true })
            .eq('id', id);

        if (countError || count !== 1) {
            console.error(`[SAFETY] Expected 1 row for id=${id}, found ${count}`);
            return NextResponse.json({ error: 'Submission not found or duplicate ID detected' }, { status: 404 });
        }

        // Strictly update ONLY this row using the primary key (UUID)
        // .single() will throw if the DB somehow returns multiple rows
        const { data, error } = await supabaseAdmin
            .from('abstracts')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)           // Filter by UUID primary key — only one row
            .select()
            .single();              // Enforces single-row result, throws if multiple

        if (error) throw error;

        // Save notes as a comment if provided
        if (notes?.trim()) {
            await supabaseAdmin
                .from('submission_comments')
                .insert({
                    submission_id: id,
                    author_name: moderatorName || 'Review Committee',
                    author_role: 'moderator',
                    message: `[Status changed to: ${status.toUpperCase()}]\n\n${notes.trim()}`,
                });
        }

        // Send Email Notification
        if (data.email) {
            const { sendSubmissionStatusEmail } = await import('@/lib/email');
            sendSubmissionStatusEmail(
                data.email,
                data.author_name || data.authors || 'Author',
                data.title,
                status as any,
                notes || undefined
            ).catch((err: any) => console.error('Failed to send status email:', err));
        }

        // Revalidate caches
        revalidatePath('/dashboard');
        revalidatePath('/moderator/dashboard');
        revalidatePath('/admin/submissions');

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

        revalidatePath('/dashboard');
        revalidatePath('/moderator/dashboard');
        revalidatePath('/admin/submissions');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete submission error:', error);
        return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }
}
