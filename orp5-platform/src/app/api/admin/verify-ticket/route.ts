import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getCanonicalConferenceBadgeDirectory, getCanonicalName, CanonicalBadgeEntry } from '@/lib/badge-registry';

export const dynamic = 'force-dynamic';

export const CHECKPOINTS: Record<string, { name: string; singleUse: boolean; icon: string }> = {
    main_entry: { name: 'Main Entrance Check-In', singleUse: false, icon: '🎟️' },
    kit_distribution: { name: 'Conference Kit Distribution', singleUse: true, icon: '🎒' },
    lunch_day_1: { name: 'Lunch — Day 1 (22 Sep)', singleUse: true, icon: '🍱' },
    lunch_day_2: { name: 'Lunch — Day 2 (23 Sep)', singleUse: true, icon: '🍱' },
    lunch_day_3: { name: 'Lunch — Day 3 (24 Sep)', singleUse: true, icon: '🍱' },
    gala_dinner: { name: 'Gala Dinner / Banquet (23 Sep)', singleUse: true, icon: '🍽️' },
    plenary_hall: { name: 'Plenary Session Hall', singleUse: false, icon: '🏛️' },
    tech_hall: { name: 'Technical Sessions Hall', singleUse: false, icon: '🎤' },
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { ticketId, checkpoint = 'main_entry', scannedBy = 'Scanner Device', location = 'PHD House', recordScan = true } = body;

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

        console.log(`[VERIFY] Verifying ticket: "${ticketId}" at checkpoint: "${checkpoint}" (record: ${recordScan})`);
        const checkpointConfig = CHECKPOINTS[checkpoint] || { name: checkpoint, singleUse: false, icon: '📍' };

        // 2. Fetch the canonical badge directory (exact 1:1 match with printed ID cards)
        const { allBadges, badgeMapByTicket, badgeMapById, badgeMapByEmail, badgeMapByPhone, badgeMapByCanonicalName } = 
            await getCanonicalConferenceBadgeDirectory();

        const cleanTicketUpper = ticketId.toUpperCase().trim();
        const cleanTicketAlphaNum = cleanTicketUpper.replace(/[^A-Z0-9]/g, '');

        let matched: CanonicalBadgeEntry | undefined = undefined;

        // TIER 1: Exact Ticket Number Match
        matched = badgeMapByTicket.get(cleanTicketUpper) || badgeMapByTicket.get(cleanTicketAlphaNum);

        // TIER 2: Exact UUID / ID Match
        if (!matched) {
            matched = badgeMapById.get(ticketId.toLowerCase().trim());
        }

        // TIER 3: Suffix Match for ORP5IC-IND-XXXXX / ORP5IC-INT-XXXXX / ORP5IC-COM-XXX / ORP5IC-SPK-XXX / ORP5IC-BLK-XXX-XXX
        if (!matched) {
            const indMatch = cleanTicketUpper.match(/ORP5IC-(?:IND|INT|COM|SPK|VOL|BLK|SPOT)-([A-Z0-9-]+)/i);
            if (indMatch) {
                const suffix = indMatch[1].toUpperCase();
                matched = allBadges.find(b => 
                    b.ticketNumber.toUpperCase().endsWith(suffix) || 
                    b.ticketNumber.toUpperCase().includes(suffix) ||
                    b.id.toUpperCase().endsWith(suffix) ||
                    b.id.toUpperCase().startsWith(suffix) ||
                    (b.registrationId && b.registrationId.toUpperCase().startsWith(suffix))
                );
            }
        }

        // TIER 4: Exact Email Match
        if (!matched && ticketId.includes('@')) {
            matched = badgeMapByEmail.get(ticketId.toLowerCase().trim());
        }

        // TIER 5: Exact Phone Match (10+ digits)
        if (!matched) {
            const rawDigits = ticketId.replace(/\D/g, '');
            if (rawDigits.length >= 8) {
                matched = badgeMapByPhone.get(rawDigits);
            }
        }

        // TIER 6: Canonical Name Exact Match
        if (!matched) {
            const cName = getCanonicalName(ticketId);
            if (cName.length >= 4) {
                matched = badgeMapByCanonicalName.get(cName);
            }
        }

        if (!matched) {
            return NextResponse.json({
                valid: false,
                message: `Ticket "${ticketId}" was not found in the conference badge registry. Please check registration or direct attendee to Helpdesk.`
            }, { status: 404 });
        }

        // Fetch latest scan history for this attendee from database
        const supabase = getSupabaseAdmin();
        const regTargetId = matched.registrationId || matched.id;

        const { data: regRow } = await supabase
            .from('registrations')
            .select('*')
            .eq('id', regTargetId)
            .maybeSingle();

        const currentData = regRow?.data || {};
        const existingScans: any[] = Array.isArray(currentData.scans) ? [...currentData.scans] : (matched.scans || []);

        const priorScansForCheckpoint = existingScans.filter((s: any) => s.checkpoint === checkpoint);
        const isDuplicate = priorScansForCheckpoint.length > 0;
        const lastPreviousScan = isDuplicate ? priorScansForCheckpoint[priorScansForCheckpoint.length - 1] : null;

        // 3. Record Scan in Supabase
        if (recordScan) {
            const newScanRecord = {
                id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                checkpoint,
                checkpointName: checkpointConfig.name,
                timestamp: new Date().toISOString(),
                scannedBy: String(scannedBy || 'Gate Scanner Desk'),
                location: String(location || 'Venue Checkpoint'),
                isDuplicate: isDuplicate,
                scanIndex: priorScansForCheckpoint.length + 1
            };

            existingScans.push(newScanRecord);

            const updatedData = {
                ...currentData,
                full_name: matched.name,
                ticket_number: matched.ticketNumber,
                category: matched.category,
                institution: matched.institution,
                country: matched.country,
                mode: matched.mode,
                group: matched.group,
                payment_status: matched.paymentStatus,
                scans: existingScans,
                last_scanned_at: newScanRecord.timestamp,
                scan_count: existingScans.length,
                ...(checkpoint === 'kit_distribution' ? { kit_collected: true, kit_collected_at: newScanRecord.timestamp } : {}),
                ...(checkpoint === 'main_entry' && !currentData.checked_in_at ? { checked_in_at: newScanRecord.timestamp } : {})
            };

            if (regRow) {
                await supabase
                    .from('registrations')
                    .update({ data: updatedData })
                    .eq('id', regTargetId);
            } else {
                // Upsert official record for Committee / Speaker / Volunteer / Spot badges
                await supabase
                    .from('registrations')
                    .upsert({
                        id: regTargetId,
                        status: 'paid',
                        data: updatedData
                    });
            }
        }

        // Mask email e.g. j***e@domain.com
        let emailMasked = '';
        if (matched.email) {
            const parts = matched.email.split('@');
            if (parts.length === 2) {
                const name = parts[0];
                const maskedName = name.length > 2 ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] : name[0] + '*';
                emailMasked = `${maskedName}@${parts[1]}`;
            }
        }

        // Format human readable payment status
        let formattedPaymentStatus = 'Awaiting Payment (Unpaid)';
        if (matched.isPaid) {
            formattedPaymentStatus = 'Paid & Confirmed';
        } else if (matched.paymentStatus) {
            const raw = String(matched.paymentStatus).toLowerCase();
            if (raw === 'awaiting_payment' || raw === 'pending' || raw === 'unpaid') {
                formattedPaymentStatus = 'Awaiting Payment (Unpaid)';
            } else if (raw === 'payment_claimed') {
                formattedPaymentStatus = 'Payment Verification In Progress';
            } else {
                formattedPaymentStatus = String(matched.paymentStatus).replace(/_/g, ' ').toUpperCase();
            }
        }

        return NextResponse.json({
            valid: true,
            registrant: {
                id: matched.id,
                name: matched.name,
                category: matched.category,
                ticketId: matched.ticketNumber,
                group: matched.group,
                mode: matched.mode.toLowerCase().includes('virtual') ? 'Virtual (Online)' : 'In-Person (Physical)',
                institution: matched.institution,
                country: matched.country,
                designation: matched.designation,
                photoUrl: matched.photoUrl,
                isPaid: matched.isPaid,
                paymentStatus: formattedPaymentStatus,
                email: matched.email || '',
                phone: matched.phone || '',
                emailMasked,
                hasAbstract: matched.hasAbstract,
                abstractStatus: matched.abstractStatus,
                abstractTitle: matched.abstractTitle,
                registeredAt: matched.submittedAt || null,
            },
            scanDetails: {
                checkpoint,
                checkpointName: checkpointConfig.name,
                checkpointIcon: checkpointConfig.icon,
                scanCountForCheckpoint: priorScansForCheckpoint.length + (recordScan ? 1 : 0),
                isDuplicateScan: isDuplicate && checkpointConfig.singleUse,
                lastPreviousScanAt: lastPreviousScan ? lastPreviousScan.timestamp : null,
                totalScans: existingScans.length,
                scanHistory: existingScans
            }
        });

    } catch (e: any) {
        console.error("Error in /api/admin/verify-ticket:", e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
