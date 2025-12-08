"use client"

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateStepProps {
    date: string;
    label: string;
    status: "completed" | "active" | "upcoming";
    isLast?: boolean;
}

export function DateStep({ date, label, status, isLast }: DateStepProps) {
    const isCompleted = status === "completed";
    const isActive = status === "active";

    return (
        <div className="flex flex-col items-center text-center relative flex-1">
            {/* Connector Line */}
            {!isLast && (
                <div
                    className={cn(
                        "hidden md:block absolute top-6 left-[50%] right-[-50%] h-0.5 z-0",
                        isCompleted ? "bg-sapling-green" : "bg-gray-200"
                    )}
                />
            )}

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className={cn(
                    "relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                    isCompleted ? "bg-sapling-green text-white" :
                        isActive ? "bg-rice-gold text-charcoal shadow-lg ring-4 ring-rice-gold/20" : "bg-gray-100 text-gray-400"
                )}
            >
                {isCompleted ? <CheckCircle2 size={24} /> : <Clock size={24} />}
            </motion.div>

            <h4 className={cn("text-lg font-bold font-serif mb-1", isActive ? "text-earth-green" : "text-charcoal")}>{date}</h4>
            <p className="text-sm text-charcoal/70">{label}</p>
        </div>
    );
}
