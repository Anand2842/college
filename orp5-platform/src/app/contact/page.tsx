import { createPageMetadata } from '@/lib/metadata';
import ContactClient from './ContactClient';
import { getContactPageData } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
    title: 'Contact Secretariat',
    description: 'Connect with the ORP-5 Conference Organizing Secretariat for registration support, abstract queries, or sponsorship proposals.',
    path: '/contact',
});

export default async function ContactPage() {
    const initialData = await getContactPageData();
    return <ContactClient initialData={initialData} />;
}
