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
            className="bg-white rounded-lg shadow-xl shadow-black/5 p-8 flex flex-col items-center justify-center text-center gap-5 border border-rice-gold/10 hover:border-rice-gold/40 transition-all duration-300 cursor-pointer h-full group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rice-gold/20 via-rice-gold to-rice-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="bg-rice-gold/10 p-4 rounded-full text-rice-gold group-hover:bg-rice-gold group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="font-serif font-bold text-earth-green text-xl leading-snug group-hover:text-rice-gold-dark transition-colors">{title}</h3>
            <Link href={href} className="absolute inset-0" aria-label={title} />
        </motion.div >
    );
}
