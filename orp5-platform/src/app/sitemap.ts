import { getPublishedPosts } from '@/lib/supabase-blog';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://orp5ic.com'; // Adjust if you have a different production URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/themes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/registration`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/programme`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/venue`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/speakers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ];

    // 2. Dynamic Blog Posts
    const posts = await getPublishedPosts();
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes];
}
