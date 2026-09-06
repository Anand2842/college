import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();

        // 1. Fetch Registered Delegates
        const { data: regRows, error: regErr } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (regErr) console.error("Error fetching registrations:", regErr);

        const delegates = (regRows || []).map((row: any) => {
            const data = row.data || {};
            const country = data.country || (data.nationality === 'indian' ? 'India' : 'International');
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
                mode: data.mode || 'physical',
                paymentStatus: data.payment_status || 'awaiting_payment',
                submittedAt: row.created_at || data.submittedAt,
            };
        });

        // 2. Fetch Committee Members
        const { data: commPage, error: commErr } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'committees')
            .maybeSingle();

        if (commErr) console.error("Error fetching committees page:", commErr);

        const committeeContent = commPage?.content || {};
        const committeeMembers: any[] = [];
        let comCounter = 1;

        if (Array.isArray(committeeContent.committees)) {
            committeeContent.committees.forEach((cm: any) => {
                const groupLabel = cm.label || 'Committee Member';
                if (Array.isArray(cm.members)) {
                    cm.members.forEach((m: any) => {
                        const paddedId = String(comCounter++).padStart(3, '0');
                        committeeMembers.push({
                            id: m.id || `comm-${paddedId}`,
                            name: m.name || 'Committee Member',
                            ticketNumber: `ORP5IC-COM-${paddedId}`,
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
                const paddedId = String(comCounter++).padStart(3, '0');
                committeeMembers.push({
                    id: c.id || `contact-${paddedId}`,
                    name: c.name || 'Organizing Secretariat',
                    ticketNumber: `ORP5IC-COM-${paddedId}`,
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

        // 3. Fetch Speakers
        const { data: spkPage, error: spkErr } = await supabase
            .from('Page')
            .select('content')
            .eq('slug', 'speakers')
            .maybeSingle();

        if (spkErr) console.error("Error fetching speakers page:", spkErr);

        const spkContent = spkPage?.content || {};
        const speakers: any[] = [];
        let spkCounter = 1;

        const allSpkList = [
            ...(spkContent.keynotes || []).map((s: any) => ({ ...s, speakerType: 'Keynote Speaker' })),
            ...(spkContent.invited || []).map((s: any) => ({ ...s, speakerType: 'Invited Speaker' })),
            ...(spkContent.panel || []).map((s: any) => ({ ...s, speakerType: 'Panel Speaker' })),
        ];

        allSpkList.forEach((s: any) => {
            const paddedId = String(spkCounter++).padStart(3, '0');
            speakers.push({
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
            });
        });

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

        const all = [...delegates, ...committeeMembers, ...speakers, ...defaultVolunteers];

        return NextResponse.json({
            success: true,
            summary: {
                total: all.length,
                delegates: delegates.length,
                committee: committeeMembers.length,
                speakers: speakers.length,
                volunteers: defaultVolunteers.length,
            },
            attendees: all,
        });
    } catch (e: any) {
        console.error("Error in /api/admin/badges:", e);
        return NextResponse.json({ success: false, error: e.message || 'Error fetching badges data' }, { status: 500 });
    }
}
