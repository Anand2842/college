"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
    url?: string;
    caption?: string;
}

interface GalleryCarouselProps {
    images: GalleryImage[];
    autoPlayInterval?: number;
}

export function GalleryCarousel({ images, autoPlayInterval = 3000 }: GalleryCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Filter only images that have URLs
    const validImages = images.filter((img) => img.url);

    // How many to show at once (3 on desktop, 2 on tablet, 1 on mobile — handled via CSS)
    const visibleCount = 3;
    const maxIndex = Math.max(0, validImages.length - visibleCount);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    // Auto-play
    useEffect(() => {
        if (isHovered || validImages.length <= visibleCount) return;
        const timer = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(timer);
    }, [isHovered, nextSlide, autoPlayInterval, validImages.length]);

    if (validImages.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <p>No gallery images available yet.</p>
            </div>
        );
    }

    return (
        <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
            >
                {validImages.map((img, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 px-3"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <div className="overflow-hidden rounded-2xl h-64 shadow-md group relative">
                            <Image
                                src={img.url!}
                                alt={img.caption || `Gallery image ${i + 1}`}
                                fill
                                loading="lazy"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Hover overlay with caption */}
                            {img.caption && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white text-sm font-medium">{img.caption}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dot Indicators */}
            {validImages.length > visibleCount && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? "bg-[#123125] w-6"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
