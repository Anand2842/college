import { getPostBySlug, getRelatedPosts } from '@/lib/supabase-blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, User, ArrowLeft, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/organisms/Navbar';
import DOMPurify from 'isomorphic-dompurify';
import { SocialShare } from '@/components/molecules/SocialShare';
import BlogCard from '@/components/molecules/BlogCard';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found - ORP-5',
        };
    }

    // Strip HTML tags for description
    const plainText = post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160);

    const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
    const authorName = profile?.display_name || 'ORP-5 Team';

    return {
        title: `${post.title} - ORP-5 Blog`,
        description: plainText,
        openGraph: {
            title: post.title,
            description: plainText,
            images: post.cover_image ? [post.cover_image] : [],
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            authors: [authorName],
        },
    };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    try {
        const { slug } = await params;
        const post = await getPostBySlug(slug);

        if (!post) {
            notFound();
        }

        // Sanitize HTML content
        const sanitizedContent = DOMPurify.sanitize(post.content || '');

        // Fetch related posts
        const relatedPosts = await getRelatedPosts(post.slug, post.category);
        const postUrl = `https://orp5ic.com/blog/${slug}`;

        return (
            <div className="min-h-screen bg-[#FDFCF8]">
                <Navbar variant="default" />

                <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <article className="max-w-3xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-earth-green mb-8 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>

                        {/* Header */}
                        <header className="mb-10 text-center">
                            {post.category && (
                                <span className="inline-block bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                    {post.category}
                                </span>
                            )}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-6 font-sans">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#D9A648]" />
                                    <time dateTime={post.published_at || post.created_at}>
                                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                                {(() => {
                                    const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
                                    if (!profile?.display_name) return null;

                                    return (
                                        <div className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-[#D9A648]" />
                                                <span>{profile.display_name}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#123125] mb-6 leading-tight tracking-tight">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-xl text-gray-600 font-serif leading-relaxed italic max-w-2xl mx-auto">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Social Share (Top) */}
                            <div className="flex justify-center border-t border-b border-gray-100 py-4 my-6">
                                <SocialShare title={post.title} url={postUrl} />
                            </div>
                        </header>

                        {/* Featured Image */}
                        {post.cover_image && (
                            <div className="mb-12 relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        {/* PDF Download Card (if available) */}
                        {post.pdf_url && (
                            <div className="mb-12 bg-[#FBF9F4] border border-[#EBE5D5] rounded-xl p-6 flex items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-red-500">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#123125] text-lg mb-1">Attached Document</h3>
                                        <p className="text-sm text-gray-600">Download the full PDF version of this article.</p>
                                    </div>
                                </div>
                                <a
                                    href={post.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#123125] text-white rounded-lg hover:bg-[#0A1F16] transition-colors font-medium text-sm whitespace-nowrap"
                                >
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg prose-stone max-w-none 
                        prose-headings:font-serif prose-headings:text-[#123125] 
                        prose-p:text-gray-700 prose-p:leading-8 prose-p:tracking-wide
                        prose-li:text-gray-700
                        prose-strong:text-[#123125] prose-strong:font-bold
                        prose-a:text-[#A67C00] prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-[#D9A648] prose-blockquote:bg-[#FFFDF7] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                        prose-img:rounded-xl prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />

                        {/* Social Share (Bottom) */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Share this article</p>
                            <div className="flex justify-center">
                                <SocialShare title={post.title} url={postUrl} />
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <div className="flex justify-center">
                                <Link href="/blog" className="text-gray-500 hover:text-[#123125] font-serif italic text-lg transition-colors">
                                    ← Read more articles
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* Related Posts Section */}
                    {relatedPosts.length > 0 && (
                        <section className="max-w-7xl mx-auto mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <h2 className="text-2xl font-serif font-bold text-charcoal text-center">You might also like</h2>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((relatedPost) => (
                                    <BlogCard key={relatedPost.id} post={relatedPost} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Structured Data (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BlogPosting',
                            headline: post.title,
                            datePublished: post.published_at || post.created_at,
                            dateModified: post.updated_at || post.confirmed_at,
                            description: post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160),
                            image: post.cover_image ? [post.cover_image] : [],
                            url: `https://orp5ic.com/blog/${post.slug}`,
                            author: {
                                '@type': 'Person',
                                name: (Array.isArray(post.profiles) ? post.profiles[0]?.display_name : post.profiles?.display_name) || 'ORP-5 Team',
                                jobTitle: (Array.isArray(post.profiles) ? post.profiles[0]?.role : post.profiles?.role) === 'admin' ? 'Content Steward' : 'Page Coordinator',
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'ORP-5',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://orp5ic.com/orp5-logo.png' // Ensure this path is correct
                                }
                            }
                        })
                    }}
                />
            </div>
        );
    } catch (error) {
        console.error('BlogPostPage Error:', error);
        notFound();
    }
}
