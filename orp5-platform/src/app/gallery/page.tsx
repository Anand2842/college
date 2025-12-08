import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
    title: 'Gallery | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function GalleryPage() {
    return <GalleryClient />;
}
