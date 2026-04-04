"use client"

import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/atoms/CountdownTimer"

interface HeroProps {
    headline?: string;
    subheadline?: string;
    dateVenueLine?: string;
    backgroundImage?: string;
    partners?: any[];
    registrationStart?: string;
    registrationStatusText?: string;
    registrationBannerText?: string;
}

import Image from "next/image";
import { Globe, Sprout, Leaf } from "lucide-react";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

export function Hero({
    headline = "",
    subheadline = "",
    dateVenueLine = "",
    backgroundImage = "",
    partners = [],
    registrationStart = "",
    registrationStatusText = "",
    registrationBannerText = "",
}: HeroProps) {
    const { openModal } = useRegistrationModal();

    return (
        <section className="relative w-full flex items-center justify-center overflow-hidden min-h-[calc(100vh-80px)]">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-earth-green/50 to-black/80 z-10" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white h-full flex flex-col justify-center items-center py-10 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center max-w-5xl mx-auto"
                >
                    {/* Conference Badge / Label */}
                    <span className="inline-block py-1.5 px-6 border border-rice-gold/50 rounded-sm text-rice-gold text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-6 bg-black/20 backdrop-blur-sm">
                        ORP-5
                    </span>

                    {/* Main Headline — rendered from Supabase */}
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-none mb-6 text-white drop-shadow-2xl">
                        <SafeHtml html={headline} />
                    </h1>

                    {/* Subtitle — from Supabase */}
                    {subheadline && (
                        <div className="text-lg md:text-2xl text-white/90 mb-4 font-light max-w-4xl mx-auto leading-relaxed tracking-wide">
                            <SafeHtml html={subheadline} />
                        </div>
                    )}

                    {/* Date & Venue — from Supabase */}
                    {dateVenueLine && (
                        <p className="font-semibold text-white text-xl md:text-3xl mb-10">
                            <SafeHtml html={dateVenueLine} />
                        </p>
                    )}

                    {/* Countdown — uses Supabase registrationStart date */}
                    <div className="mb-12 flex flex-col items-center">
                        <p className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-rice-gold/80 mb-4 bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">
                            {registrationStatusText}
                        </p>
                        <CountdownTimer targetDate={registrationStart} />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center w-full mb-16">
                        <Button
                            size="lg"
                            className="bg-rice-gold hover:bg-rice-gold-dark text-earth-green font-bold text-lg px-10 py-6 min-w-[200px] shadow-xl uppercase tracking-wider transition-all transform hover:scale-105"
                            onClick={openModal}
                        >
                            Register Now
                        </Button>
                        <Link href="/about">
                            <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-earth-green font-bold text-lg px-10 py-6 min-w-[200px] uppercase tracking-wider backdrop-blur-sm transition-all">
                                Learn More
                            </Button>
                        </Link>
                    </div>

                    {/* Collaborating Partners Wrapper */}
                    {partners && partners.length > 0 && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-6 drop-shadow-md">Jointly organized by</p>
                            <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
                                {partners.slice(0, 3).map((partner: any, index: number) => {
                                    const Icon = index % 3 === 0 ? Globe : (index % 3 === 1 ? Sprout : Leaf);
                                    return (
                                        <div key={partner.id || index} className="group flex flex-col items-center gap-3 w-28 md:w-32">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300 relative">
                                                {partner.logoUrl ? (
                                                    <Image
                                                        src={partner.logoUrl}
                                                        alt={partner.name}
                                                        fill
                                                        sizes="(max-width: 768px) 64px, 80px"
                                                        className="object-contain p-3"
                                                    />
                                                ) : (
                                                    <Icon className="text-earth-green w-8 h-8" strokeWidth={1.5} />
                                                )}
                                            </div>
                                            <span className="text-[10px] md:text-xs text-white text-center font-bold uppercase tracking-wide leading-tight drop-shadow-md">
                                                {partner.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

function SafeHtml({ html }: { html: string }) {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
