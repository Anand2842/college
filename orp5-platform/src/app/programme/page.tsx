import { Metadata } from 'next';
import ProgrammeClient from './ProgrammeClient';

export const metadata: Metadata = {
    title: 'Programme | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function ProgrammePage() {
    return <ProgrammeClient />;
}
