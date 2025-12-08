import { Metadata } from 'next';
import BrochureClient from './BrochureClient';

export const metadata: Metadata = {
    title: 'Brochure | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function BrochurePage() {
    return <BrochureClient />;
}
