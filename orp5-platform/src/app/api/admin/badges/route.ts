import { NextResponse } from 'next/server';
import { getCanonicalConferenceBadgeDirectory } from '@/lib/badge-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { allBadges } = await getCanonicalConferenceBadgeDirectory();

        const delegates = allBadges.filter(b => b.group === 'delegate');
        const committee = allBadges.filter(b => b.group === 'committee');
        const speakers = allBadges.filter(b => b.group === 'speaker');
        const volunteers = allBadges.filter(b => b.group === 'volunteer');
        const blank = allBadges.filter(b => b.group === 'blank');

        return NextResponse.json({
            success: true,
            summary: {
                total: allBadges.length,
                delegates: delegates.length,
                committee: committee.length,
                speakers: speakers.length,
                volunteers: volunteers.length,
                blank: blank.length,
            },
            attendees: allBadges,
        });
    } catch (e: any) {
        console.error("Error in /api/admin/badges:", e);
        return NextResponse.json({ success: false, error: e.message || 'Error fetching badges data' }, { status: 500 });
    }
}
