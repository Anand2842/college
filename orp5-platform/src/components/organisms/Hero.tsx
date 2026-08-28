"use client"

import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/atoms/CountdownTimer"
import { Calendar } from "lucide-react";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

interface HeroProps {
    headline?: string;
    subheadline?: string;
    dateVenueLine?: string;
    backgroundImage?: string;
    partners?: any[];
    registrationStart?: string;
    registrationStatusText?: string;
    registrationBannerText?: string;
    whyJoin?: any[];
}

export function Hero({
    headline = "",
    subheadline = "",
    dateVenueLine = "",
    backgroundImage = "https://images.unsplash.com/photo-1536617621972-e5659779df3a?q=75&w=1920&auto=format&fit=crop",
    partners = [],
    registrationStart = "",
    registrationStatusText = "",
    registrationBannerText = "",
    whyJoin = [],
}: HeroProps) {
    const { openModal } = useRegistrationModal();

    return (
        <section className="relative w-full flex items-center justify-center overflow-hidden min-h-[85vh] lg:min-h-[92vh] bg-earth-green-deep">
            {/* Background Image & Animated GIF Layer */}
            {backgroundImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000 opacity-80 pointer-events-none"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                >
                    <img
                        src={backgroundImage}
                        alt="ORP-5 Hero Background"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                </div>
            ) : null}

            {/* Multi-Layer Cinematic Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-b from-earth-green-deep/80 via-earth-green-dark/60 to-earth-green-deep/90 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.2),_transparent_60%)] z-10 pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sapling-green/15 blur-[150px] rounded-full pointer-events-none z-10" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white h-full flex flex-col justify-center items-center pt-28 pb-16 md:pt-48 md:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center max-w-5xl mx-auto"
                >
                    {/* Live Floating Status Island */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-rice-gold-light mb-8 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-light animate-pulse" />
                        <span>5th Global Symposium</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="text-white/80">New Delhi, India</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.12] mb-6 text-white tracking-tight drop-shadow-2xl">
                        <SafeHtml html={headline} />
                    </h1>

                    {/* Subtitle */}
                    {subheadline && (
                        <div className="text-base sm:text-lg md:text-2xl text-white/90 mb-6 font-light max-w-3xl mx-auto leading-relaxed tracking-wide">
                            <SafeHtml html={subheadline} />
                        </div>
                    )}

                    {/* Date & Venue Bar */}
                    {dateVenueLine && (
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-black/30 border border-rice-gold/20 backdrop-blur-md text-sm sm:text-base md:text-lg font-medium text-rice-gold-light mb-10 shadow-md">
                            <Calendar size={18} className="text-rice-gold" />
                            <SafeHtml html={dateVenueLine} />
                        </div>
                    )}

                    {/* Countdown Section */}
                    <div className="mb-12 flex flex-col items-center w-full max-w-xl">
                        <p className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rice-gold-light/80 mb-2">
                            {registrationStatusText}
                        </p>
                        <CountdownTimer targetDate={registrationStart} />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto">
                        <Link href="/ticket-status?tab=abstract" className="w-full sm:w-auto">
                            <Button
                                size="xl"
                                variant="premium"
                                className="w-full sm:min-w-[210px] text-xs sm:text-sm uppercase tracking-wider py-4"
                            >
                                Track Abstract Status
                            </Button>
                        </Link>
                        <Button
                            variant="glass"
                            size="xl"
                            className="w-full sm:min-w-[210px] text-xs sm:text-sm uppercase tracking-wider font-bold py-4 hover:border-rice-gold/60 transition-all"
                            onClick={openModal}
                        >
                            Register Now
                        </Button>
                    </div>

                </motion.div>
            </div>
        </section>
    )
}

function SafeHtml({ html }: { html: string }) {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
