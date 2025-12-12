"use client"

import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/atoms/CountdownTimer"

interface HeroProps {
    headline?: string;
    subheadline?: string;
    backgroundImage?: string;
    partners?: any[];
}

import Image from "next/image";
import { Globe, Sprout, Leaf } from "lucide-react";

export function Hero({
    headline = "Organic & Natural Rice Farming and Production Systems",
    subheadline = "Advancing Sustainable Organic & Natural Rice Farming Worldwide 21-25 September 2026 | Galgotias University, Greater Noida, India",
    backgroundImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop",
    partners = []
}: HeroProps) {
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

                    {/* Main Headline */}
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-none mb-6 text-white drop-shadow-2xl">
                        <span className="block mb-2 text-rice-gold">Organic & Natural Rice</span>
                        <span className="block text-3xl md:text-5xl lg:text-6xl font-normal text-white">Farming and Production Systems</span>
                        <span className="block text-xl md:text-3xl font-light mt-4 italic text-white/80">(5th International Conference)</span>
                    </h1>

                    {/* Subtitle / Date & Venue */}
                    <div className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-4xl mx-auto leading-relaxed tracking-wide">
                        <p className="mb-2">Advancing Sustainable Organic & Natural Rice Farming Worldwide</p>
                        <p className="font-semibold text-white text-xl md:text-3xl mt-2">
                            21–25 September 2026 <span className="mx-2 text-rice-gold">|</span> Galgotias University, Greater Noida, India
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="mb-12 flex flex-col items-center">
                        <p className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-rice-gold/80 mb-4 bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">
                            Registration Opens In
                        </p>
                        <CountdownTimer targetDate="2026-01-01T00:00:00" />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center w-full mb-16">
                        <Link href="/registration">
                            <Button size="lg" className="bg-rice-gold hover:bg-rice-gold-dark text-earth-green font-bold text-lg px-10 py-6 min-w-[200px] shadow-xl uppercase tracking-wider transition-all transform hover:scale-105">
                                Register Now
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-earth-green font-bold text-lg px-10 py-6 min-w-[200px] uppercase tracking-wider backdrop-blur-sm transition-all">
                                Learn More
                            </Button>
                        </Link>
                    </div>

                    {/* Collaborating Partners Wrapper - Added margin top to separate from buttons */}
                    {partners && partners.length > 0 && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-6 drop-shadow-md">In Collaboration With</p>
                            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                                {partners.slice(0, 3).map((partner: any, index: number) => {
                                    const Icon = index % 3 === 0 ? Globe : (index % 3 === 1 ? Sprout : Leaf);
                                    return (
                                        <div key={partner.id || index} className="group relative">
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
                                            {/* Tooltip-like name on hover */}
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-2 py-0.5 rounded">
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
    // Simple parser for specific tags: <br />, <br/>, <span class='...'>...</span>
    // This removes the need for dangerouslySetInnerHTML for our specific use case
    const parts = html.split(/(<br\s*\/?>|<span[^>]*>.*?<\/span>)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.match(/<br\s*\/?>/)) {
                    return <br key={index} />;
                }
                if (part.startsWith("<span")) {
                    const content = part.replace(/<[^>]+>/g, ""); // Extract text
                    // extract class
                    const classMatch = part.match(/class=['"]([^'"]*)['"]/);
                    const className = classMatch ? classMatch[1] : "";
                    return <span key={index} className={className}>{content}</span>;
                }
                return part;
            })}
        </>
    );
}
