import { createPageMetadata } from '@/lib/metadata';
import CommitteesClient from './CommitteesClient';
import { getCommitteesPageData } from '@/lib/cms';

export const revalidate = 3600; // admin saves revalidate this page immediately

export const metadata = createPageMetadata({
    title: 'Committees',
    description: 'Guided by distinguished agronomists, policy directors, and research fellows from premier institutions globally.',
    path: '/committees',
});

export default async function CommitteesPage() {
    const initialData = await getCommitteesPageData();
    return <CommitteesClient initialData={initialData} />;
}

