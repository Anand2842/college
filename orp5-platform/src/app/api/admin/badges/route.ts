import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();

        // 1. Fetch Registered Delegates and Abstracts in parallel
        const [{ data: regRows, error: regErr }, { data: absRows, error: absErr }] = await Promise.all([
            supabase.from('registrations').select('*').order('created_at', { ascending: false }),
            supabase.from('abstracts').select('id, email, phone, user_id, status, title')
        ]);

        if (regErr) console.error("Error fetching registrations:", regErr);
        if (absErr) console.error("Error fetching abstracts:", absErr);

        // Build quick lookup maps for abstracts
        const absByEmail = new Map<string, any>();
        const absByPhone = new Map<string, any>();
        const absByUser = new Map<string, any>();

        (absRows || []).forEach((a: any) => {
            if (a.email) absByEmail.set(a.email.trim().toLowerCase(), a);
            if (a.phone) absByPhone.set(a.phone.trim().replace(/\D/g, ''), a);
            if (a.user_id) absByUser.set(a.user_id, a);
        });

        const delegates = (regRows || [])
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

                return {
                    id: row.id,
                    name: data.full_name || data.fullName || 'Registered Delegate',
                    ticketNumber: data.ticket_number || data.ticketId || `ORP5IC-IND-${row.id.substring(0, 5).toUpperCase()}`,
                    category: (data.category || 'Delegate').toUpperCase(),
                    group: 'delegate',
                    subgroup: data.category || 'Delegate',
                    country: country.toUpperCase(),
                    institution: data.institution || data.affiliation || '',
                    designation: data.designation || '',
                    photoUrl: data.photo_url || data.photoUrl || data.avatar_url || '',
                    mode: mode,
                    paymentStatus: data.payment_status || row.status || 'awaiting_payment',
                    hasAbstract: hasAbstract,
                    abstractStatus: abstractStatus,
                    abstractTitle: abstractTitle,
                    submittedAt: row.created_at || data.submittedAt,
                };
            });

        // Helper: normalize names for canonical matching
        function getCanonicalName(rawName?: string): string {
            if (!rawName) return '';
            return rawName
                .toLowerCase()
                .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|er\.|lt\(dr\.\)|lt\.|shri|smt\.)\s*/gi, '')
                .replace(/[^a-z0-9]/g, '')
                .trim();
        }

        // 2. Fetch Speakers
        const { data: spkPage, error: spkErr } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'speakers')
            .maybeSingle();

        if (spkErr) console.error("Error fetching speakers page:", spkErr);

        const spkContent = spkPage?.content || {};
        const rawSpeakers = [
            ...(spkContent.keynotes || []).map((s: any) => ({ ...s, speakerType: 'Keynote Speaker', priority: 3 })),
            ...(spkContent.invited || []).map((s: any) => ({ ...s, speakerType: 'Invited Speaker', priority: 2 })),
            ...(spkContent.panel || []).map((s: any) => ({ ...s, speakerType: 'Panel Speaker', priority: 1 })),
        ];

        // Deduplicate Speakers
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
        const dedupedSpeakers = Array.from(uniqueSpeakersMap.values()).map((s: any) => {
            const paddedId = String(spkCounter++).padStart(3, '0');
            return {
                id: s.id || `spk-${paddedId}`,
                name: s.name || 'Distinguished Speaker',
                ticketNumber: `ORP5IC-SPK-${paddedId}`,
                category: (s.speakerType || 'KEYNOTE SPEAKER').toUpperCase(),
                group: 'speaker',
                subgroup: s.speakerType || 'Keynote Speaker',
                country: (s.countryCode === 'IN' ? 'India' : (s.country || 'International')).toUpperCase(),
                institution: s.institution || '',
                designation: s.role || 'Speaker',
                photoUrl: s.imageUrl || '',
                mode: 'physical',
                paymentStatus: 'paid',
            };
        });
        const speakerNames = new Set(dedupedSpeakers.map((s: any) => getCanonicalName(s.name)));

        // 3. Fetch Committee Members
        const { data: commPage, error: commErr } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'committees')
            .maybeSingle();

        if (commErr) console.error("Error fetching committees page:", commErr);

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
                            group: 'committee',
                            subgroup: groupLabel,
                            country: (m.country || 'India').toUpperCase(),
                            institution: m.affiliation || '',
                            designation: m.role || '',
                            photoUrl: m.imageUrl || '',
                            mode: 'physical',
                            paymentStatus: 'paid',
                        });
                    });
                }
            });
        }

        // Add Key Contacts as Committee
        if (Array.isArray(committeeContent.contacts)) {
            committeeContent.contacts.forEach((c: any) => {
                rawCommitteeList.push({
                    id: c.id,
                    name: c.name || 'Organizing Secretariat',
                    category: 'ORGANIZING SECRETARIAT',
                    group: 'committee',
                    subgroup: 'Secretariat',
                    country: 'INDIA',
                    institution: 'ORP-5 Organizing Committee',
                    designation: c.role || 'Secretariat',
                    photoUrl: c.imageUrl || '',
                    mode: 'physical',
                    paymentStatus: 'paid',
                });
            });
        }

        // Priority hierarchy for committee categories
        const committeePriority: Record<string, number> = {
            'ORGANIZING SECRETARIAT': 100,
            'ORGANIZING COMMITTEE': 90,
            'CORE COMMITTEE': 85,
            'STEERING COMMITTEE': 80,
            'EDITORIAL & PUBLICATION': 70,
            'NATIONAL ADVISORY COMMITTEE': 60,
            'INTERNATIONAL SCIENTIFIC COMMITTEE': 50,
        };

        // Intra-Committee Deduplication
        const uniqueCommitteeMap = new Map<string, any>();
        rawCommitteeList.forEach((cm: any) => {
            const cn = getCanonicalName(cm.name);
            if (!cn) return;

            // If already a Speaker, do NOT duplicate into Committee
            if (speakerNames.has(cn)) return;

            if (!uniqueCommitteeMap.has(cn)) {
                uniqueCommitteeMap.set(cn, cm);
            } else {
                const exist = uniqueCommitteeMap.get(cn);
                const curPriority = committeePriority[cm.category] || 10;
                const existPriority = committeePriority[exist.category] || 10;

                // Prefer higher priority category, or keep the more descriptive role/designation
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
        const dedupedCommittee = Array.from(uniqueCommitteeMap.values()).map((cm: any) => {
            const paddedId = String(comCounter++).padStart(3, '0');
            return {
                ...cm,
                id: cm.id || `comm-${paddedId}`,
                ticketNumber: `ORP5IC-COM-${paddedId}`,
            };
        });
        const committeeNames = new Set(dedupedCommittee.map((c: any) => getCanonicalName(c.name)));

        // 4. Default Volunteers Cohort
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
                name: v.name,
                ticketNumber: `ORP5IC-VOL-${paddedId}`,
                category: 'CONFERENCE VOLUNTEER',
                group: 'volunteer',
                subgroup: 'Volunteer',
                country: v.country,
                institution: v.institution,
                designation: v.designation,
                photoUrl: '',
                mode: 'physical',
                paymentStatus: 'paid',
            };
        });

        // --- Step 1: Intra-Registration Deduplication ---
        // Group delegates by email, phone, and canonical name
        const uniqueDelegatesMap = new Map<string, any>();
        
        delegates.forEach((del: any) => {
            const cName = getCanonicalName(del.name);
            const email = (del.email || '').trim().toLowerCase();
            const phone = (del.phone || '').trim().replace(/\D/g, '');
            
            // Generate composite key
            let primaryKey = '';
            if (email && email.includes('@')) {
                primaryKey = `email:${email}`;
            } else if (phone && phone.length >= 8) {
                primaryKey = `phone:${phone}`;
            } else if (cName && cName.length >= 4) {
                primaryKey = `name:${cName}`;
            } else {
                primaryKey = `id:${del.id}`;
            }

            if (!uniqueDelegatesMap.has(primaryKey)) {
                uniqueDelegatesMap.set(primaryKey, del);
            } else {
                const existing = uniqueDelegatesMap.get(primaryKey);
                const isDelPaid = del.paymentStatus === 'paid' || del.paymentStatus === 'confirmed';
                const isExistPaid = existing.paymentStatus === 'paid' || existing.paymentStatus === 'confirmed';

                // Prefer paid over unpaid, or prefer the one with abstract
                if (!isExistPaid && isDelPaid) {
                    uniqueDelegatesMap.set(primaryKey, del);
                } else if (isDelPaid === isExistPaid && !existing.hasAbstract && del.hasAbstract) {
                    uniqueDelegatesMap.set(primaryKey, del);
                }
            }
        });

        const deduplicatedDelegates = Array.from(uniqueDelegatesMap.values());

        // --- Step 2: Cross-Category Role Precedence Deduplication ---
        // Enrich speaker and committee profiles with delegate abstract metadata if available
        const delegateLookup = new Map<string, any>();
        deduplicatedDelegates.forEach((d: any) => {
            const cn = getCanonicalName(d.name);
            if (cn) delegateLookup.set(cn, d);
        });

        const enrichedSpeakers = dedupedSpeakers.map((spk: any) => {
            const cn = getCanonicalName(spk.name);
            const matchedDel = cn ? delegateLookup.get(cn) : null;
            if (matchedDel) {
                return {
                    ...spk,
                    hasAbstract: spk.hasAbstract || matchedDel.hasAbstract,
                    abstractStatus: spk.abstractStatus || matchedDel.abstractStatus,
                    abstractTitle: spk.abstractTitle || matchedDel.abstractTitle,
                    country: spk.country || matchedDel.country,
                    institution: spk.institution || matchedDel.institution,
                };
            }
            return spk;
        });

        const enrichedCommittee = dedupedCommittee.map((cm: any) => {
            const cn = getCanonicalName(cm.name);
            const matchedDel = cn ? delegateLookup.get(cn) : null;
            if (matchedDel) {
                return {
                    ...cm,
                    hasAbstract: cm.hasAbstract || matchedDel.hasAbstract,
                    abstractStatus: cm.abstractStatus || matchedDel.abstractStatus,
                    abstractTitle: cm.abstractTitle || matchedDel.abstractTitle,
                    country: cm.country || matchedDel.country,
                    institution: cm.institution || matchedDel.institution,
                };
            }
            return cm;
        });

        // Filter out delegates who are already covered as Speaker or Committee member
        const finalDelegates = deduplicatedDelegates.filter((del: any) => {
            const cn = getCanonicalName(del.name);
            if (!cn) return true;
            if (speakerNames.has(cn)) return false; // Speaker badge generated
            if (committeeNames.has(cn)) return false; // Committee/Secretariat badge generated
            return true;
        });

        // --- Step 3: Generate 25 Blank / On-Spot Badges ---
        const blankCards = Array.from({ length: 25 }).map((_, index) => {
            const paddedId = String(index + 1).padStart(3, '0');
            return {
                id: `spot-${paddedId}`,
                name: "____________________________",
                ticketNumber: `ORP5IC-SPOT-${paddedId}`,
                category: "ON-SPOT REGISTRATION",
                group: "blank",
                subgroup: "Blank Card",
                country: "INDIA",
                institution: "____________________________",
                designation: "",
                photoUrl: "",
                mode: "physical",
                paymentStatus: "paid",
                isBlank: true,
            };
        });

        const rawTotalCount = delegates.length + rawCommitteeList.length + rawSpeakers.length + defaultVolunteers.length;
        const allDeduplicated = [...finalDelegates, ...enrichedCommittee, ...enrichedSpeakers, ...defaultVolunteers, ...blankCards];
        const duplicatesMergedCount = rawTotalCount - (allDeduplicated.length - blankCards.length);

        return NextResponse.json({
            success: true,
            summary: {
                total: allDeduplicated.length,
                rawTotal: rawTotalCount,
                duplicatesMerged: duplicatesMergedCount,
                delegates: finalDelegates.length,
                committee: enrichedCommittee.length,
                speakers: enrichedSpeakers.length,
                volunteers: defaultVolunteers.length,
                blank: blankCards.length,
            },
            attendees: allDeduplicated,
        });
    } catch (e: any) {
        console.error("Error in /api/admin/badges:", e);
        return NextResponse.json({ success: false, error: e.message || 'Error fetching badges data' }, { status: 500 });
    }
}
