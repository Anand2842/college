import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// In-memory rate limiter: 3 resends per IP per 30 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 30 * 60 * 1000;

function checkRateLimit(ip: string) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true };
    }
    if (entry.count >= MAX_ATTEMPTS) {
        return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }
    entry.count++;
    return { allowed: true };
}

export async function POST(request: Request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
        return NextResponse.json(
            { error: `Too many resend attempts. Please wait ${rateCheck.retryAfter} seconds.` },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const ticketId = (body.ticket_id || '').trim().toUpperCase();
        const email = (body.email || '').trim().toLowerCase();

        if (!ticketId || !email) {
            return NextResponse.json({ error: 'Ticket ID and email are required.' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Verify both match before sending
        const { data: rows } = await supabase
            .from('registrations')
            .select('id, status, data')
            .filter('data->>ticket_number', 'eq', ticketId)
            .filter('data->>email', 'ilike', email)
            .limit(1);

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'No matching registration found.' }, { status: 404 });
        }

        const reg = rows[0];
        const d = reg.data as Record<string, any>;

        // Send the acknowledgement email again
        const { sendRegistrationAcknowledgementEmail } = await import('@/lib/email');
        await sendRegistrationAcknowledgementEmail(
            d.email,
            d.full_name || 'Attendee',
            d.ticket_number,
            d.fee_amount,
            d.currency || 'INR',
            d.category,
            d.mode
        );

        return NextResponse.json({ success: true, message: `Ticket details resent to ${email.replace(/(.{2}).+(@.+)/, '$1***$2')}` });
    } catch (err: any) {
        console.error('[resend-ticket] Error:', err);
        return NextResponse.json({ error: 'Failed to resend. Please try again.' }, { status: 500 });
    }
}
