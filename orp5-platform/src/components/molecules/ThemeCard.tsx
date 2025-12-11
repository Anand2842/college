"use client"

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ThemeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    colorTheme?: "green" | "mint" | "gold" | "brown" | "red" | string;
    delay?: number;
    subtitle?: string;
}

export function ThemeCard({ icon, title, description, href, colorTheme = "green", delay = 0, subtitle }: ThemeCardProps) {

    const bgColors: Record<string, string> = {
        green: "bg-earth-green/10",
        mint: "bg-sapling-green/10",
        gold: "bg-rice-gold/20",
        brown: "bg-stone-100",
        red: "bg-red-50",
    };

    const iconColors: Record<string, string> = {
        green: "text-earth-green",
        mint: "text-sapling-green",
        gold: "text-yellow-700", // Darker gold for text
        brown: "text-stone-600",
        red: "text-red-600",
    };

    const activeBg = bgColors[colorTheme] || bgColors.green;
    const activeIcon = iconColors[colorTheme] || iconColors.green;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={cn("rounded-2xl p-8 transition-colors hover:shadow-md h-full flex flex-col", activeBg)}
        >
            <div className={cn("mb-6", activeIcon)}>
                {icon}
            </div>
            {subtitle && (
                <span className="block text-xs font-bold uppercase tracking-widest text-[#B89C50] mb-2">
                    {subtitle}
                </span>
            )}
            <h3 className="text-xl font-serif font-bold text-charcoal mb-3">{title}</h3>
            <p className="text-charcoal/80 mb-6 leading-relaxed text-sm">
                {description}
            </p>
            <Link
                href={href}
                className={cn("inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all", activeIcon)}
            >
                Learn More <ArrowRight size={16} />
            </Link>
        </motion.div>
    );
}
