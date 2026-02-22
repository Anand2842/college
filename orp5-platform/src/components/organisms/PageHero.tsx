"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

interface HeroButton {
    label: string;
    link: string;
    variant?: "primary" | "secondary";
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    return (
        <section className="relative min-h-[400px] h-[50vh] flex items-center justify-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 bg-[#0D241B]">
                {backgroundImage && (
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D241B]/80 via-[#0D241B]/50 to-[#0D241B]/60" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-[#DFC074]/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

            {/* Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="container mx-auto px-6 text-center relative z-10 max-w-4xl"
            >
                {breadcrumb && (
                    <motion.p
                        variants={fadeInUp}
                        className="text-emerald-200/60 text-sm font-semibold mb-4 uppercase tracking-widest"
                    >
                        {breadcrumb.split(" / ").map((part, i, arr) => (
                            <span key={i}>
                                {i < arr.length - 1 ? (
                                    <Link href="/" className="hover:text-white transition-colors">{part}</Link>
                                ) : (
                                    <span className="text-emerald-100/80">{part}</span>
                                )}
                                {i < arr.length - 1 && " / "}
                            </span>
                        ))}
                    </motion.p>
                )}

                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight leading-tight"
                >
                    {headline}
                </motion.h1>

                {subheadline && (
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
                    >
                        {subheadline}
                    </motion.p>
                )}

                {buttons && buttons.length > 0 && (
                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mt-2">
                        {buttons.map((btn, i) => (
                            <Link key={i} href={btn.link}>
                                <Button
                                    className={
                                        btn.variant === "primary"
                                            ? "bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                                            : "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 font-bold px-8 py-3 rounded-full transition-all"
                                    }
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
