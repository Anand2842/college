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
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
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

    return (
        <div className="flex gap-4 md:gap-6 justify-center mt-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
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
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black/20 backdrop-blur-sm rounded-none border-[0.5px] border-rice-gold/40 flex items-center justify-center transition-all duration-500 group-hover:border-rice-gold/80 group-hover:bg-rice-gold/5">
                <span className="text-2xl md:text-3xl font-light text-rice-gold font-serif tracking-tighter">
                    {value.toString().padStart(2, "0")}
                </span>
            </div>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/60 mt-3 font-medium group-hover:text-rice-gold/80 transition-colors">
                {label}
            </span>
        </div>
    );
}
