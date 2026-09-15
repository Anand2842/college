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
                });
            });
        }

        // Match against committee & secretariat
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
                }
            });
        }

        return NextResponse.json({ valid: false, message: `Ticket "${ticketId}" not found in conference records.` }, { status: 404 });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: 'Verification failed: ' + error?.message }, { status: 500 });
    }
}
