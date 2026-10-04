import { Metadata } from 'next';
import ImportantDatesClient from './ImportantDatesClient';
import { getImportantDatesPageData } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'Important Dates | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function ImportantDatesPage() {
    const initialData = await getImportantDatesPageData().catch(() => null);
    return <ImportantDatesClient initialData={initialData || undefined} />;
}
