import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function ContactPage() {
    return <ContactClient />;
}
