"use client";

import { useEffect, useState, use } from "react";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { BlogPost } from "@/lib/supabase-blog";
import { Loader2 } from "lucide-react";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog/${id}`);
            if (!res.ok) throw new Error('Failed to fetch post');
            const data = await res.json();
            setPost(data);
        } catch (error) {
            console.error(error);
            alert('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return <BlogPostForm initialData={post} isEditing />;
}
