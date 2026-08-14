"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleIn" | "blurIn";

interface ScrollRevealProps {
    children: ReactNode;
    variant?: AnimationVariant;
    className?: string;
    delay?: number;
    duration?: number;
    once?: boolean;
    margin?: string;
}

export function ScrollReveal({
    children,
    variant = "fadeUp",
    className = "",
    delay = 0,
    duration = 0.6,
    once = true,
    margin = "-10%",
}: ScrollRevealProps) {
    const variants = {
        fadeUp: {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        },
        fadeDown: {
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0 },
        },
        fadeLeft: {
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0 },
        },
        fadeRight: {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 },
        },
        scaleIn: {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
        },
        blurIn: {
            hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
            visible: { opacity: 1, filter: "blur(0px)", y: 0 },
        },
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: margin as any }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            variants={variants[variant]}
        >
            {children}
        </motion.div>
    );
}
