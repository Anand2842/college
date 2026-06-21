"use client"

import Image from "next/image";
import { motion } from "framer-motion";

interface PartnerCardProps {
    name: string;
    logoUrl?: string;
    website?: string;
    delay?: number;
}

export function PartnerCard({ name, logoUrl, website, delay = 0 }: PartnerCardProps) {
    const content = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className="group flex flex-col items-center gap-3 w-32 md:w-40"
        >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-rice-gold/40 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt={name}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                    />
                ) : (
                    <span className="text-earth-green font-bold text-xl">
                        {name?.charAt(0)}
                    </span>
                )}
            </div>
            <span className="text-xs font-semibold text-charcoal group-hover:text-earth-green transition-colors text-center leading-tight">
                {name}
            </span>
        </motion.div>
    );

    if (website) {
        return (
            <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none"
            >
                {content}
            </a>
        );
    }

    return content;
}
