import { Metadata } from 'next';
import SponsorshipClient from './SponsorshipClient';

export const metadata: Metadata = {
    title: 'Sponsorship | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function SponsorshipPage() {
    return <SponsorshipClient />;
}
