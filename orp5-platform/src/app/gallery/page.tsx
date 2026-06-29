import { createPageMetadata } from '@/lib/metadata';
import GalleryClient from './GalleryClient';

export const metadata = createPageMetadata({
    title: 'Gallery',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/gallery',
});

export default function GalleryPage() {
    return <GalleryClient />;
}
