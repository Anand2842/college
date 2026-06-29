import { createPageMetadata } from '@/lib/metadata';
import ProgrammeClient from './ProgrammeClient';

export const metadata = createPageMetadata({
    title: 'Programme',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/programme',
});

export default function ProgrammePage() {
    return <ProgrammeClient />;
}
