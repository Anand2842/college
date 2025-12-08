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
    colorTheme?: "green" | "mint" | "gold";
    delay?: number;
}

export function ThemeCard({ icon, title, description, href, colorTheme = "green", delay = 0 }: ThemeCardProps) {

    const bgColors = {
        green: "bg-earth-green/10",
        mint: "bg-sapling-green/10",
        gold: "bg-rice-gold/20",
    };

    const iconColors = {
        green: "text-earth-green",
        mint: "text-sapling-green",
        gold: "text-yellow-700", // Darker gold for text
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={cn("rounded-2xl p-8 transition-colors hover:shadow-md", bgColors[colorTheme])}
        >
            <div className={cn("mb-6", iconColors[colorTheme])}>
                {icon}
            </div>
            <h3 className="text-xl font-serif font-bold text-charcoal mb-3">{title}</h3>
            <p className="text-charcoal/80 mb-6 leading-relaxed text-sm">
                {description}
            </p>
            <Link
                href={href}
                className={cn("inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all", iconColors[colorTheme])}
            >
                Learn More <ArrowRight size={16} />
            </Link>
        </motion.div>
    );
}
