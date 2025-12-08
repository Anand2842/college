import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
    centered?: boolean;
}

export function SectionTitle({ title, subtitle, className, centered = true }: SectionTitleProps) {
    return (
        <div className={cn("mb-12", centered && "text-center", className)}>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4 relative inline-block">
                {title}
                {centered && <span className="block h-1 w-24 bg-rice-gold mx-auto mt-4 rounded-full" />}
            </h2>
            {subtitle && (
                <p className="text-charcoal/70 max-w-2xl mx-auto mt-4 text-lg">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
