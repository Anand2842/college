import { Metadata } from 'next';
import CommitteesClient from './CommitteesClient';

export const metadata: Metadata = {
    title: 'Committees | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function CommitteesPage() {
    return <CommitteesClient />;
}
