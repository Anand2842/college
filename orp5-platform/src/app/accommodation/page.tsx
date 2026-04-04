import { Metadata } from 'next';
import AccommodationClient from './AccommodationClient';

export const metadata: Metadata = {
    title: 'Accommodation | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function AccommodationPage() {
    return <AccommodationClient />;
}
