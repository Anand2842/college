import { Metadata } from 'next';

interface PageMetadataOptions {
    title: string;
    description: string;
    path: string;
    image?: string;
    keywords?: string[];
}

export function createPageMetadata({
    title,
    description,
    path,
    image = '/og-image.jpg',
    keywords = ['organic rice', 'conference', 'agriculture', 'sustainable farming'],
}: PageMetadataOptions): Metadata {
    const url = `https://orp5.org${path}`;
    const fullTitle = `${title} | ORP-5 Conference`;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: 'ORP-5 Organizing Committee' }],
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: 'ORP-5 Conference',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}
