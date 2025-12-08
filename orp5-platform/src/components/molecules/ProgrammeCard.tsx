"use client"
// Re-trigger build

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgrammeCardProps {
    day: string;
    date: string;
    activities: string[];
    delay?: number;
}

export function ProgrammeCard({ day, date, activities, delay = 0 }: ProgrammeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-8 border border-gray-100 hover:border-rice-gold/50 shadow-sm hover:shadow-md transition-all h-full flex flex-col"
        >
            <div className="mb-6">
                <h3 className="text-earth-green font-bold text-lg mb-1">{day}</h3>
                <p className="text-charcoal font-serif text-2xl font-bold">{date}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
                {activities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-charcoal/80">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sapling-green flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>

            <Link href="/programme" className="mt-auto inline-block">
                <button className="text-earth-green font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Full Agenda <ArrowRight size={16} />
                </button>
            </Link>
        </motion.div>
    );
}
