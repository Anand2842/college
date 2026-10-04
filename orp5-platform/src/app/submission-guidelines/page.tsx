import { Metadata } from 'next';
import SubmissionGuidelinesClient from './SubmissionGuidelinesClient';
import { getPageContent } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata: Metadata = {
    title: 'Participation Guidelines | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default async function SubmissionGuidelinesPage() {
    const initialData = await getPageContent('submission-guidelines').catch(() => null);
    return <SubmissionGuidelinesClient initialData={initialData || undefined} />;
}
