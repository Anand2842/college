import { createPageMetadata } from '@/lib/metadata';
import ProgrammeClient from './ProgrammeClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata = createPageMetadata({
    title: 'Programme',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/programme',
});

export default async function ProgrammePage() {
    const initialData = await getPageContent('programme').catch(() => null);
    return <ProgrammeClient initialData={initialData || undefined} />;
}
