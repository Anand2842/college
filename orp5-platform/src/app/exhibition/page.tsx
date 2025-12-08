import { Metadata } from 'next';
import ExhibitionClient from './ExhibitionClient';

export const metadata: Metadata = {
    title: 'Exhibition | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function ExhibitionPage() {
    return <ExhibitionClient />;
}
