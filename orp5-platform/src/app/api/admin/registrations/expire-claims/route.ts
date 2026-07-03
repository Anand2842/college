import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_ADMIN_EMAIL || 'orp5admin@gmail.com';

/**
 * POST /api/admin/registrations/expire-claims
 * 
 * Scans all payment_claimed registrations and:
 * - Day 2+: Flags for admin attention
 * - Day 4+: Sends urgent email alert to admin  
 * - Day 5+: Moves to 'claim_expired' (admin can still override manually)
 * 
 * Call this from a scheduled cron job or manually from the admin panel.
 * Admin retains FULL power to override any expired claim manually.
 */
export async function POST() {
    try {
        const supabase = getSupabaseAdmin();
        const now = new Date();

        // Fetch all payment_claimed registrations
        const { data: claimed, error } = await supabase
            .from('registrations')
            .select('id, data, created_at')
            .filter('data->>payment_status', 'eq', 'payment_claimed');

        if (error) {
            console.error('Error fetching claimed registrations:', error);
            return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
        }

        const summary = {
            total_checked: claimed?.length || 0,
            expired: [] as string[],
            urgent_alerts: [] as string[],
            attention_needed: [] as string[],
            errors: [] as string[],
        };

        if (!claimed || claimed.length === 0) {
            return NextResponse.json({ success: true, message: 'No pending claims found.', summary });
        }

        for (const reg of claimed) {
            const regData = (reg.data as Record<string, any>) || {};
            const claimedAt = new Date(regData.payment_claimed_at || reg.created_at);
            const ageMs = now.getTime() - claimedAt.getTime();
            const ageDays = ageMs / (1000 * 60 * 60 * 24);

            const ticketId = regData.ticket_number || reg.id;
            const name = regData.full_name || regData.fullName || 'Unknown';
            const email = regData.email || '';
            const amount = regData.fee_amount || 0;
            const currency = regData.currency || 'INR';

            if (ageDays >= 5) {
                // ── Expire: move to claim_expired, but data stays — admin can still override ──
                const { error: expireErr } = await supabase
                    .from('registrations')
                    .update({
                        data: {
                            ...regData,
                            payment_status: 'claim_expired',
                            claim_expired_at: now.toISOString(),
                            claim_expired_reason: `Auto-expired after ${Math.floor(ageDays)} days without SBI verification.`
                        }
                    })
                    .eq('id', reg.id);

                if (expireErr) {
                    summary.errors.push(ticketId);
                } else {
                    summary.expired.push(ticketId);
                    // Notify admin of expiry
                    try {
                        const { sendAdminClaimExpiryEmail } = await import('@/lib/email');
                        await sendAdminClaimExpiryEmail(ADMIN_EMAIL, ticketId, name, email, amount, currency, Math.floor(ageDays));
                    } catch (e) {
                        console.error('Failed to send expiry email:', e);
                    }
                }
            } else if (ageDays >= 4) {
                // ── Day 4: Urgent alert ──
                summary.urgent_alerts.push(ticketId);
                try {
                    const { sendAdminClaimUrgentEmail } = await import('@/lib/email');
                    await sendAdminClaimUrgentEmail(ADMIN_EMAIL, ticketId, name, email, amount, currency, Math.floor(ageDays));
                } catch (e) {
                    console.error('Failed to send urgent alert:', e);
                }
            } else if (ageDays >= 2) {
                // ── Day 2: Attention reminder ──
                summary.attention_needed.push(ticketId);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${summary.total_checked} pending claims.`,
            summary,
        });
    } catch (error: any) {
        console.error('Expire claims error:', error);
        return NextResponse.json({ error: 'Failed to process expiry', details: error.message }, { status: 500 });
    }
}

/**
 * GET /api/admin/registrations/expire-claims
 * Returns a summary of pending claim ages without making any changes.
 * Useful for the admin dashboard to show an aging report.
 */
export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const now = new Date();

        const { data: claimed, error } = await supabase
            .from('registrations')
            .select('id, data, created_at')
            .filter('data->>payment_status', 'eq', 'payment_claimed');

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
        }

        const aging = (claimed || []).map((reg: any) => {
            const regData = reg.data || {};
            const claimedAt = new Date(regData.payment_claimed_at || reg.created_at);
            const ageDays = (now.getTime() - claimedAt.getTime()) / (1000 * 60 * 60 * 24);
            return {
                id: reg.id,
                ticket_number: regData.ticket_number,
                name: regData.full_name || regData.fullName,
                email: regData.email,
                fee_amount: regData.fee_amount,
                currency: regData.currency,
                claimed_at: regData.payment_claimed_at,
                age_days: Math.floor(ageDays),
                urgency: ageDays >= 5 ? 'expired' : ageDays >= 4 ? 'urgent' : ageDays >= 2 ? 'attention' : 'ok',
            };
        }).sort((a: any, b: any) => b.age_days - a.age_days);

        return NextResponse.json({
            total: aging.length,
            expired: aging.filter((r: any) => r.urgency === 'expired').length,
            urgent: aging.filter((r: any) => r.urgency === 'urgent').length,
            attention: aging.filter((r: any) => r.urgency === 'attention').length,
            claims: aging,
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to get aging report' }, { status: 500 });
    }
}
