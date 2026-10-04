import { Metadata } from 'next';
import CityClient from './CityClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'City | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function CityPage() {
    const initialData = await getPageContent('city').catch(() => null);
    return <CityClient initialData={initialData || undefined} />;
}
