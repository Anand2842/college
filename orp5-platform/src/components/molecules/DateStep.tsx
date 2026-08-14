"use client"

import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateStepProps {
    date: string;
    label: string;
    status: "completed" | "active" | "urgent" | "upcoming" | string;
    isLast?: boolean;
}

export function DateStep({ date, label, status, isLast }: DateStepProps) {
    const isCompleted = status === "completed";
    const isUrgent = status === "urgent" || status === "active";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
                "relative flex-1 min-w-[200px] p-6 rounded-2xl border transition-all duration-300 luxury-card text-center flex flex-col items-center justify-between",
                isUrgent
                    ? "bg-gradient-to-b from-white to-amber-50/40 border-rice-gold shadow-lg ring-2 ring-rice-gold/20"
                    : isCompleted
                        ? "bg-white/90 border-earth-green/15"
                        : "bg-white/60 border-border/80"
            )}
        >
            {/* Status Pill Indicator */}
            <div className="mb-4">
                {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sapling-green/10 text-sapling-green text-[11px] font-bold uppercase tracking-wider">
                        <CheckCircle2 size={13} /> Completed
                    </span>
                ) : isUrgent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-[11px] font-bold uppercase tracking-wider animate-pulse">
                        <AlertCircle size={13} /> Key Deadline
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        <Clock size={13} /> Upcoming
                    </span>
                )}
            </div>

            {/* Date Display */}
            <h4 className={cn(
                "text-lg md:text-xl font-serif font-bold mb-2",
                isUrgent ? "text-earth-green" : "text-charcoal"
            )}>
                {date}
            </h4>

            {/* Label */}
            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed font-medium">
                {label}
            </p>
        </motion.div>
    );
}
