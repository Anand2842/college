import { Metadata } from 'next';
import AwardsClient from './AwardsClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'Awards & Prizes | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function AwardsPage() {
    const initialData = await getPageContent('awards').catch(() => null);
    return <AwardsClient initialData={initialData || undefined} />;
}
