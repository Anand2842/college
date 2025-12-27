import Link from 'next/link';
import { BlogPost } from '@/lib/supabase-blog';
// import { formatDate } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface BlogCardProps {
    post: BlogPost & {
        profiles?: {
            display_name: string | null;
            avatar_url: string | null;
        } | null;
    };
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {post.cover_image && (
                <div className="relative h-56 w-full overflow-hidden">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {post.category && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-charcoal text-[10px] uppercase font-bold px-2 py-1 rounded-sm shadow-sm tracking-wider">
                            {post.category}
                        </span>
                    )}
                </div>
            )}
            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rice-gold" />
                        <time dateTime={post.published_at || post.created_at}>
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                    </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-earth-green transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>

                <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                    {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    {post.profiles?.display_name ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-400" />
                            </div>
                            <span>{post.profiles.display_name}</span>
                        </div>
                    ) : <div></div>}

                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-bold text-earth-green hover:text-earth-green/80 transition-colors"
                    >
                        Read Article &rarr;
                    </Link>
                </div>
            </div>
        </article>
    );
}
