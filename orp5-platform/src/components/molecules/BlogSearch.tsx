"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function BlogSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('q') || '';
    const [search, setSearch] = useState(initialSearch);

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== initialSearch) {
                if (search) {
                    router.push(`/blog?q=${encodeURIComponent(search)}`);
                } else {
                    router.push('/blog');
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, router, initialSearch]);

    return (
        <div className="relative max-w-md mx-auto mb-12">
            <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
    );
}
