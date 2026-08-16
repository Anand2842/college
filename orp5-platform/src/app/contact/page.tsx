import { createPageMetadata } from '@/lib/metadata';
import ContactClient from './ContactClient';
import { getContactPageData } from '@/lib/cms';

export const revalidate = 300; // cache 5 minutes

export const metadata = createPageMetadata({
    title: 'Contact Secretariat',
    description: 'Connect with the ORP-5 Conference Organizing Secretariat for registration support, abstract queries, or sponsorship proposals.',
    path: '/contact',
});

export default async function ContactPage() {
    const initialData = await getContactPageData();
    return <ContactClient initialData={initialData} />;
}
