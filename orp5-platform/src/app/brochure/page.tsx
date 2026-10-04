import { Metadata } from 'next';
import BrochureClient from './BrochureClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'Brochure | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function BrochurePage() {
    const initialData = await getPageContent('brochure').catch(() => null);
    return <BrochureClient initialData={initialData || undefined} />;
}
