import { createPageMetadata } from '@/lib/metadata';
import CommitteesClient from './CommitteesClient';
import { getCommitteesPageData } from '@/lib/cms';

export const revalidate = 0; // Dynamic server rendering for immediate updates

export const metadata = createPageMetadata({
    title: 'Committees',
    description: 'Guided by distinguished agronomists, policy directors, and research fellows from premier institutions globally.',
    path: '/committees',
});

export default async function CommitteesPage() {
    const initialData = await getCommitteesPageData();
    return <CommitteesClient initialData={initialData} />;
}

