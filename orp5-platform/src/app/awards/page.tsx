import { Metadata } from 'next';
import AwardsClient from './AwardsClient';

export const metadata: Metadata = {
    title: 'Awards & Prizes | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function AwardsPage() {
    return <AwardsClient />;
}
