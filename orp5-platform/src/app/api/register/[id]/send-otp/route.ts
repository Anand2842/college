import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendClaimOtpEmail } from '@/lib/email';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });

        const supabase = getSupabaseAdmin();

        // Find registration
        let reg: any = null;
        const { data: byTicket, error: ticketErr } = await supabase
            .from('registrations')
            .select('*')
            .filter('data->>ticket_number', 'eq', id)
            .single();

        if (!ticketErr && byTicket) {
            reg = byTicket;
        } else {
            const { data: byUUID, error: uuidErr } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', id)
                .single();
            if (!uuidErr && byUUID) reg = byUUID;
        }

        if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });

        const regData = (reg.data as Record<string, any>) || {};

        if (regData.payment_status === 'paid') {
            return NextResponse.json({ error: 'Already paid' }, { status: 400 });
        }

        const email = regData.email;
        if (!email) {
            return NextResponse.json({ error: 'No email found for this registration' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

        // Save to DB
        const updatedData = {
            ...regData,
            claim_otp: otp,
            claim_otp_expires_at: expiresAt,
        };

        const { error: updateErr } = await supabase
            .from('registrations')
            .update({ data: updatedData })
            .eq('id', reg.id);

        if (updateErr) throw new Error('Failed to save OTP');

        // Send email
        await sendClaimOtpEmail(email, otp, regData.ticket_number || id);

        return NextResponse.json({ success: true, message: 'OTP sent to registered email' });

    } catch (error: any) {
        console.error('OTP generation error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
