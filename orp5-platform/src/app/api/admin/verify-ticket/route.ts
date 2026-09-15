import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { ticketId } = body;

        if (!ticketId || typeof ticketId !== 'string') {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        ticketId = ticketId.trim();

        // 1. If ticketId is a URL, extract the id query parameter or trailing path segment
        if (ticketId.startsWith('http://') || ticketId.startsWith('https://')) {
            try {
                const url = new URL(ticketId);
                ticketId = url.searchParams.get('id') || url.pathname.split('/').pop() || ticketId;
                ticketId = ticketId.trim();
            } catch (e) {
                // Keep ticketId as is
            }
        }

        console.log(`[VERIFY] Received request to verify ticket: "${ticketId}"`);
        const supabase = getSupabaseAdmin();

        // 2. Multi-tier lookup across registrations table
        const { data: allRegs, error: fetchErr } = await supabase
            .from('registrations')
            .select('*');

        if (!fetchErr && Array.isArray(allRegs)) {
            const cleanQuery = ticketId.toUpperCase().replace(/[^A-Z0-9]/g, '');

            const matched = allRegs.find((row: any) => {
                const data = row.data || {};
                const tNum = (data.ticket_number || data.ticketId || data.ticket_id || '').toUpperCase().trim();
                const tClean = tNum.replace(/[^A-Z0-9]/g, '');

                // Match exact ticket number
                if (tNum && (tNum === ticketId.toUpperCase() || tClean === cleanQuery)) return true;

                // Match full UUID
                if (row.id && (row.id.toLowerCase() === ticketId.toLowerCase() || row.id.replace(/-/g, '').toUpperCase() === cleanQuery)) return true;

                // Match prefix (e.g. ORP5IC-IND-38762 generated from 38762 prefix of row.id)
                const idPrefix5 = row.id.substring(0, 5).toUpperCase();
                const idPrefix8 = row.id.substring(0, 8).toUpperCase();
                if (ticketId.toUpperCase().includes(idPrefix5) || cleanQuery.includes(idPrefix5) || cleanQuery.includes(idPrefix8)) {
                    return true;
                }

                return false;
            });

            if (matched) {
                const data = matched.data || {};
                const isPaid = (data.payment_status || matched.status || '').toLowerCase() === 'paid' ||
                               (data.payment_status || '').toLowerCase() === 'payment_claimed' ||
                               (data.payment_status || '').toLowerCase() === 'confirmed' ||
                               (data.payment_status || '').toLowerCase() === 'free_pass';

                const email = (data.email || matched.email || '').trim().toLowerCase();
                const phone = (data.phone || matched.phone || data.mobile || '').trim().replace(/\D/g, '');

                // Check abstract status if any
                let matchedAbs: any = null;
                if (email || phone || matched.user_id) {
                    const { data: absData } = await supabase
                        .from('abstracts')
                        .select('id, title, status, topic, category')
                        .or(`email.ilike.${email || 'none'},phone.eq.${phone || 'none'},user_id.eq.${matched.user_id || '00000000-0000-0000-0000-000000000000'}`)
                        .maybeSingle();
                    matchedAbs = absData;
                }

                // Mask email e.g. j***e@domain.com
                let emailMasked = '';
                if (email) {
                    const parts = email.split('@');
                    if (parts.length === 2) {
                        const name = parts[0];
                        const maskedName = name.length > 2 ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] : name[0] + '*';
                        emailMasked = `${maskedName}@${parts[1]}`;
                    }
                }

                // Format human-readable payment status
                let formattedPaymentStatus = 'Awaiting Payment (Unpaid)';
                if (isPaid) {
                    formattedPaymentStatus = 'Paid & Confirmed';
                } else if (data.payment_status) {
                    const raw = String(data.payment_status).toLowerCase();
                    if (raw === 'awaiting_payment' || raw === 'pending' || raw === 'unpaid') {
                        formattedPaymentStatus = 'Awaiting Payment (Unpaid)';
                    } else if (raw === 'payment_claimed') {
                        formattedPaymentStatus = 'Payment Verification In Progress';
                    } else {
                        formattedPaymentStatus = String(data.payment_status).replace(/_/g, ' ').toUpperCase();
                    }
                }

                return NextResponse.json({
                    valid: true,
                    registrant: {
                        id: matched.id,
                        name: data.full_name || data.fullName || 'Registered Delegate',
                        category: (data.category || 'Delegate').toUpperCase(),
                        ticketId: data.ticket_number || data.ticketId || `ORP5IC-IND-${matched.id.substring(0, 5).toUpperCase()}`,
                        mode: (data.mode || 'physical').toLowerCase().includes('virtual') ? 'Virtual (Online)' : 'In-Person (Physical)',
                        institution: data.institution || data.affiliation || '',
                        country: (data.country || 'India').toUpperCase(),
                        designation: data.designation || '',
                        photoUrl: data.photo_url || data.photoUrl || '',
                        isPaid: isPaid,
                        paymentStatus: formattedPaymentStatus,
                        feeAmount: data.fee_amount || data.amount || null,
                        currency: data.currency || (data.country === 'INDIA' || data.nationality === 'indian' ? 'INR' : 'USD'),
                        emailMasked: emailMasked,
                        hasAbstract: !!matchedAbs,
                        abstractStatus: matchedAbs?.status || null,
                        abstractTitle: matchedAbs?.title || null,
                        abstractTopic: matchedAbs?.topic || matchedAbs?.category || null,
                        status: matched.status || 'Active',
                        registeredAt: matched.created_at || data.submittedAt || null,
                    }
                });
            }
        }

        // 3. Fallback: Search in Committees page if it's a committee badge (e.g. ORP5IC-COM-001)
        if (ticketId.toUpperCase().includes('COM-') || ticketId.toUpperCase().includes('COMMITTEE')) {
            const { data: commPage } = await supabase
                .from('Page')
                .select('content')
                .eq('slug', 'committees')
                .maybeSingle();

            const committeeContent = commPage?.content || {};
            if (Array.isArray(committeeContent.committees)) {
                let comCounter = 1;
                for (const cm of committeeContent.committees) {
                    const groupLabel = cm.label || 'Committee Member';
                    if (Array.isArray(cm.members)) {
                        for (const m of cm.members) {
                            const paddedId = String(comCounter++).padStart(3, '0');
                            const comTicket = `ORP5IC-COM-${paddedId}`;
                            if (ticketId.toUpperCase().includes(paddedId) || ticketId.toUpperCase() === comTicket) {
                                return NextResponse.json({
                                    valid: true,
                                    registrant: {
                                        id: m.id || `comm-${paddedId}`,
                                        name: m.name || 'Committee Member',
                                        category: groupLabel.toUpperCase(),
                                        ticketId: comTicket,
                                        mode: 'In-Person (Physical)',
                                        institution: m.affiliation || m.designation || '',
                                        country: (m.country || 'India').toUpperCase(),
                                        designation: m.designation || '',
                                        paymentStatus: 'Exempt / Official',
                                        status: 'Organizing Committee',
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }

        return NextResponse.json({ valid: false, message: `Ticket "${ticketId}" not found in conference records.` }, { status: 404 });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: 'Verification failed: ' + error?.message }, { status: 500 });
    }
}
