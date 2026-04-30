import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

/**
 * POST /api/admin/registrations/mis-import
 * 
 * Accepts a raw CSV body from SBI Collect MIS download.
 * Expected CSV columns (flexible, matched by header name):
 *   Transaction ID, Reference Number (Ticket ID), Amount, Mobile, Date
 *
 * Returns: { matched, unmatched, mismatch, total }
 */
export async function POST(request: Request) {
    try {
        const csvText = await request.text();
        if (!csvText.trim()) {
            return NextResponse.json({ error: 'Empty CSV' }, { status: 400 });
        }

        const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
            return NextResponse.json({ error: 'CSV must have at least a header row and one data row' }, { status: 400 });
        }

        // Parse header — look for key columns case-insensitively
        const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());

        // Column index finders
        const findCol = (...names: string[]) => {
            for (const name of names) {
                const idx = header.findIndex(h => h.includes(name.toLowerCase()));
                if (idx !== -1) return idx;
            }
            return -1;
        };

        const colTicket = findCol('reference', 'ticket', 'ref no', 'reference number');
        const colAmount = findCol('amount', 'paid amount', 'transaction amount');
        const colMobile = findCol('mobile', 'phone', 'contact');
        const colTxnId = findCol('transaction id', 'txn id', 'txn', 'payment id');
        const colDate = findCol('date', 'payment date', 'transaction date');

        if (colTicket === -1 || colAmount === -1) {
            return NextResponse.json({
                error: 'CSV missing required columns. Need: "Reference Number" (Ticket ID) and "Amount"',
                detectedHeaders: header,
            }, { status: 400 });
        }

        const results = {
            total: 0,
            matched: 0,
            mismatch: 0,
            unmatched: [] as any[],
            mismatchDetails: [] as any[],
        };

        // Fetch all pending/claimed registrations for matching
        const { data: allRegs } = await supabaseAdmin
            .from('registrations')
            .select('id, data')
            .in('data->>payment_status', ['awaiting_payment', 'pending', 'payment_claimed']);

        const regMap = new Map<string, { id: string; data: any }>();
        for (const reg of (allRegs || [])) {
            const d = reg.data as Record<string, any>;
            if (d?.ticket_number) {
                regMap.set(d.ticket_number.toUpperCase(), { id: reg.id, data: d });
            }
        }

        // Process each CSV row
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
            results.total++;

            const ticketId = cols[colTicket]?.toUpperCase() || '';
            const amountStr = cols[colAmount]?.replace(/[^0-9.]/g, '') || '';
            const amountPaid = parseFloat(amountStr) || 0;
            const mobile = colMobile !== -1 ? cols[colMobile] : '';
            const txnId = colTxnId !== -1 ? cols[colTxnId] : '';
            const payDate = colDate !== -1 ? cols[colDate] : new Date().toISOString();

            if (!ticketId || !amountPaid) {
                results.unmatched.push({ row: i + 1, reason: 'Missing ticket ID or amount', raw: lines[i] });
                continue;
            }

            const regEntry = regMap.get(ticketId);
            if (!regEntry) {
                results.unmatched.push({ row: i + 1, ticketId, reason: 'No registration found with this Ticket ID', amountPaid });
                continue;
            }

            const { id: regId, data: regData } = regEntry;
            const expectedAmount = regData.fee_amount || 0;
            const isMismatch = expectedAmount > 0 && amountPaid !== expectedAmount;

            if (isMismatch) {
                results.mismatch++;
                results.mismatchDetails.push({
                    ticketId,
                    name: regData.full_name || regData.fullName,
                    amountPaid,
                    amountExpected: expectedAmount,
                    currency: regData.currency || 'INR',
                });

                // Still update but flag as mismatch
                await supabaseAdmin
                    .from('registrations')
                    .update({
                        data: {
                            ...regData,
                            payment_status: 'amount_mismatch',
                            amount_paid_by_user: amountPaid,
                            amount_mismatch: true,
                            payment_reference: txnId,
                            payment_date: payDate,
                            mis_imported_at: new Date().toISOString(),
                        }
                    })
                    .eq('id', regId);
            } else {
                // Perfect match — mark as paid
                results.matched++;
                await supabaseAdmin
                    .from('registrations')
                    .update({
                        status: 'approved',
                        data: {
                            ...regData,
                            payment_status: 'paid',
                            payment_date: payDate,
                            payment_reference: txnId,
                            amount_paid_by_user: amountPaid,
                            amount_mismatch: false,
                            payment_mode: 'SBI Collect (MIS Import)',
                            mis_imported_at: new Date().toISOString(),
                        }
                    })
                    .eq('id', regId);

                // Send confirmation email
                if (regData.email) {
                    const { sendRegistrationStatusEmail } = await import('@/lib/email');
                    sendRegistrationStatusEmail(
                        regData.email,
                        regData.full_name || regData.fullName || 'Attendee',
                        regData.ticket_number,
                        'paid'
                    ).catch(e => console.error(`Email failed for ${ticketId}:`, e));
                }
            }
        }

        return NextResponse.json({
            success: true,
            summary: {
                total: results.total,
                matched: results.matched,
                mismatch: results.mismatch,
                unmatched: results.unmatched.length,
            },
            unmatched: results.unmatched,
            mismatchDetails: results.mismatchDetails,
        });
    } catch (error: any) {
        console.error('MIS import error:', error);
        return NextResponse.json({ error: 'Import failed', details: error.message }, { status: 500 });
    }
}
