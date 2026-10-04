import { Metadata } from 'next';
import AccommodationClient from './AccommodationClient';
import { getAccommodationPageData } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'Accommodation | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function AccommodationPage() {
    const initialData = await getAccommodationPageData().catch(() => null);
    return <AccommodationClient initialData={initialData || undefined} />;
}
