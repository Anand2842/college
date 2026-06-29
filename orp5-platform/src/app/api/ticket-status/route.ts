import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// In-memory rate limiter: max 5 attempts per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
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

function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const masked = local.length <= 2 ? local[0] + '***' : local[0] + '***' + local[local.length - 1];
    return `${masked}@${domain}`;
}

export async function POST(request: Request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
        return NextResponse.json(
            { error: `Too many attempts. Please try again in ${rateCheck.retryAfter} seconds.` },
            { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
        );
    }

    try {
        const body = await request.json();
        const lookupType = body.type || 'registration'; // 'registration' | 'abstract'
        const email = (body.email || '').trim().toLowerCase();

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // ── REGISTRATION LOOKUP ──────────────────────────────────────────────
        if (lookupType === 'registration') {
            const ticketId = (body.ticket_id || '').trim().toUpperCase();
            if (!ticketId) {
                return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
            }

            const { data: rows } = await supabase
                .from('registrations')
                .select('id, status, data, created_at')
                .filter('data->>ticket_number', 'eq', ticketId)
                .filter('data->>email', 'ilike', email)
                .limit(1);

            if (!rows || rows.length === 0) {
                return NextResponse.json(
                    { error: 'No registration found matching these details. Please check your Ticket ID and email.' },
                    { status: 404 }
                );
            }

            const reg = rows[0];
            const d = reg.data as Record<string, any>;

            return NextResponse.json({
                type: 'registration',
                ticket_number: d.ticket_number,
                full_name: d.full_name,
                email_masked: maskEmail(d.email || ''),
                category: d.category,
                mode: d.mode,
                nationality: d.nationality,
                institution: d.institution,
                fee_amount: d.fee_amount,
                currency: d.currency || 'INR',
                status: reg.status,
                payment_status: d.payment_status,
                registered_at: d.submittedAt || reg.created_at,
            });
        }

        // ── ABSTRACT LOOKUP — email only, returns all submissions for that email ──
        if (lookupType === 'abstract') {
            const { data: rows } = await supabase
                .from('abstracts')
                .select('id, status, title, category, topic, author_name, email, institution, created_at')
                .ilike('email', email)
                .order('created_at', { ascending: false });

            if (!rows || rows.length === 0) {
                return NextResponse.json(
                    { error: 'No submissions found for this email address.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                type: 'abstract',
                email_masked: maskEmail(email),
                submissions: rows.map(abs => ({
                    id: abs.id,
                    title: abs.title,
                    author_name: abs.author_name,
                    institution: abs.institution,
                    category: abs.category,
                    topic: abs.topic,
                    status: abs.status,
                    submitted_at: abs.created_at,
                })),
            });
        }

        return NextResponse.json({ error: 'Invalid lookup type.' }, { status: 400 });
    } catch (err) {
        console.error('[ticket-status] Error:', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}
