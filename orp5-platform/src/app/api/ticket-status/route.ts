import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// In-memory rate limiter: max 30 attempts per IP per 10 minutes (bypassed on localhost)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 30;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown' || ip === 'localhost') {
        return { allowed: true };
    }
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
        const ticketId = (body.ticket_id || '').trim().toUpperCase();
        const email = (body.email || '').trim().toLowerCase();

        if (!ticketId && !email) {
            return NextResponse.json(
                { error: 'Please enter your Manuscript Tracking ID or registered email address.' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // ── 1. Query 'registrations' for Full Paper ───────────────────────────
        let regQuery = supabase
            .from('registrations')
            .select('id, status, data, created_at');

        if (ticketId) {
            regQuery = regQuery.filter('data->>ticket_number', 'eq', ticketId);
        }
        if (email) {
            regQuery = regQuery.filter('data->>email', 'ilike', email);
        }

        const { data: regRows } = await regQuery.limit(5);

        // Find full paper registration or first match
        const fullPaperReg = regRows?.find((r: any) => (r.data as any)?.type === 'full_length_paper' || (r.data as any)?.paper_title) || regRows?.[0];

        if (fullPaperReg) {
            const d = (fullPaperReg as any).data as Record<string, any>;
            const currentTicket = d.ticket_number || ticketId;

            // Check if there is an updated review status from the abstracts table (moderator reviews)
            let liveReviewStatus = d.review_status || 'under_review';
            let liveReviewNotes = '';

            try {
                const { data: absRows } = await supabase
                    .from('abstracts')
                    .select('id, status, notes, title, abstract_text')
                    .or(`abstract_text.ilike.%${currentTicket}%,email.ilike.%${d.email || email}%`)
                    .limit(3);

                const matchedAbs = absRows?.find((a: any) => 
                    a.abstract_text?.includes(currentTicket) || 
                    a.title?.toLowerCase().includes((d.paper_title || '').slice(0, 30).toLowerCase())
                ) || absRows?.[0];

                if (matchedAbs) {
                    if (matchedAbs.status === 'accepted') liveReviewStatus = 'accepted';
                    else if (matchedAbs.status === 'rejected') liveReviewStatus = 'rejected';
                    else if (matchedAbs.status === 'revision') liveReviewStatus = 'revision';
                    else if (matchedAbs.status === 'pending') liveReviewStatus = 'under_review';
                    liveReviewNotes = matchedAbs.notes || '';
                }
            } catch (syncErr) {
                console.warn('Could not sync abstract review status:', syncErr);
            }

            return NextResponse.json({
                type: 'full_paper',
                ticket_number: currentTicket,
                full_name: d.full_name || 'Author',
                email_masked: maskEmail(d.email || email),
                category: d.category || `Full Paper (${d.article_type || 'Bio Web'})`,
                nationality: d.nationality || 'Indian',
                country: d.country || 'India',
                institution: d.institution || 'Institution',
                fee_amount: d.fee_amount || 6000,
                currency: d.currency || 'INR',
                status: fullPaperReg.status,
                payment_status: d.payment_status || 'pending_acceptance',
                review_status: liveReviewStatus,
                review_notes: liveReviewNotes,
                registered_at: d.submittedAt || fullPaperReg.created_at,
                paper_title: d.paper_title || 'Untitled Manuscript',
                article_type: d.article_type || 'Research Article',
                theme: d.theme || 'Interdisciplinary Agro-Science',
                co_authors: d.co_authors || '',
                manuscript_url: d.manuscript_url || null,
                plagiarism_report_url: d.plagiarism_report_url || null,
                supplementary_url: d.supplementary_url || null,
                utr_number: d.utr_number || null,
            });
        }

        // ── 2. Fallback: Search 'abstracts' for mirror full paper ──────────────
        let absQuery = supabase
            .from('abstracts')
            .select('*');

        if (ticketId) {
            absQuery = absQuery.ilike('abstract_text', `%${ticketId}%`);
        } else if (email) {
            absQuery = absQuery.ilike('email', email);
        }

        const { data: absRows } = await absQuery.limit(1);

        if (absRows && absRows.length > 0) {
            const abs = absRows[0];
            const ticketMatch = abs.abstract_text?.match(/Ref ID:\s*(ORP5-FP-[A-Z0-9-]+)/i);
            const refTicket = ticketMatch ? ticketMatch[1] : (ticketId || `ORP5-FP-${abs.id.slice(0, 8).toUpperCase()}`);

            let reviewStatus = 'under_review';
            if (abs.status === 'accepted') reviewStatus = 'accepted';
            else if (abs.status === 'rejected') reviewStatus = 'rejected';
            else if (abs.status === 'revision') reviewStatus = 'revision';

            return NextResponse.json({
                type: 'full_paper',
                ticket_number: refTicket,
                full_name: abs.author_name || 'Author',
                email_masked: maskEmail(abs.email || email),
                category: abs.category || 'Full Paper',
                nationality: 'Indian',
                country: 'India',
                institution: abs.institution || 'Affiliated Institution',
                fee_amount: 6000,
                currency: 'INR',
                status: abs.status,
                payment_status: reviewStatus === 'accepted' ? 'pending_payment' : 'pending_acceptance',
                review_status: reviewStatus,
                review_notes: abs.notes || '',
                registered_at: abs.created_at,
                paper_title: (abs.title || '').replace(/^\[FULL PAPER\]\s*/i, ''),
                article_type: abs.category || 'Full Paper',
                theme: abs.topic || 'General Track',
                manuscript_url: abs.file_url || null,
            });
        }

        return NextResponse.json(
            { error: 'No manuscript submission found matching the provided details. Please verify your Tracking ID (e.g. ORP5-FP-2026-XXXX) and email.' },
            { status: 404 }
        );
    } catch (err) {
        console.error('[ticket-status] Error:', err);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}
