import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { CHECKPOINTS } from '@/app/api/admin/verify-ticket/route';
import { getCanonicalConferenceBadgeDirectory } from '@/lib/badge-registry';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const checkpointFilter = searchParams.get('checkpoint');
        const searchQuery = searchParams.get('q')?.toLowerCase().trim();
        const exportFormat = searchParams.get('format'); // 'json' or 'csv'

        const supabase = getSupabaseAdmin();

        // 1. Get canonical badge directory (all printed badges)
        const { allBadges } = await getCanonicalConferenceBadgeDirectory();

        // 2. Fetch all raw registrations for latest live scans
        const { data: allRegs, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching attendance registrations:', error);
            return NextResponse.json({ error: 'Database error fetching attendance' }, { status: 500 });
        }

        // Map live scans by registrationId or badge id
        const scansByRegId = new Map<string, any[]>();
        const lastScanTimeByRegId = new Map<string, string>();
        const checkedInMap = new Map<string, boolean>();
        const kitMap = new Map<string, boolean>();

        (allRegs || []).forEach((row: any) => {
            const data = row.data || {};
            const scans = Array.isArray(data.scans) ? data.scans : [];
            const rId = row.id.toLowerCase();
            scansByRegId.set(rId, scans);
            if (data.ticket_number) {
                scansByRegId.set(data.ticket_number.toUpperCase().trim(), scans);
            }
            if (data.last_scanned_at) lastScanTimeByRegId.set(rId, data.last_scanned_at);
            if (data.checked_in_at) checkedInMap.set(rId, true);
            if (data.kit_collected) kitMap.set(rId, true);
        });

        // Aggregate stats and extract all flat scan records
        const stats = {
            totalRegistrations: allBadges.length,
            totalCheckedIn: 0,
            totalKitsDistributed: 0,
            lunchDay1: 0,
            lunchDay2: 0,
            lunchDay3: 0,
            galaDinner: 0,
            totalScansOverall: 0,
            uniqueAttendeesScanned: 0,
        };

        const allScanEvents: any[] = [];
        const attendeeSummaryList: any[] = [];

        allBadges.forEach((badge) => {
            const rId = (badge.registrationId || badge.id).toLowerCase();
            const liveScans = scansByRegId.get(rId) || scansByRegId.get(badge.ticketNumber.toUpperCase()) || badge.scans || [];

            if (liveScans.length > 0) {
                stats.uniqueAttendeesScanned++;
                stats.totalScansOverall += liveScans.length;
            }

            let hasCheckedIn = checkedInMap.get(rId) || false;
            let hasKit = kitMap.get(rId) || false;
            let hasLunch1 = false;
            let hasLunch2 = false;
            let hasLunch3 = false;
            let hasDinner = false;

            liveScans.forEach((scan: any) => {
                const cp = scan.checkpoint || 'main_entry';
                if (cp === 'main_entry') { hasCheckedIn = true; }
                if (cp === 'kit_distribution') { hasKit = true; }
                if (cp === 'lunch_day_1') { hasLunch1 = true; }
                if (cp === 'lunch_day_2') { hasLunch2 = true; }
                if (cp === 'lunch_day_3') { hasLunch3 = true; }
                if (cp === 'gala_dinner') { hasDinner = true; }

                allScanEvents.push({
                    scanId: scan.id,
                    attendeeId: badge.id,
                    ticketId: badge.ticketNumber,
                    name: badge.name,
                    category: badge.category,
                    institution: badge.institution,
                    checkpoint: cp,
                    checkpointName: scan.checkpointName || CHECKPOINTS[cp]?.name || cp,
                    timestamp: scan.timestamp,
                    scannedBy: scan.scannedBy || 'Gate Scanner',
                    location: scan.location || 'Venue',
                    isDuplicate: !!scan.isDuplicate,
                    scanIndex: scan.scanIndex || 1,
                    isPaid: badge.isPaid
                });
            });

            if (hasCheckedIn) stats.totalCheckedIn++;
            if (hasKit) stats.totalKitsDistributed++;
            if (hasLunch1) stats.lunchDay1++;
            if (hasLunch2) stats.lunchDay2++;
            if (hasLunch3) stats.lunchDay3++;
            if (hasDinner) stats.galaDinner++;

            attendeeSummaryList.push({
                id: badge.id,
                ticketId: badge.ticketNumber,
                name: badge.name,
                category: badge.category,
                institution: badge.institution,
                email: badge.email || '',
                phone: badge.phone || '',
                group: badge.group,
                mode: badge.mode,
                isPaid: badge.isPaid,
                totalScans: liveScans.length,
                hasCheckedIn,
                hasKit,
                hasLunch1,
                hasLunch2,
                hasLunch3,
                hasDinner,
                lastScannedAt: lastScanTimeByRegId.get(rId) || null,
                scans: liveScans
            });
        });

        // Sort scan events by timestamp descending (most recent first)
        allScanEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Apply filters
        let filteredEvents = allScanEvents;
        if (checkpointFilter && checkpointFilter !== 'all') {
            filteredEvents = filteredEvents.filter(e => e.checkpoint === checkpointFilter);
        }
        if (searchQuery) {
            filteredEvents = filteredEvents.filter(e => 
                e.name.toLowerCase().includes(searchQuery) ||
                e.ticketId.toLowerCase().includes(searchQuery) ||
                e.institution.toLowerCase().includes(searchQuery) ||
                e.category.toLowerCase().includes(searchQuery)
            );
        }

        // Export CSV if requested
        if (exportFormat === 'csv') {
            const csvRows = [
                ['Scan Timestamp', 'Ticket ID', 'Attendee Name', 'Category', 'Institution', 'Checkpoint', 'Scanned By', 'Duplicate Scan', 'Payment Status'].join(',')
            ];

            filteredEvents.forEach(e => {
                const escaped = (txt: string) => `"${String(txt || '').replace(/"/g, '""')}"`;
                csvRows.push([
                    escaped(e.timestamp),
                    escaped(e.ticketId),
                    escaped(e.name),
                    escaped(e.category),
                    escaped(e.institution),
                    escaped(e.checkpointName),
                    escaped(e.scannedBy),
                    escaped(e.isDuplicate ? 'Yes (Warning)' : 'No (First Scan)'),
                    escaped(e.isPaid ? 'Paid & Confirmed' : 'Unpaid')
                ].join(','));
            });

            return new NextResponse(csvRows.join('\n'), {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="ORP5_Attendance_Scans_${new Date().toISOString().slice(0, 10)}.csv"`
                }
            });
        }

        return NextResponse.json({
            success: true,
            stats,
            checkpoints: CHECKPOINTS,
            totalScans: filteredEvents.length,
            events: filteredEvents,
            attendees: attendeeSummaryList
        });

    } catch (err: any) {
        console.error('Attendance API Error:', err);
        return NextResponse.json({ error: 'Server error: ' + err?.message }, { status: 500 });
    }
}
