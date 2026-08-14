import { getPublishedPosts } from '@/lib/supabase-blog';
import BlogCard from '@/components/molecules/BlogCard';
import { BlogSearch } from '@/components/molecules/BlogSearch';
import { Metadata } from 'next';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { PageHero } from '@/components/organisms/PageHero';
import { SectionTitle } from '@/components/atoms/SectionTitle';

export const metadata: Metadata = {
    title: 'News & Media Insights | ORP-5 Conference',
    description: 'Official announcements, scientific insights, and research articles from the 5th International Conference on Organic & Natural Rice Farming.',
    openGraph: {
        title: 'News & Media Insights | ORP-5 Conference',
        description: 'Official announcements, scientific insights, and research articles from the 5th International Conference on Organic & Natural Rice Farming.',
        type: 'website',
    },
};

export const revalidate = 0;

interface BlogPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { q } = await searchParams;
    const posts = await getPublishedPosts(q);

    return (
        <div className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar variant="default" />

            <PageHero
                headline="Conference Insights & Press"
                subheadline="Official updates, keynote previews, agricultural field notes, and scientific announcements."
                breadcrumb="Home / Blog & Media"
            />

            <main className="container mx-auto px-6 py-14 max-w-7xl">
                <div className="max-w-2xl mx-auto mb-16">
                    <BlogSearch />
                </div>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-14 bg-white rounded-3xl border border-earth-green/10 shadow-sm max-w-2xl mx-auto luxury-card">
                        <p className="text-base text-charcoal/60 font-light">
                            {q ? `No articles matching "${q}". Try another search term.` : 'No articles published yet. Check back soon for conference updates!'}
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
