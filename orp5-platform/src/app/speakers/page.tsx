import { createPageMetadata } from '@/lib/metadata';
import SpeakersClient from './SpeakersClient';
import { getSpeakersPageData } from '@/lib/cms';

export const revalidate = 0; // Dynamic rendering for instant admin updates

export const metadata = createPageMetadata({
    title: 'Keynote & Invited Speakers',
    description: 'Learn from world-renowned experts, researchers, and policymakers shaping the future of organic and natural rice farming.',
    path: '/speakers',
});

export default async function SpeakersPage() {
    const initialData = await getSpeakersPageData();
    return <SpeakersClient initialData={initialData} />;
}
