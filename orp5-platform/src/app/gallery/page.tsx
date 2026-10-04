import { createPageMetadata } from '@/lib/metadata';
import GalleryClient from './GalleryClient';
import galleryData from '@/data/gallery.json';

export const metadata = createPageMetadata({
    title: 'Gallery',
    description: 'Photos and videos from ORP-5 (21–25 September 2026, New Delhi): inaugural session, plenary and technical sessions, awards, poster presentations and the valedictory.',
    path: '/gallery',
});

// Gallery content is a static snapshot (src/data/gallery.json) — no database call.
export default function GalleryPage() {
    return <GalleryClient initialData={galleryData} />;
}

