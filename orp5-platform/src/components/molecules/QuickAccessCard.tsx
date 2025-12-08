"use client"

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react"; // Added import for React

interface QuickAccessCardProps {
    icon: React.ReactNode;
    title: string;
    href: string;
    delay?: number;
}

export function QuickAccessCard({ icon, title, href, delay = 0 }: QuickAccessCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center gap-4 border border-transparent hover:border-rice-gold/50 transition-colors cursor-pointer h-full"
        >
            <div className="bg-mist-white p-3 rounded-full text-earth-green">
                {icon}
            </div>
            <h3 className="font-semibold text-charcoal text-lg leading-tight">{title}</h3>
            <Link href={href} className="absolute inset-0" aria-label={title} />
        </motion.div>
    );
}
