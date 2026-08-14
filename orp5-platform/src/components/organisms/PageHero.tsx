"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

interface HeroButton {
    label: string;
    link: string;
    variant?: "primary" | "secondary" | "gold";
}

interface PageHeroProps {
    headline: string;
    subheadline?: string;
    backgroundImage?: string;
    breadcrumb?: string;
    buttons?: HeroButton[];
}

export function PageHero({ headline, subheadline, backgroundImage, breadcrumb, buttons }: PageHeroProps) {
    const fadeInUp = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <section className="relative pt-28 pb-8 md:pt-32 md:pb-10 bg-earth-green-deep flex items-center justify-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {backgroundImage && (
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover opacity-15 blur-md mix-blend-luminosity transform scale-105"
                    />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-earth-green-deep/90 to-earth-green-deep" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="container mx-auto px-6 text-center relative z-20 max-w-4xl"
            >
                {breadcrumb && (
                    <motion.div variants={fadeInUp} className="flex justify-center items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-4">
                        {breadcrumb.split(" / ").map((part, i, arr) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i < arr.length - 1 ? (
                                    <Link href="/" className="hover:text-rice-gold transition-colors">{part}</Link>
                                ) : (
                                    <span className="text-white/90">{part}</span>
                                )}
                                {i < arr.length - 1 && <span className="text-white/30">/</span>}
                            </span>
                        ))}
                    </motion.div>
                )}

                <motion.h1
                    variants={fadeInUp}
                    className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md"
                >
                    {headline}
                </motion.h1>

                {subheadline && (
                    <motion.p
                        variants={fadeInUp}
                        className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed mt-3 font-light max-w-3xl mx-auto"
                    >
                        {subheadline}
                    </motion.p>
                )}

                {buttons && buttons.length > 0 && (
                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mt-6">
                        {buttons.map((btn, i) => (
                            <Link key={i} href={btn.link}>
                                <Button
                                    size="default"
                                    variant={btn.variant === "gold" || btn.variant === "primary" ? "default" : "outline"}
                                    className="font-bold text-xs uppercase tracking-wider"
                                >
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
