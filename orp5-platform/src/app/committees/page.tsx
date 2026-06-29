import { createPageMetadata } from '@/lib/metadata';
import CommitteesClient from './CommitteesClient';

export const metadata = createPageMetadata({
    title: 'Committees',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/committees',
});

export default function CommitteesPage() {
    return <CommitteesClient />;
}
