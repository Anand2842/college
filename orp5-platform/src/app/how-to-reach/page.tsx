import { Metadata } from 'next';
import HowToReachClient from './HowToReachClient';

export const metadata: Metadata = {
    title: 'How to reach | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function HowToReachPage() {
    return <HowToReachClient />;
}
