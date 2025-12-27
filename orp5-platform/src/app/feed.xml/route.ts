import { getPublishedPosts } from '@/lib/supabase-blog';

const BASE_URL = 'https://orp5ic.com';

export async function GET() {
    const posts = await getPublishedPosts();

    const itemsXml = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <description>${post.excerpt || post.title}</description>
      <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
    </item>
  `).join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>ORP-5 Conference Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Latest news, updates, and articles from the 5th International Conference on Ovine and Caprine Retrovirology.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
