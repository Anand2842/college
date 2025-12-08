import { Metadata } from 'next';
import PublicationsClient from './PublicationsClient';

export const metadata: Metadata = {
    title: 'Publications | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function PublicationsPage() {
    return <PublicationsClient />;
}
