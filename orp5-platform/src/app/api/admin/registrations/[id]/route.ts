import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client directly to avoid type issues
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
);

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { payment_status, payment_date, payment_mode, notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
        }

        // First, get the current registration
        const { data: current, error: fetchError } = await supabaseAdmin
            .from('registrations')
            .select('data')
            .eq('id', id)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        const currentData = current.data as Record<string, unknown>;

        // Update the data JSONB with payment info
        const updatedData: Record<string, any> = {
            ...currentData,
            payment_status: payment_status || currentData.payment_status,
            payment_date: payment_date || new Date().toISOString(),
            payment_mode: payment_mode || 'Manual Admin Update',
            admin_notes: notes || null
        };

        // Also update the top-level status if payment is confirmed
        const updatePayload: Record<string, unknown> = { data: updatedData };
        if (payment_status === 'paid') {
            updatePayload.status = 'approved';
        }

        const { error: updateError } = await supabaseAdmin
            .from('registrations')
            .update(updatePayload)
            .eq('id', id);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
        }

        // Send Email Notification if marked as PAID
        if (payment_status === 'paid' && updatedData.email) {
            const { sendRegistrationStatusEmail } = await import('@/lib/email');

            sendRegistrationStatusEmail(
                updatedData.email as string,
                (updatedData.full_name || updatedData.fullName) as string || 'Attendee',
                updatedData.ticket_number as string,
                'paid'
            ).catch(err => console.error('Failed to send registration email:', err));
        }

        return NextResponse.json({
            success: true,
            message: `Payment status updated to ${payment_status}`,
            registrationId: id
        });
    } catch (error: unknown) {
        console.error('Error updating payment:', error);
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('registrations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Registration deleted successfully' });
    } catch (error) {
        console.error('Error deleting registration:', error);
        return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
    }
}
