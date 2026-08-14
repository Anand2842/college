import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-earth-green-dark shadow-md hover:shadow-lg hover:-translate-y-0.5",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
                outline:
                    "border border-border/80 bg-background/80 backdrop-blur-sm hover:bg-earth-green/5 hover:border-earth-green/30 text-foreground hover:text-earth-green",
                secondary:
                    "bg-muted text-foreground hover:bg-muted/80",
                ghost: "hover:bg-earth-green/10 hover:text-earth-green",
                link: "text-primary underline-offset-4 hover:underline",
                premium: "gold-shimmer-btn font-bold tracking-wide uppercase text-xs sm:text-sm",
                gold: "bg-rice-gold hover:bg-rice-gold-dark text-earth-green-dark font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5",
                glass: "bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md hover:border-white/40 shadow-sm",
                elevated: "bg-white text-earth-green border border-earth-green/15 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:border-earth-green/30",
            },
            size: {
                default: "h-11 px-5 py-2.5",
                sm: "h-9 rounded-md px-3.5 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-xl px-10 text-base sm:text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
