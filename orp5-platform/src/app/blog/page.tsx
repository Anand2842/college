import { getPublishedPosts } from '@/lib/supabase-blog';
import BlogCard from '@/components/molecules/BlogCard';
import { BlogSearch } from '@/components/molecules/BlogSearch';
import { Metadata } from 'next';
import { Navbar } from '@/components/organisms/Navbar';

export const metadata: Metadata = {
    title: 'Blog - ORP-5 Conference',
    description: 'Latest news, updates, and articles from the 5th International Conference on Ovine and Caprine Retrovirology.',
};

// Revalidate every hour
export const revalidate = 3600;

interface BlogPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { q } = await searchParams;
    const posts = await getPublishedPosts(q);

    return (
        <div className="min-h-screen bg-mist-white">
            <Navbar variant="default" />

            <main className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-16">
                        <span className="text-earth-green font-bold tracking-wider uppercase text-sm mb-3 block">
                            News & Updates
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">
                            Latest from ORP-5
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
                            Stay informed with the latest insights, announcements, and research highlights from the conference.
                        </p>
                        <BlogSearch />
                    </header>

                    {posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-lg text-gray-500">
                                No blog posts found yet. Check back soon for updates!
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
