import { Metadata } from 'next';
import HowToReachClient from './HowToReachClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'How to Reach | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function HowToReachPage() {
    const initialData = await getPageContent('how-to-reach').catch(() => null);
    return <HowToReachClient initialData={initialData || undefined} />;
}
