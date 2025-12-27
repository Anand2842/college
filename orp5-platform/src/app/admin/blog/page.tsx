"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { BlogPost } from '@/lib/supabase-blog';
import { Button } from '@/components/atoms/Button';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-earth-green" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Blog Management"
                description="Manage news, updates, and articles for the conference blog."
            >
                <Link href="/admin/blog/new">
                    <Button className="bg-earth-green hover:bg-earth-green/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                    </Button>
                </Link>
            </AdminHeader>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-charcoal">Title</th>
                            <th className="px-6 py-4 font-bold text-charcoal">Status</th>
                            <th className="px-6 py-4 font-bold text-charcoal">Created At</th>
                            <th className="px-6 py-4 font-bold text-charcoal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No posts found. Create your first blog post!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-charcoal line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{post.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.is_published
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="inline-flex p-2 text-gray-400 hover:text-earth-green hover:bg-earth-green/5 rounded-md transition-colors"
                                            title="View Live"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/blog/${post.id}`}
                                            className="inline-flex p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
