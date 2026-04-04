"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowRight, ImageIcon } from "lucide-react";

interface PromoSlide {
    id: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
    imageUrl?: string;
}

interface PromoModalConfig {
    enabled: boolean;
    slides: PromoSlide[];
    slideIntervalSeconds: number;
    showOncePerSession: boolean;
    delaySeconds: number;
}



export function PromoModal() {
    const [config, setConfig] = useState<PromoModalConfig | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load modal config from settings
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data?.promoModal?.enabled && data.promoModal.slides?.length > 0) {
                    setConfig(data.promoModal);
                }
            } catch {
                // silently fail
            }
        };
        loadConfig();
    }, []);

    // Show after delay, respecting session flag
    useEffect(() => {
        if (!config) return;

        // Session key scoped to slide titles so changing content re-shows the modal
        const sessionKey = `promoModalShown_${config.slides.map(s => s.id).join('_')}`;
        if (config.showOncePerSession && sessionStorage.getItem(sessionKey)) return;

        const delay = setTimeout(() => {
            setIsOpen(true);
            setTimeLeft(config.slideIntervalSeconds);
            if (config.showOncePerSession) {
                sessionStorage.setItem(sessionKey, "1");
            }
        }, config.delaySeconds * 1000);

        return () => clearTimeout(delay);
    }, [config]);

    const goToNextSlide = useCallback(() => {
        if (!config) return;
        setCurrentSlide((prev) => (prev + 1) % config.slides.length);
        setTimeLeft(config.slideIntervalSeconds);
    }, [config]);

    const goToPrevSlide = useCallback(() => {
        if (!config) return;
        setCurrentSlide((prev) => (prev - 1 + config.slides.length) % config.slides.length);
        setTimeLeft(config.slideIntervalSeconds);
    }, [config]);

    // Auto-advance slides + countdown
    useEffect(() => {
        if (!isOpen || !config || isPaused) return;

        countdownRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    goToNextSlide();
                    return config.slideIntervalSeconds;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [isOpen, config, isPaused, currentSlide, goToNextSlide]);

    const close = () => setIsOpen(false);

    if (!isOpen || !config) return null;

    const slide = config.slides[currentSlide];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={close}
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    className="relative w-full max-w-3xl animate-in zoom-in-90 slide-in-from-bottom-4 duration-400 rounded-2xl overflow-hidden shadow-2xl bg-black"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button - highly visible with backdrop blur */}
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 z-[210] w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all backdrop-blur-md shadow-lg"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Main content - Clickable Image */}
                    <Link href={slide.ctaLink} onClick={close} className="block w-full h-[60vh] md:h-[80vh] relative group cursor-pointer">
                        {slide.imageUrl ? (
                            <img
                                src={slide.imageUrl}
                                alt={slide.title || "Promotional image"}
                                className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        ) : (
                            /* Designer Placeholder */
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#123125]">
                                <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                                    <ImageIcon size={32} className="text-white/30" />
                                </div>
                                <div className="text-center px-6">
                                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">Designer Placeholder</p>
                                    <p className="text-white/20 text-xs text-center">Upload image via Admin → Settings</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md transform scale-95 group-hover:scale-100 transition-all duration-300 flex items-center gap-2">
                                {slide.ctaLabel || "Learn More"} <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>

                    {/* Nav arrows for multiple slides */}
                    {config.slides.length > 1 && (
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                            <button
                                onClick={(e) => { e.preventDefault(); goToPrevSlide(); }}
                                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all backdrop-blur-md shadow-lg pointer-events-auto"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); goToNextSlide(); }}
                                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all backdrop-blur-md shadow-lg pointer-events-auto"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
