import { createPageMetadata } from '@/lib/metadata';
import SponsorshipClient from './SponsorshipClient';
import { getSponsorshipPageData } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
    title: 'Sponsorship & Partnerships',
    description: 'Sponsorship opportunities for the 5th International Conference on Organic and Natural Rice Production Systems (ORP-5). Position your brand as an agriscience leader before 500+ global delegates.',
    path: '/sponsorship',
});

export default async function SponsorshipPage() {
    const initialData = await getSponsorshipPageData();
    return <SponsorshipClient initialData={initialData} />;
}
