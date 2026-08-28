"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ThemeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    colorTheme?: string;
    delay?: number;
    subtitle?: string;
    submissionHref?: string;
}

export function ThemeCard({
    icon,
    title,
    description,
    href,
    delay = 0,
    subtitle,
    submissionHref,
}: ThemeCardProps) {
    // Extract theme number from subtitle if available (e.g. "Theme 1" -> "01")
    const themeNumMatch = subtitle?.match(/\d+/);
    const themeIndex = themeNumMatch ? themeNumMatch[0].padStart(2, "0") : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-7 md:p-8 border border-earth-green/10 hover:border-rice-gold/50 transition-all duration-300 luxury-card flex flex-col justify-between overflow-hidden"
        >
            {/* Ambient Watermark Track Number */}
            {themeIndex && (
                <span className="absolute -top-3 -right-2 text-7xl md:text-8xl font-serif font-black text-earth-green/[0.04] group-hover:text-rice-gold/10 transition-colors pointer-events-none select-none">
                    {themeIndex}
                </span>
            )}

            <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-earth-green/5 border border-earth-green/10 text-earth-green flex items-center justify-center mb-6 group-hover:bg-earth-green group-hover:text-rice-gold-light group-hover:scale-105 transition-all duration-300 shadow-sm">
                    {icon}
                </div>

                {subtitle && (
                    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2">
                        {subtitle}
                    </span>
                )}

                <h3 className="text-xl font-serif font-bold text-charcoal mb-3 group-hover:text-earth-green transition-colors leading-snug">
                    {title}
                </h3>

                <p className="text-charcoal/70 mb-6 leading-relaxed text-sm">
                    {description}
                </p>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-auto">
                <Link
                    href={submissionHref || href}
                    className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-earth-green group-hover:text-rice-gold-dark transition-all group-hover:gap-3"
                >
                    <span>{submissionHref ? "Submit Abstract to Track" : "Explore Track"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
