"use client";

import { Twitter, Facebook, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';

interface SocialShareProps {
    title: string;
    url: string; // Full URL
}

export function SocialShare({ title, url }: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-black hover:text-white'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:bg-blue-600 hover:text-white'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            color: 'hover:bg-blue-700 hover:text-white'
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
            color: 'hover:bg-gray-600 hover:text-white'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Share:</span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-gray-50 text-gray-500 transition-all duration-300 ${link.color}`}
                    title={`Share on ${link.name}`}
                >
                    <link.icon size={16} />
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-earth-green hover:text-white transition-all duration-300 relative group"
                title="Copy Link"
            >
                <LinkIcon size={16} />
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        Copied!
                    </span>
                )}
            </button>
        </div>
    );
}
