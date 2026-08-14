import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    badge?: string;
    className?: string;
    centered?: boolean;
    variant?: "default" | "dark" | "gold";
}

export function SectionTitle({
    title,
    subtitle,
    badge,
    className,
    centered = true,
    variant = "default",
}: SectionTitleProps) {
    const isDark = variant === "dark";
    const isGold = variant === "gold";

    return (
        <div className={cn("mb-8 md:mb-10", centered && "text-center", className)}>
            {badge && (
                <span className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 border transition-all",
                    isDark
                        ? "bg-white/10 text-rice-gold-light border-rice-gold/30 backdrop-blur-sm"
                        : "bg-earth-green/5 text-earth-green border-earth-green/15"
                )}>
                    <span className="w-1.5 h-1.5 rounded-full bg-rice-gold animate-pulse" />
                    {badge}
                </span>
            )}

            <h2 className={cn(
                "text-3xl sm:text-4xl md:text-4xl font-serif font-bold tracking-tight leading-tight",
                isDark ? "text-white" : isGold ? "gradient-text-gold" : "text-charcoal"
            )}>
                {title}
            </h2>

            {/* Subtle Gradient Underline Accent */}
            <div className={cn(
                "h-1 rounded-full mt-3 transition-all",
                centered ? "mx-auto w-20 md:w-28" : "w-16 md:w-24",
                isDark
                    ? "bg-gradient-to-r from-rice-gold via-amber-glow to-transparent"
                    : "bg-gradient-to-r from-earth-green via-rice-gold to-sapling-green"
            )} />

            {subtitle && (
                <p className={cn(
                    "max-w-2xl mt-3 text-base sm:text-lg leading-relaxed",
                    centered && "mx-auto",
                    isDark ? "text-gray-300 font-light" : "text-charcoal/70"
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
