"use client";

import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '@/lib/supabase-blog';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save, Image as ImageIcon, Upload, FileText, X, Bold, Italic, Link as LinkIcon, List } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface BlogPostFormProps {
    initialData?: BlogPost | null;
    isEditing?: boolean;
}

export default function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        cover_image: initialData?.cover_image || '',
        pdf_url: initialData?.pdf_url || '',
        category: initialData?.category || 'General',
        is_published: initialData?.is_published || false
    });

    // Auto-generate slug from title if not manually edited
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);

    useEffect(() => {
        if (!slugManuallyEdited && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, slugManuallyEdited]);

    const handleFileUpload = async (file: File, field: 'cover_image' | 'pdf_url') => {
        if (!file) return;
        setUploading(true);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await res.json();

            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, [field]: data.url }));
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                slug: formData.slug.replace(/^\/+/, ''), // Ensure no leading slashes
                published_at: formData.is_published
                    ? (initialData?.published_at || new Date().toISOString())
                    : null
            };

            const url = isEditing ? `/api/blog/${initialData?.id}` : '/api/blog';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to save post');
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving post:', error);
            alert(`Failed to save post: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // React-Quill Modules Configuration
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }), []);

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="text-gray-400 hover:text-earth-green transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-charcoal">
                            {isEditing ? 'Edit Blog Post' : 'Create New Post'}
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {isEditing ? 'Update your content' : 'Write nicely formatted content'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px] shadow-md shadow-earth-green/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {isEditing ? 'Update Post' : 'Publish Post'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        {/* Title & Slug */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-charcoal mb-1.5">Article Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green transition-all text-lg font-serif"
                                    placeholder="Enter an engaging title..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">URL Slug</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2 text-gray-500 text-sm">/blog/</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={e => {
                                            setSlugManuallyEdited(true);
                                            setFormData({ ...formData, slug: e.target.value });
                                        }}
                                        className="flex-1 px-4 py-2 rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green transition-all font-mono text-sm text-charcoal"
                                        placeholder="post-url-slug"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4" />

                        {/* Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-bold text-charcoal mb-2">Content</label>
                            <div className="prose-editor-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    modules={modules}
                                    className="h-[500px] mb-12"
                                />
                            </div>
                            <style jsx global>{`
                                .ql-toolbar.ql-snow {
                                    border-top-left-radius: 0.5rem;
                                    border-top-right-radius: 0.5rem;
                                    border-color: #e5e7eb;
                                    background: #f9fafb;
                                }
                                .ql-container.ql-snow {
                                    border-bottom-left-radius: 0.5rem;
                                    border-bottom-right-radius: 0.5rem;
                                    border-color: #e5e7eb;
                                    font-size: 1rem;
                                    font-family: inherit;
                                }
                                .ql-editor {
                                    min-height: 400px;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta & Media */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-charcoal mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-earth-green" />
                            Publishing
                        </h3>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green transition-all text-sm bg-white"
                            >
                                <option value="General">General</option>
                                <option value="Research">Research</option>
                                <option value="News">News</option>
                                <option value="Events">Events</option>
                                <option value="Awards">Awards</option>
                            </select>
                        </div>

                        <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <span className="text-sm font-medium text-charcoal">Publish Immediately</span>
                            <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${formData.is_published ? 'bg-earth-green' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${formData.is_published ? 'translate-x-4' : ''}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.is_published}
                                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                            />
                        </label>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                            <ImageIcon size={16} /> Media Assets
                        </h3>

                        {/* Cover Image */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Cover Image</label>

                            {formData.cover_image ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video group">
                                    <img
                                        src={formData.cover_image}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, cover_image: '' })}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file, 'cover_image');
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium">
                                        {uploading ? 'Uploading...' : 'Click to upload cover image'}
                                    </p>
                                </div>
                            )}
                            <input
                                type="url"
                                value={formData.cover_image}
                                onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 focus:outline-none focus:border-earth-green"
                                placeholder="Or enter image URL..."
                            />
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* PDF Attachment */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <FileText size={12} /> PDF Attachment
                            </label>

                            {formData.pdf_url ? (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-blue-900 truncate">Document Attached</p>
                                        <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-700 hover:underline truncate block">
                                            View PDF
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, pdf_url: '' })}
                                        className="p-1 hover:bg-blue-100 rounded text-blue-700"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file, 'pdf_url');
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium">
                                        {uploading ? 'Uploading...' : 'Click to upload PDF'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
                        <label className="block text-sm font-bold text-charcoal">Short Excerpt</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green transition-all text-sm h-32 resize-none"
                            placeholder="Write a catchy summary that will appear on cards..."
                        />
                        <p className="text-xs text-gray-400 text-right">Recommended: 150-160 characters</p>
                    </div>
                </div>
            </div>
        </form>
    );
}
