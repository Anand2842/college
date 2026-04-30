import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_ADMIN_EMAIL || 'orp5admin@gmail.com';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { amount_paid, proof_url } = body;

        if (!id) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }
        if (!amount_paid || isNaN(Number(amount_paid)) || Number(amount_paid) <= 0) {
            return NextResponse.json({ error: 'Valid amount_paid is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // 1. Fetch registration by ticket_number
        const { data: existing, error: fetchErr } = await supabase
            .from('registrations')
            .select('*')
            .filter('data->>ticket_number', 'eq', id)
            .single();

        if (fetchErr || !existing) {
            // Fallback: try by UUID
            const { data: byUUID, error: uuidErr } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', id)
                .single();

            if (uuidErr || !byUUID) {
                return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
            }
        }

        const reg = existing;
        const regData = (reg?.data as Record<string, any>) || {};
        const expectedAmount = regData.fee_amount || 0;
        const isMismatch = expectedAmount > 0 && Number(amount_paid) !== expectedAmount;

        // 2. Update registration with payment claim data
        const updatedData = {
            ...regData,
            payment_status: 'payment_claimed',
            payment_claimed_at: new Date().toISOString(),
            amount_paid_by_user: Number(amount_paid),
            amount_mismatch: isMismatch,
            ...(proof_url ? { proof_url } : {}),
        };

        const { error: updateErr } = await supabase
            .from('registrations')
            .update({ data: updatedData })
            .eq('id', reg.id);

        if (updateErr) {
            console.error('Error updating claim:', updateErr);
            return NextResponse.json({ error: 'Failed to record claim' }, { status: 500 });
        }

        // 3. Send admin notification email (non-fatal)
        try {
            const { sendAdminPaymentClaimEmail } = await import('@/lib/email');
            await sendAdminPaymentClaimEmail(
                ADMIN_EMAIL,
                regData.ticket_number || id,
                regData.full_name || regData.fullName || 'Unknown',
                regData.phone || 'N/A',
                expectedAmount,
                Number(amount_paid),
                regData.currency || 'INR',
                !!proof_url
            );
        } catch (emailErr) {
            console.error('Failed to send admin notification:', emailErr);
        }

        return NextResponse.json({
            success: true,
            message: 'Payment claim recorded. Admin notified.',
            ticketId: regData.ticket_number || id,
            isMismatch,
        });
    } catch (error: any) {
        console.error('Claim error:', error);
        return NextResponse.json({ error: 'Failed to process claim', details: error.message }, { status: 500 });
    }
}
