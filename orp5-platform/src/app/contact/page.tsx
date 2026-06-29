import { createPageMetadata } from '@/lib/metadata';
import ContactClient from './ContactClient';

export const metadata = createPageMetadata({
    title: 'Contact',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/contact',
});

export default function ContactPage() {
    return <ContactClient />;
}
