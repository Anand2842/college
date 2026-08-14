import Link from 'next/link';
import { BlogPost } from '@/lib/supabase-blog';
import { Calendar, User, ArrowRight } from 'lucide-react';

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
        <article className="relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group border border-earth-green/10 overflow-hidden luxury-card">
            {post.cover_image && (
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}
            
            <div className="flex flex-col flex-1 p-7 sm:p-8 justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                        {post.category && (
                            <span className="bg-earth-green/5 text-earth-green text-[11px] uppercase font-bold px-3 py-1 rounded-full tracking-wider border border-earth-green/15">
                                {post.category}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/50">
                            <Calendar className="w-3.5 h-3.5 text-rice-gold-dark" />
                            <time dateTime={post.published_at || post.created_at}>
                                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-earth-green transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                            {post.title}
                        </Link>
                    </h3>

                    <p className="text-charcoal/70 line-clamp-3 mb-6 text-xs sm:text-sm leading-relaxed font-light">
                        {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 140) + '...'}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    {post.profiles?.display_name ? (
                        <div className="flex items-center gap-2 text-xs text-charcoal/60">
                            <div className="w-6 h-6 rounded-full bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-[10px]">
                                {post.profiles.display_name.charAt(0)}
                            </div>
                            <span className="font-medium">{post.profiles.display_name}</span>
                        </div>
                    ) : <div />}

                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-earth-green group-hover:text-rice-gold-dark transition-colors gap-1"
                    >
                        <span>Read Article</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
