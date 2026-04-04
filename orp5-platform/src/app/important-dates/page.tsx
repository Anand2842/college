import { Metadata } from 'next';
import ImportantDatesClient from './ImportantDatesClient';

export const metadata: Metadata = {
    title: 'Important Dates | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function ImportantDatesPage() {
    return <ImportantDatesClient />;
}
