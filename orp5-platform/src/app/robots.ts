import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.orp5ic.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/login', '/dashboard', '/moderator/', '/scan', '/badge-preview', '/forgot-password', '/update-password'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
