import { Metadata } from 'next';
import CityClient from './CityClient';

export const metadata: Metadata = {
    title: 'City | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function CityPage() {
    return <CityClient />;
}
