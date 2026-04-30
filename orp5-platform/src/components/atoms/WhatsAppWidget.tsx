"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function WhatsAppWidget() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [groupLink, setGroupLink] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data?.whatsappGroupLink) {
                    setGroupLink(data.whatsappGroupLink);
                }
            } catch (err) {
                console.warn("Failed to load WhatsApp settings:", err);
            }
        };
        fetchSettings();
    }, []);

    // Only show on public frontend pages (hide on admin paths)
    useEffect(() => {
        if (!pathname?.startsWith('/admin')) {
            // Slight delay so it pops up smoothly after initial render
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [pathname]);

    if (!isVisible) return null;

    // Use the admin-configured group link if set, otherwise fallback to the hardcoded default
    let waLink = groupLink;
    
    if (!waLink) {
        // Default group link fallback
        waLink = "https://chat.whatsapp.com/Lk5D6IQH8HK28sic9v3kk8?mode=hqctcla";
    }

    return (
        <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-in zoom-in-50 print:hidden"
            aria-label="Chat on WhatsApp"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="w-8 h-8 fill-current"
            >
                <path d="M12.031 0C5.385 0 0 5.384 0 12.03c0 2.115.549 4.183 1.594 6.002L.055 23.593l5.706-1.496C7.514 23.047 9.721 23.6 12.031 23.6 18.675 23.6 24 18.215 24 11.57c0-6.645-5.324-11.57-11.969-11.57zm5.556 16.59c-.237.669-1.378 1.282-1.895 1.344-.543.064-1.226.155-3.834-1.025-3.151-1.428-5.185-4.66-5.342-4.872-.158-.211-1.28-1.704-1.28-3.256 0-1.554.81-2.316 1.1-2.617.261-.267.659-.396.994-.396.103 0 .197.004.283.008.318.016.48.068.704.606.273.66.758 1.849.824 1.98.066.133.111.288.026.452-.085.163-.129.265-.259.418-.129.153-.27.327-.384.462-.128.148-.266.307-.116.565.151.26.671 1.109 1.442 1.802.996.896 1.82 1.173 2.08 1.306.26.131.411.111.564-.064.153-.178.658-.764.834-1.028.175-.264.351-.219.585-.133.234.086 1.479.697 1.733.824.254.129.424.192.486.297.062.106.062.615-.175 1.284z"/>
            </svg>
        </a>
    );
}
