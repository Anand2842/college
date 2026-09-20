import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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
        const supabase = getSupabaseAdmin();
        const checkpointConfig = CHECKPOINTS[checkpoint] || { name: checkpoint, singleUse: false, icon: '📍' };

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

                // Match exact ticket number or numeric/clean suffix
                if (tNum) {
                    if (tNum === ticketId.toUpperCase() || tClean === cleanQuery) return true;
                    if (cleanQuery.length >= 4 && (tClean.includes(cleanQuery) || cleanQuery.includes(tClean))) return true;
                }

                // Match full UUID or UUID prefix
                if (row.id) {
                    const rowIdClean = row.id.replace(/-/g, '').toUpperCase();
                    if (row.id.toLowerCase() === ticketId.toLowerCase() || rowIdClean === cleanQuery) return true;
                    if (cleanQuery.length >= 5 && (rowIdClean.startsWith(cleanQuery) || cleanQuery.includes(row.id.substring(0, 5).toUpperCase()))) return true;
                }

                // Match attendee name
                const fullName = (data.full_name || data.fullName || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (cleanQuery.length >= 5 && fullName.includes(cleanQuery)) return true;

                // Match attendee email
                const emailStr = (data.email || '').trim().toLowerCase();
                if (ticketId.includes('@') && emailStr === ticketId.toLowerCase()) return true;

                // Match attendee phone
                const phoneClean = (data.phone || '').replace(/\D/g, '');
                if (cleanQuery.length >= 8 && phoneClean.includes(cleanQuery)) return true;

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

                // 2b. Handle Scan History & Persistence
                const existingScans = Array.isArray(data.scans) ? [...data.scans] : [];
                const priorScansForCheckpoint = existingScans.filter((s: any) => s.checkpoint === checkpoint);
                const isDuplicate = priorScansForCheckpoint.length > 0;
                const lastPreviousScan = isDuplicate ? priorScansForCheckpoint[priorScansForCheckpoint.length - 1] : null;

                let newScanRecord: any = null;
                if (recordScan) {
                    newScanRecord = {
                        id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                        checkpoint,
                        checkpointName: checkpointConfig.name,
                        timestamp: new Date().toISOString(),
                        scannedBy: String(scannedBy || 'Gate Scanner'),
                        location: String(location || 'Venue Checkpoint'),
                        isDuplicate: isDuplicate,
                        scanIndex: priorScansForCheckpoint.length + 1
                    };

                    existingScans.push(newScanRecord);

                    // Update database
                    const updatedData = {
                        ...data,
                        scans: existingScans,
                        last_scanned_at: newScanRecord.timestamp,
                        scan_count: existingScans.length,
                        ...(checkpoint === 'kit_distribution' ? { kit_collected: true, kit_collected_at: newScanRecord.timestamp } : {}),
                        ...(checkpoint === 'main_entry' && !data.checked_in_at ? { checked_in_at: newScanRecord.timestamp } : {})
                    };

                    await supabase
                        .from('registrations')
                        .update({ data: updatedData })
                        .eq('id', matched.id);
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
            }
        }

        // 3. Check Committees & Organizing Secretariat (slug: 'committees')
        const { data: commPage } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'committees')
            .maybeSingle();

        const committeeContent = commPage?.content || {};
        const committeeList: any[] = [];
        let comCounter = 1;

        if (Array.isArray(committeeContent.committees)) {
            committeeContent.committees.forEach((cm: any) => {
                const groupLabel = cm.label || 'Committee Member';
                if (Array.isArray(cm.members)) {
                    cm.members.forEach((m: any) => {
                        const paddedId = String(comCounter++).padStart(3, '0');
                        committeeList.push({
                            id: m.id || `comm-${paddedId}`,
                            ticketNumber: `ORP5IC-COM-${paddedId}`,
                            paddedId,
                            name: m.name || 'Committee Member',
                            category: groupLabel.toUpperCase(),
                            designation: m.role || '',
                            institution: m.affiliation || '',
                            country: (m.country || 'India').toUpperCase(),
                            photoUrl: m.imageUrl || '',
                            email: m.email || '',
                            phone: m.phone || ''
                        });
                    });
                }
            });
        }

        if (Array.isArray(committeeContent.contacts)) {
            committeeContent.contacts.forEach((c: any) => {
                const paddedId = String(comCounter++).padStart(3, '0');
                committeeList.push({
                    id: c.id || `contact-${paddedId}`,
                    ticketNumber: `ORP5IC-COM-${paddedId}`,
                    paddedId,
                    name: c.name || 'Organizing Secretariat',
                    category: 'ORGANIZING SECRETARIAT',
                    designation: c.role || 'Secretariat',
                    institution: 'ORP-5 Organizing Committee',
                    country: 'INDIA',
                    photoUrl: c.imageUrl || '',
                    email: c.email || '',
                    phone: c.phone || ''
                });
            });
        }

        const cleanQuery = ticketId.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const matchedComm = committeeList.find(c => {
            const tNum = c.ticketNumber.toUpperCase();
            const tClean = tNum.replace(/[^A-Z0-9]/g, '');
            const idClean = c.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const nameClean = c.name.toUpperCase().replace(/[^A-Z0-9]/g, '');

            return tNum === ticketId.toUpperCase() ||
                   tClean === cleanQuery ||
                   cleanQuery === `COM${c.paddedId}` ||
                   cleanQuery.includes(`COM${c.paddedId}`) ||
                   idClean === cleanQuery ||
                   (cleanQuery.length > 4 && nameClean.includes(cleanQuery));
        });

        if (matchedComm) {
            const { existingScans, isDuplicate, lastPreviousScan, totalScans } = await recordOfficialBadgeScan(
                supabase, 
                matchedComm.ticketNumber, 
                matchedComm.name, 
                matchedComm.category, 
                matchedComm.designation, 
                matchedComm.institution, 
                matchedComm.country, 
                checkpoint, 
                checkpointConfig, 
                scannedBy, 
                location, 
                recordScan
            );

            return NextResponse.json({
                valid: true,
                registrant: {
                    id: matchedComm.id,
                    name: matchedComm.name,
                    category: matchedComm.category,
                    ticketId: matchedComm.ticketNumber,
                    mode: 'In-Person (Physical)',
                    institution: matchedComm.institution || 'Organizing Committee',
                    country: matchedComm.country,
                    designation: matchedComm.designation,
                    photoUrl: matchedComm.photoUrl,
                    isPaid: true,
                    paymentStatus: 'Official / VIP Pass',
                    status: 'Active',
                },
                scanDetails: {
                    checkpoint,
                    checkpointName: checkpointConfig.name,
                    checkpointIcon: checkpointConfig.icon,
                    scanCountForCheckpoint: (isDuplicate ? 2 : 1),
                    isDuplicateScan: isDuplicate && checkpointConfig.singleUse,
                    lastPreviousScanAt: lastPreviousScan ? lastPreviousScan.timestamp : null,
                    totalScans,
                    scanHistory: existingScans
                }
            });
        }

        // 4. Check Speakers (Keynote, Invited, Panel) (slug: 'speakers')
        const { data: spkPage } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'speakers')
            .maybeSingle();

        const spkContent = spkPage?.content || {};
        const speakerList: any[] = [];
        let spkCounter = 1;

        const allSpkList = [
            ...(spkContent.keynotes || []).map((s: any) => ({ ...s, speakerType: 'Keynote Speaker' })),
            ...(spkContent.invited || []).map((s: any) => ({ ...s, speakerType: 'Invited Speaker' })),
            ...(spkContent.panel || []).map((s: any) => ({ ...s, speakerType: 'Panel Speaker' })),
        ];

        allSpkList.forEach((s: any) => {
            const paddedId = String(spkCounter++).padStart(3, '0');
            speakerList.push({
                id: s.id || `spk-${paddedId}`,
                ticketNumber: `ORP5IC-SPK-${paddedId}`,
                paddedId,
                name: s.name || 'Distinguished Speaker',
                category: (s.speakerType || 'KEYNOTE SPEAKER').toUpperCase(),
                designation: s.role || 'Speaker',
                institution: s.institution || '',
                country: (s.countryCode === 'IN' ? 'India' : (s.country || 'International')).toUpperCase(),
                photoUrl: s.imageUrl || '',
            });
        });

        const matchedSpk = speakerList.find(s => {
            const tNum = s.ticketNumber.toUpperCase();
            const tClean = tNum.replace(/[^A-Z0-9]/g, '');
            const idClean = s.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const nameClean = s.name.toUpperCase().replace(/[^A-Z0-9]/g, '');

            return tNum === ticketId.toUpperCase() ||
                   tClean === cleanQuery ||
                   cleanQuery === `SPK${s.paddedId}` ||
                   cleanQuery.includes(`SPK${s.paddedId}`) ||
                   idClean === cleanQuery ||
                   (cleanQuery.length > 4 && nameClean.includes(cleanQuery));
        });

        if (matchedSpk) {
            const { existingScans, isDuplicate, lastPreviousScan, totalScans } = await recordOfficialBadgeScan(
                supabase, 
                matchedSpk.ticketNumber, 
                matchedSpk.name, 
                matchedSpk.category, 
                matchedSpk.designation, 
                matchedSpk.institution, 
                matchedSpk.country, 
                checkpoint, 
                checkpointConfig, 
                scannedBy, 
                location, 
                recordScan
            );

            return NextResponse.json({
                valid: true,
                registrant: {
                    id: matchedSpk.id,
                    name: matchedSpk.name,
                    category: matchedSpk.category,
                    ticketId: matchedSpk.ticketNumber,
                    mode: 'In-Person (Physical)',
                    institution: matchedSpk.institution || 'Invited Faculty',
                    country: matchedSpk.country,
                    designation: matchedSpk.designation,
                    photoUrl: matchedSpk.photoUrl,
                    isPaid: true,
                    paymentStatus: 'Official Speaker Pass',
                    status: 'Active',
                },
                scanDetails: {
                    checkpoint,
                    checkpointName: checkpointConfig.name,
                    checkpointIcon: checkpointConfig.icon,
                    scanCountForCheckpoint: (isDuplicate ? 2 : 1),
                    isDuplicateScan: isDuplicate && checkpointConfig.singleUse,
                    lastPreviousScanAt: lastPreviousScan ? lastPreviousScan.timestamp : null,
                    totalScans,
                    scanHistory: existingScans
                }
            });
        }

        // 5. Check Volunteers
        const defaultVolunteers = [
            { name: "Aarav Sharma", country: "INDIA", designation: "Student Coordinator", institution: "Galgotias University" },
            { name: "Priya Patel", country: "INDIA", designation: "Registration Desk Volunteer", institution: "IARI Pusa" },
            { name: "Rohan Verma", country: "INDIA", designation: "Audiovisual & Stage Lead", institution: "Centurion University" },
            { name: "Ananya Gupta", country: "INDIA", designation: "Hospitality Coordinator", institution: "Galgotias University" },
            { name: "Siddharth Rao", country: "INDIA", designation: "Delegate Assistance Volunteer", institution: "IIFSR Modipuram" },
            { name: "Sneha Nair", country: "INDIA", designation: "Media & Press Volunteer", institution: "Galgotias University" },
            { name: "Vikram Malhotra", country: "INDIA", designation: "Logistics & Transport", institution: "IARI Pusa" },
            { name: "Ishita Sen", country: "INDIA", designation: "Scientific Sessions Aide", institution: "Centurion University" },
        ].map((v, i) => {
            const paddedId = String(i + 1).padStart(3, '0');
            return {
                id: `vol-${paddedId}`,
                ticketNumber: `ORP5IC-VOL-${paddedId}`,
                paddedId,
                name: v.name,
                category: 'CONFERENCE VOLUNTEER',
                designation: v.designation,
                institution: v.institution,
                country: v.country,
                photoUrl: '',
            };
        });

        const matchedVol = defaultVolunteers.find(v => {
            const tNum = v.ticketNumber.toUpperCase();
            const tClean = tNum.replace(/[^A-Z0-9]/g, '');
            const idClean = v.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const nameClean = v.name.toUpperCase().replace(/[^A-Z0-9]/g, '');

            return tNum === ticketId.toUpperCase() ||
                   tClean === cleanQuery ||
                   cleanQuery === `VOL${v.paddedId}` ||
                   cleanQuery.includes(`VOL${v.paddedId}`) ||
                   idClean === cleanQuery ||
                   (cleanQuery.length > 4 && nameClean.includes(cleanQuery));
        });

        if (matchedVol) {
            const { existingScans, isDuplicate, lastPreviousScan, totalScans } = await recordOfficialBadgeScan(
                supabase, 
                matchedVol.ticketNumber, 
                matchedVol.name, 
                matchedVol.category, 
                matchedVol.designation, 
                matchedVol.institution, 
                matchedVol.country, 
                checkpoint, 
                checkpointConfig, 
                scannedBy, 
                location, 
                recordScan
            );

            return NextResponse.json({
                valid: true,
                registrant: {
                    id: matchedVol.id,
                    name: matchedVol.name,
                    category: matchedVol.category,
                    ticketId: matchedVol.ticketNumber,
                    mode: 'In-Person (Physical)',
                    institution: matchedVol.institution,
                    country: matchedVol.country,
                    designation: matchedVol.designation,
                    photoUrl: matchedVol.photoUrl,
                    isPaid: true,
                    paymentStatus: 'Official Volunteer Pass',
                    status: 'Active',
                },
                scanDetails: {
                    checkpoint,
                    checkpointName: checkpointConfig.name,
                    checkpointIcon: checkpointConfig.icon,
                    scanCountForCheckpoint: (isDuplicate ? 2 : 1),
                    isDuplicateScan: isDuplicate && checkpointConfig.singleUse,
                    lastPreviousScanAt: lastPreviousScan ? lastPreviousScan.timestamp : null,
                    totalScans,
                    scanHistory: existingScans
                }
            });
        }

        // 6. Check On-Spot / Blank Registration Badges (e.g. ORP5IC-SPOT-001)
        if (cleanQuery.includes('SPOT') || ticketId.toUpperCase().includes('SPOT-')) {
            const spotMatch = cleanQuery.match(/SPOT(\d+)/);
            const spotNum = spotMatch ? spotMatch[1].padStart(3, '0') : '001';
            const spotTicket = `ORP5IC-SPOT-${spotNum}`;

            const { existingScans, isDuplicate, lastPreviousScan, totalScans } = await recordOfficialBadgeScan(
                supabase, 
                spotTicket, 
                `On-Spot Delegate #${spotNum}`, 
                'ON-SPOT REGISTRATION', 
                'On-Spot Delegate Pass', 
                'Physical Registration Desk (Handwritten)', 
                'INDIA', 
                checkpoint, 
                checkpointConfig, 
                scannedBy, 
                location, 
                recordScan
            );

            return NextResponse.json({
                valid: true,
                registrant: {
                    id: `spot-${spotNum}`,
                    name: `On-Spot Delegate #${spotNum}`,
                    category: 'ON-SPOT REGISTRATION',
                    ticketId: spotTicket,
                    mode: 'In-Person (Physical)',
                    institution: 'Physical Registration Desk (Handwritten)',
                    country: 'INDIA',
                    designation: 'On-Spot Delegate Pass',
                    photoUrl: '',
                    isPaid: true,
                    paymentStatus: 'Official / On-Spot Pass',
                    status: 'Active',
                },
                scanDetails: {
                    checkpoint,
                    checkpointName: checkpointConfig.name,
                    checkpointIcon: checkpointConfig.icon,
                    scanCountForCheckpoint: (isDuplicate ? 2 : 1),
                    isDuplicateScan: isDuplicate && checkpointConfig.singleUse,
                    lastPreviousScanAt: lastPreviousScan ? lastPreviousScan.timestamp : null,
                    totalScans,
                    scanHistory: existingScans
                }
            });
        }

        return NextResponse.json({ valid: false, message: `Ticket "${ticketId}" not found in conference records.` }, { status: 404 });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: 'Verification failed: ' + error?.message }, { status: 500 });
    }
}

/**
 * Helper to record scans for special badges (Committee, Speaker, Volunteer, On-Spot)
 */
async function recordOfficialBadgeScan(
    supabase: any,
    ticketNumber: string,
    name: string,
    category: string,
    designation: string,
    institution: string,
    country: string,
    checkpoint: string,
    checkpointConfig: any,
    scannedBy: string,
    location: string,
    recordScan: boolean
) {
    try {
        // Look for existing row in registrations by ticket_number
        const { data: rows } = await supabase.from('registrations').select('*');
        let matchedRow = rows?.find((r: any) => (r.data?.ticket_number || '').toUpperCase() === ticketNumber.toUpperCase());

        let existingScans: any[] = [];
        if (matchedRow && Array.isArray(matchedRow.data?.scans)) {
            existingScans = [...matchedRow.data.scans];
        }

        const priorScansForCheckpoint = existingScans.filter((s: any) => s.checkpoint === checkpoint);
        const isDuplicate = priorScansForCheckpoint.length > 0;
        const lastPreviousScan = isDuplicate ? priorScansForCheckpoint[priorScansForCheckpoint.length - 1] : null;

        if (recordScan) {
            const newScan = {
                id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                checkpoint,
                checkpointName: checkpointConfig.name,
                timestamp: new Date().toISOString(),
                scannedBy: String(scannedBy || 'Gate Scanner'),
                location: String(location || 'Venue Checkpoint'),
                isDuplicate: isDuplicate,
                scanIndex: priorScansForCheckpoint.length + 1
            };
            existingScans.push(newScan);

            const payloadData = {
                ...(matchedRow?.data || {}),
                ticket_number: ticketNumber,
                full_name: name,
                category: category,
                designation: designation,
                institution: institution,
                country: country,
                nationality: country,
                payment_status: 'paid',
                mode: 'physical',
                scans: existingScans,
                last_scanned_at: newScan.timestamp,
                scan_count: existingScans.length,
                ...(checkpoint === 'kit_distribution' ? { kit_collected: true, kit_collected_at: newScan.timestamp } : {}),
                ...(checkpoint === 'main_entry' && !(matchedRow?.data?.checked_in_at) ? { checked_in_at: newScan.timestamp } : {})
            };

            if (matchedRow) {
                await supabase.from('registrations').update({ data: payloadData }).eq('id', matchedRow.id);
            } else {
                await supabase.from('registrations').insert({
                    data: payloadData,
                    status: 'approved',
                    submitted_at: new Date().toISOString()
                });
            }
        }

        return {
            existingScans,
            isDuplicate,
            lastPreviousScan,
            totalScans: existingScans.length
        };
    } catch (e) {
        console.error('Error recording official badge scan:', e);
        return { existingScans: [], isDuplicate: false, lastPreviousScan: null, totalScans: 1 };
    }
}
