import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/metadata';
import GuidelinesClient from './GuidelinesClient';

export const metadata = createPageMetadata({
    title: 'Full-Length Paper Guidelines',
    description: 'Official instructions for submission of selected full-length research and review articles for publication in Bio Web of Conferences (EDP Sciences, SCOPUS Indexed).',
    path: '/guidelines',
    keywords: [
        'full paper guidelines',
        'Bio Web of Conferences',
        'EDP Sciences',
        'SCOPUS publication',
        'ORP-5 proceedings',
        'organic rice research'
    ],
});

export default function GuidelinesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF9F5]" />}>
            <GuidelinesClient />
        </Suspense>
    );
}

