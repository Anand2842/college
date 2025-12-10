"use client"

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpeakerCardProps {
    name: string;
    role: string;
    institution: string;
    imageUrl: string;
    delay?: number;
}

export function SpeakerCard({ name, role, institution, imageUrl, delay = 0 }: SpeakerCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center text-center group"
        >
            <div className="relative mb-4 overflow-hidden rounded-full h-40 w-40 border-4 border-mist-white shadow-lg">
                {/* Placeholder for actual image or Next/Image */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold text-charcoal">{name}</h3>
            <p className="text-sm font-semibold text-earth-green mb-1">{role}</p>
            <p className="text-xs text-charcoal/70 max-w-[200px]">{institution}</p>
        </motion.div>
    );
}
