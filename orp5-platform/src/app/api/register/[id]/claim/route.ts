import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_ADMIN_EMAIL || 'orp5admin@gmail.com';
const CLAIM_COOLDOWN_MINUTES = 10;

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { proof_url, utr_number, otp } = body;

        if (!id) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
            return NextResponse.json({ error: 'A valid 6-digit OTP is required.' }, { status: 400 });
        }
        if (!proof_url || typeof proof_url !== 'string' || proof_url.trim() === '') {
            return NextResponse.json({ error: 'Payment screenshot (proof_url) is required. Please upload your SBI Collect receipt.' }, { status: 400 });
        }
        if (!utr_number || typeof utr_number !== 'string' || utr_number.trim().length < 10) {
            return NextResponse.json({ error: 'A valid UTR/reference number (minimum 10 characters) is required. Find it on your SBI Collect payment receipt.' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Find registration by ticket_number
        let reg: any = null;
        const { data: byTicket, error: ticketErr } = await supabase
            .from('registrations')
            .select('*')
            .filter('data->>ticket_number', 'eq', id)
            .single();

        if (!ticketErr && byTicket) {
            reg = byTicket;
        } else {
            // Fallback: try by UUID
            const { data: byUUID, error: uuidErr } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', id)
                .single();
            if (!uuidErr && byUUID) {
                reg = byUUID;
            }
        }

        if (!reg) {
            return NextResponse.json({ error: 'Registration not found. Please check your Ticket ID.' }, { status: 404 });
        }

        const regData = (reg.data as Record<string, any>) || {};

        // ── Guard: already fully paid ──
        if (regData.payment_status === 'paid') {
            return NextResponse.json({ error: 'This registration is already marked as paid. No further action needed.' }, { status: 409 });
        }

        // ── Guard: duplicate claim within cooldown window ──
        if (regData.payment_claimed_at) {
            const lastClaim = new Date(regData.payment_claimed_at).getTime();
            const minutesSince = (Date.now() - lastClaim) / (1000 * 60);
            if (minutesSince < CLAIM_COOLDOWN_MINUTES) {
                const waitMin = Math.ceil(CLAIM_COOLDOWN_MINUTES - minutesSince);
                return NextResponse.json({
                    error: `A payment claim was already submitted recently. Please wait ${waitMin} minute(s) before submitting again, or contact support if you need help.`
                }, { status: 429 });
            }
        }

        // ── Guard: OTP Verification ──
        if (!regData.claim_otp || String(regData.claim_otp) !== otp.trim()) {
            return NextResponse.json({ error: 'Invalid OTP. Please check your email and try again.' }, { status: 401 });
        }
        if (regData.claim_otp_expires_at && new Date(regData.claim_otp_expires_at).getTime() < Date.now()) {
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
        }

        const expectedAmount = regData.fee_amount || regData.feeAmount || 0;
        // The user can no longer edit the amount, they are claiming to have paid the full fee.
        const isMismatch = false; 

        // ── Update with full claim data including UTR ──
        const updatedData = {
            ...regData,
            payment_status: 'payment_claimed',
            payment_claimed_at: new Date().toISOString(),
            amount_paid_by_user: expectedAmount,
            amount_mismatch: isMismatch,
            proof_url: proof_url.trim(),
            utr_number: utr_number.trim().toUpperCase(),
            claim_otp: null, // Clear OTP after successful use
            claim_otp_expires_at: null,
        };

        const { error: updateErr } = await supabase
            .from('registrations')
            .update({ data: updatedData })
            .eq('id', reg.id);

        if (updateErr) {
            console.error('Error updating claim:', updateErr);
            return NextResponse.json({ error: 'Failed to record claim. Please try again.' }, { status: 500 });
        }

        // ── Admin notification (non-fatal) ──
        try {
            const { sendAdminPaymentClaimEmail } = await import('@/lib/email');
            await sendAdminPaymentClaimEmail(
                ADMIN_EMAIL,
                regData.ticket_number || id,
                regData.full_name || regData.fullName || 'Unknown',
                regData.phone || 'N/A',
                expectedAmount,
                expectedAmount, // user claims full amount now
                regData.currency || 'INR',
                true // proof always present now
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
