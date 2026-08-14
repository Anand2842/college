"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) {
        return (
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center mt-12">
                <TimeUnit value={0} label="Days" />
                <TimeUnit value={0} label="Hours" />
                <TimeUnit value={0} label="Minutes" />
                <TimeUnit value={0} label="Seconds" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center mt-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-rice-gold/80 group-hover:bg-white/15 shadow-xl">
                <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold gradient-text-gold tracking-tight">
                    {value.toString().padStart(2, "0")}
                </span>
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70 mt-3 font-semibold group-hover:text-rice-gold transition-colors">
                {label}
            </span>
        </div>
    );
}
