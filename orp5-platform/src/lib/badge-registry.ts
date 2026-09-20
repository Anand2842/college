import { getSupabaseAdmin } from '@/lib/supabase-admin';

export interface CanonicalBadgeEntry {
    id: string;
    name: string;
    ticketNumber: string;
    category: string;
    group: 'delegate' | 'committee' | 'speaker' | 'volunteer' | 'blank';
    subgroup: string;
    country: string;
    institution: string;
    designation: string;
    photoUrl: string;
    mode: string;
    paymentStatus: string;
    isPaid: boolean;
    hasAbstract: boolean;
    abstractStatus: string;
    abstractTitle: string;
    email?: string;
    phone?: string;
    userId?: string;
    submittedAt?: string;
    registrationId?: string;
    scans?: any[];
}

// Canonical name helper for exact and fuzzy matching
export function getCanonicalName(rawName?: string): string {
    if (!rawName) return '';
    return rawName
        .toLowerCase()
        .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|er\.|lt\(dr\.\)|lt\.|shri|smt\.)\s*/gi, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

/**
 * Returns the exact master list of all printed conference badges (Delegates, Committee, Speakers, Volunteers, Spot Badges).
 * This ensures 100% parity between what was printed on the badges and what the QR scanner resolves.
 */
export async function getCanonicalConferenceBadgeDirectory(): Promise<{
    allBadges: CanonicalBadgeEntry[];
    badgeMapByTicket: Map<string, CanonicalBadgeEntry>;
    badgeMapById: Map<string, CanonicalBadgeEntry>;
    badgeMapByEmail: Map<string, CanonicalBadgeEntry>;
    badgeMapByPhone: Map<string, CanonicalBadgeEntry>;
    badgeMapByCanonicalName: Map<string, CanonicalBadgeEntry>;
}> {
    const supabase = getSupabaseAdmin();

    // 1. Fetch Registered Delegates and Abstracts in parallel
    const [{ data: regRows, error: regErr }, { data: absRows, error: absErr }] = await Promise.all([
        supabase.from('registrations').select('*').order('created_at', { ascending: false }),
        supabase.from('abstracts').select('id, email, phone, user_id, status, title')
    ]);

    if (regErr) console.error("Error fetching registrations in badge registry:", regErr);
    if (absErr) console.error("Error fetching abstracts in badge registry:", absErr);

    // Build quick lookup maps for abstracts
    const absByEmail = new Map<string, any>();
    const absByPhone = new Map<string, any>();
    const absByUser = new Map<string, any>();

    (absRows || []).forEach((a: any) => {
        if (a.email) absByEmail.set(a.email.trim().toLowerCase(), a);
        if (a.phone) absByPhone.set(a.phone.trim().replace(/\D/g, ''), a);
        if (a.user_id) absByUser.set(a.user_id, a);
    });

    const delegates: CanonicalBadgeEntry[] = (regRows || [])
        .filter((row: any) => {
            const data = row.data || {};
            const status = data.payment_status || row.status;
            return status !== 'duplicate_cancelled' && status !== 'cancelled' && status !== 'rejected';
        })
        .map((row: any) => {
            const data = row.data || {};
            const country = data.country || (data.nationality === 'indian' ? 'India' : 'International');
            const rawMode = (data.mode || row.mode || 'physical').toLowerCase();
            const mode = rawMode.includes('virtual') || rawMode.includes('online') ? 'virtual' : 'physical';

            const email = (data.email || row.email || '').trim().toLowerCase();
            const phone = (data.phone || row.phone || data.mobile || '').trim().replace(/\D/g, '');
            const userId = row.user_id || data.user_id || '';

            const matchedAbs = (email ? absByEmail.get(email) : null) ||
                              (phone ? absByPhone.get(phone) : null) ||
                              (userId ? absByUser.get(userId) : null);

            const hasAbstract = !!matchedAbs;
            const abstractStatus = matchedAbs?.status || 'none';
            const abstractTitle = matchedAbs?.title || '';

            const paymentStatus = data.payment_status || row.status || 'awaiting_payment';
            const isPaid = (paymentStatus).toLowerCase() === 'paid' ||
                           (paymentStatus).toLowerCase() === 'confirmed' ||
                           (paymentStatus).toLowerCase() === 'payment_claimed' ||
                           (paymentStatus).toLowerCase() === 'free_pass';

            const ticketNumber = data.ticket_number || data.ticketId || `ORP5IC-IND-${row.id.substring(0, 5).toUpperCase()}`;

            return {
                id: row.id,
                registrationId: row.id,
                name: data.full_name || data.fullName || 'Registered Delegate',
                ticketNumber: ticketNumber.toUpperCase().trim(),
                category: (data.category || 'Delegate').toUpperCase(),
                group: 'delegate' as const,
                subgroup: data.category || 'Delegate',
                country: country.toUpperCase(),
                institution: data.institution || data.affiliation || '',
                designation: data.designation || '',
                photoUrl: data.photo_url || data.photoUrl || data.avatar_url || '',
                mode,
                paymentStatus,
                isPaid,
                hasAbstract,
                abstractStatus,
                abstractTitle,
                email,
                phone,
                userId,
                submittedAt: row.created_at || data.submittedAt,
                scans: Array.isArray(data.scans) ? data.scans : []
            };
        });

    // 2. Fetch Speakers
    const { data: spkPage, error: spkErr } = await supabase
        .from('Page')
        .select('content')
        .eq('slug', 'speakers')
        .maybeSingle();

    if (spkErr) console.error("Error fetching speakers page in registry:", spkErr);

    const spkContent = spkPage?.content || {};
    const rawSpeakers = [
        ...(spkContent.keynotes || []).map((s: any) => ({ ...s, speakerType: 'Keynote Speaker', priority: 3 })),
        ...(spkContent.invited || []).map((s: any) => ({ ...s, speakerType: 'Invited Speaker', priority: 2 })),
        ...(spkContent.panel || []).map((s: any) => ({ ...s, speakerType: 'Panel Speaker', priority: 1 })),
    ];

    const uniqueSpeakersMap = new Map<string, any>();
    rawSpeakers.forEach((s: any) => {
        const cn = getCanonicalName(s.name);
        if (!cn) return;
        if (!uniqueSpeakersMap.has(cn)) {
            uniqueSpeakersMap.set(cn, s);
        } else {
            const exist = uniqueSpeakersMap.get(cn);
            if (s.priority > (exist.priority || 0)) {
                uniqueSpeakersMap.set(cn, { ...exist, ...s });
            }
        }
    });

    let spkCounter = 1;
    const dedupedSpeakers: CanonicalBadgeEntry[] = Array.from(uniqueSpeakersMap.values()).map((s: any) => {
        const paddedId = String(spkCounter++).padStart(3, '0');
        return {
            id: s.id || `spk-${paddedId}`,
            name: s.name || 'Distinguished Speaker',
            ticketNumber: `ORP5IC-SPK-${paddedId}`,
            category: (s.speakerType || 'KEYNOTE SPEAKER').toUpperCase(),
            group: 'speaker' as const,
            subgroup: s.speakerType || 'Keynote Speaker',
            country: (s.countryCode === 'IN' ? 'India' : (s.country || 'International')).toUpperCase(),
            institution: s.institution || '',
            designation: s.role || 'Speaker',
            photoUrl: s.imageUrl || '',
            mode: 'physical',
            paymentStatus: 'paid',
            isPaid: true,
            hasAbstract: false,
            abstractStatus: 'none',
            abstractTitle: '',
        };
    });
    const speakerNames = new Set(dedupedSpeakers.map((s: any) => getCanonicalName(s.name)));

    // 3. Fetch Committee Members
    const { data: commPage, error: commErr } = await supabase
        .from('Page')
        .select('content')
        .eq('slug', 'committees')
        .maybeSingle();

    if (commErr) console.error("Error fetching committees page in registry:", commErr);

    const committeeContent = commPage?.content || {};
    const rawCommitteeList: any[] = [];

    if (Array.isArray(committeeContent.committees)) {
        committeeContent.committees.forEach((cm: any) => {
            const groupLabel = cm.label || 'Committee Member';
            if (Array.isArray(cm.members)) {
                cm.members.forEach((m: any) => {
                    rawCommitteeList.push({
                        id: m.id,
                        name: m.name || 'Committee Member',
                        category: groupLabel.toUpperCase(),
                        group: 'committee' as const,
                        subgroup: groupLabel,
                        country: (m.country || 'India').toUpperCase(),
                        institution: m.affiliation || '',
                        designation: m.role || '',
                        photoUrl: m.imageUrl || '',
                        mode: 'physical',
                        paymentStatus: 'paid',
                        isPaid: true,
                        hasAbstract: false,
                        abstractStatus: 'none',
                        abstractTitle: '',
                    });
                });
            }
        });
    }

    if (Array.isArray(committeeContent.contacts)) {
        committeeContent.contacts.forEach((c: any) => {
            rawCommitteeList.push({
                id: c.id,
                name: c.name || 'Organizing Secretariat',
                category: 'ORGANIZING SECRETARIAT',
                group: 'committee' as const,
                subgroup: 'Secretariat',
                country: 'INDIA',
                institution: 'ORP-5 Organizing Committee',
                designation: c.role || 'Secretariat',
                photoUrl: c.imageUrl || '',
                mode: 'physical',
                paymentStatus: 'paid',
                isPaid: true,
                hasAbstract: false,
                abstractStatus: 'none',
                abstractTitle: '',
            });
        });
    }

    const committeePriority: Record<string, number> = {
        'ORGANIZING SECRETARIAT': 100,
        'ORGANIZING COMMITTEE': 90,
        'CORE COMMITTEE': 85,
        'STEERING COMMITTEE': 80,
        'EDITORIAL & PUBLICATION': 70,
        'NATIONAL ADVISORY COMMITTEE': 60,
        'INTERNATIONAL SCIENTIFIC COMMITTEE': 50,
    };

    const uniqueCommitteeMap = new Map<string, any>();
    rawCommitteeList.forEach((cm: any) => {
        const cn = getCanonicalName(cm.name);
        if (!cn) return;
        if (speakerNames.has(cn)) return;

        if (!uniqueCommitteeMap.has(cn)) {
            uniqueCommitteeMap.set(cn, cm);
        } else {
            const exist = uniqueCommitteeMap.get(cn);
            const curPriority = committeePriority[cm.category] || 10;
            const existPriority = committeePriority[exist.category] || 10;

            if (curPriority > existPriority || (curPriority === existPriority && !exist.designation && cm.designation)) {
                uniqueCommitteeMap.set(cn, {
                    ...exist,
                    ...cm,
                    institution: cm.institution || exist.institution,
                    photoUrl: cm.photoUrl || exist.photoUrl,
                });
            }
        }
    });

    let comCounter = 1;
    const dedupedCommittee: CanonicalBadgeEntry[] = Array.from(uniqueCommitteeMap.values()).map((cm: any) => {
        const paddedId = String(comCounter++).padStart(3, '0');
        return {
            ...cm,
            id: cm.id || `comm-${paddedId}`,
            ticketNumber: `ORP5IC-COM-${paddedId}`,
        };
    });
    const committeeNames = new Set(dedupedCommittee.map((c: any) => getCanonicalName(c.name)));

    // 4. Default Volunteers Cohort
    const defaultVolunteers: CanonicalBadgeEntry[] = [
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
            name: v.name,
            ticketNumber: `ORP5IC-VOL-${paddedId}`,
            category: 'CONFERENCE VOLUNTEER',
            group: 'volunteer' as const,
            subgroup: 'Volunteer',
            country: v.country,
            institution: v.institution,
            designation: v.designation,
            photoUrl: '',
            mode: 'physical',
            paymentStatus: 'paid',
            isPaid: true,
            hasAbstract: false,
            abstractStatus: 'none',
            abstractTitle: '',
        };
    });

    // 5. Deduplicate Delegates against themselves and enrich speakers/committee
    const uniqueDelegatesMap = new Map<string, CanonicalBadgeEntry>();
    delegates.forEach((del) => {
        const cName = getCanonicalName(del.name);
        const email = (del.email || '').trim().toLowerCase();
        const phone = (del.phone || '').trim().replace(/\D/g, '');

        let primaryKey = '';
        if (email && email.includes('@')) primaryKey = `email:${email}`;
        else if (phone && phone.length >= 8) primaryKey = `phone:${phone}`;
        else if (cName && cName.length >= 4) primaryKey = `name:${cName}`;
        else primaryKey = `id:${del.id}`;

        if (!uniqueDelegatesMap.has(primaryKey)) {
            uniqueDelegatesMap.set(primaryKey, del);
        } else {
            const existing = uniqueDelegatesMap.get(primaryKey)!;
            const isDelPaid = del.isPaid;
            const isExistPaid = existing.isPaid;

            if (!isExistPaid && isDelPaid) {
                uniqueDelegatesMap.set(primaryKey, del);
            } else if (isDelPaid === isExistPaid && !existing.hasAbstract && del.hasAbstract) {
                uniqueDelegatesMap.set(primaryKey, del);
            }
        }
    });

    const deduplicatedDelegates = Array.from(uniqueDelegatesMap.values());
    const delegateLookup = new Map<string, CanonicalBadgeEntry>();
    deduplicatedDelegates.forEach((d) => {
        const cn = getCanonicalName(d.name);
        if (cn) delegateLookup.set(cn, d);
    });

    // Enrich speakers
    const enrichedSpeakers = dedupedSpeakers.map((spk) => {
        const cn = getCanonicalName(spk.name);
        const matchedDel = cn ? delegateLookup.get(cn) : null;
        if (matchedDel) {
            return {
                ...spk,
                registrationId: matchedDel.registrationId,
                hasAbstract: spk.hasAbstract || matchedDel.hasAbstract,
                abstractStatus: spk.abstractStatus !== 'none' ? spk.abstractStatus : matchedDel.abstractStatus,
                abstractTitle: spk.abstractTitle || matchedDel.abstractTitle,
                country: spk.country || matchedDel.country,
                institution: spk.institution || matchedDel.institution,
                email: matchedDel.email || spk.email,
                phone: matchedDel.phone || spk.phone,
                scans: matchedDel.scans || [],
            };
        }
        return spk;
    });

    // Enrich committee
    const enrichedCommittee = dedupedCommittee.map((cm) => {
        const cn = getCanonicalName(cm.name);
        const matchedDel = cn ? delegateLookup.get(cn) : null;
        if (matchedDel) {
            return {
                ...cm,
                registrationId: matchedDel.registrationId,
                hasAbstract: cm.hasAbstract || matchedDel.hasAbstract,
                abstractStatus: cm.abstractStatus !== 'none' ? cm.abstractStatus : matchedDel.abstractStatus,
                abstractTitle: cm.abstractTitle || matchedDel.abstractTitle,
                country: cm.country || matchedDel.country,
                institution: cm.institution || matchedDel.institution,
                email: matchedDel.email || cm.email,
                phone: matchedDel.phone || cm.phone,
                scans: matchedDel.scans || [],
            };
        }
        return cm;
    });

    // Final Delegates (remove people already honored as Speaker or Committee)
    const finalDelegates = deduplicatedDelegates.filter((del) => {
        const cn = getCanonicalName(del.name);
        if (!cn) return true;
        if (speakerNames.has(cn)) return false;
        if (committeeNames.has(cn)) return false;
        return true;
    });

    // 6. Blank / On-Spot Badges
    const blankCards: CanonicalBadgeEntry[] = Array.from({ length: 25 }).map((_, index) => {
        const paddedId = String(index + 1).padStart(3, '0');
        return {
            id: `spot-${paddedId}`,
            name: "ON-SPOT DELEGATE",
            ticketNumber: `ORP5IC-SPOT-${paddedId}`,
            category: "ON-SPOT REGISTRATION",
            group: 'blank' as const,
            subgroup: "Blank Card",
            country: "INDIA",
            institution: "On-Spot Attendee",
            designation: "Attendee",
            photoUrl: "",
            mode: "physical",
            paymentStatus: "paid",
            isPaid: true,
            hasAbstract: false,
            abstractStatus: "none",
            abstractTitle: "",
        };
    });

    const allBadges: CanonicalBadgeEntry[] = [
        ...finalDelegates,
        ...enrichedCommittee,
        ...enrichedSpeakers,
        ...defaultVolunteers,
        ...blankCards
    ];

    // Build Fast Lookup Maps
    const badgeMapByTicket = new Map<string, CanonicalBadgeEntry>();
    const badgeMapById = new Map<string, CanonicalBadgeEntry>();
    const badgeMapByEmail = new Map<string, CanonicalBadgeEntry>();
    const badgeMapByPhone = new Map<string, CanonicalBadgeEntry>();
    const badgeMapByCanonicalName = new Map<string, CanonicalBadgeEntry>();

    // Also index raw registrations in badgeMapByTicket so ANY raw delegate ticket_number from DB always resolves
    (regRows || []).forEach((row: any) => {
        const data = row.data || {};
        const tNum = (data.ticket_number || data.ticketId || `ORP5IC-IND-${row.id.substring(0, 5).toUpperCase()}`).toUpperCase().trim();
        const foundBadge = allBadges.find(b => b.registrationId === row.id || b.id === row.id);
        if (foundBadge) {
            badgeMapByTicket.set(tNum, foundBadge);
            badgeMapById.set(row.id.toLowerCase(), foundBadge);
        }
    });

    allBadges.forEach((b) => {
        if (b.ticketNumber) {
            badgeMapByTicket.set(b.ticketNumber.toUpperCase().trim(), b);
            badgeMapByTicket.set(b.ticketNumber.toUpperCase().replace(/[^A-Z0-9]/g, ''), b);
        }
        if (b.id) {
            badgeMapById.set(b.id.toLowerCase(), b);
        }
        if (b.email) {
            badgeMapByEmail.set(b.email.toLowerCase().trim(), b);
        }
        if (b.phone) {
            badgeMapByPhone.set(b.phone.replace(/\D/g, ''), b);
        }
        const cn = getCanonicalName(b.name);
        if (cn && !badgeMapByCanonicalName.has(cn)) {
            badgeMapByCanonicalName.set(cn, b);
        }
    });

    return {
        allBadges,
        badgeMapByTicket,
        badgeMapById,
        badgeMapByEmail,
        badgeMapByPhone,
        badgeMapByCanonicalName
    };
}
