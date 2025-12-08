"use client"

import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { motion } from "framer-motion"

interface HeroProps {
    headline?: string;
    subheadline?: string;
    backgroundImage?: string;
}

export function Hero({
    headline = "5th International Conference on <br /> <span class='text-rice-gold'>Organic & Natural Rice</span> <br /> Farming",
    subheadline = "Advancing Global Agricultural Innovation & Sustainability <br/> 7-9 September 2026 | Galgotias University, Greater Noida, India", backgroundImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
            <div
                className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            />

            <div className="relative z-20 container mx-auto px-6 text-center text-white max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
                        <SafeHtml html={headline} />
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
                >
                    <SafeHtml html={subheadline} />
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-sapling-green hover:bg-sapling-green/90 text-white font-semibold text-lg px-8 py-6 rounded-full"
                    >
                        <Link href="/registration">Register Now</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white hover:text-earth-green font-medium text-lg px-8 py-6 rounded-full"
                    >
                        <Link href="/brochure">Download Brochure</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

function SafeHtml({ html }: { html: string }) {
    // Simple parser for specific tags: <br />, <br/>, <span class='...'>...</span>
    // This removes the need for dangerouslySetInnerHTML for our specific use case
    const parts = html.split(/(<br\s*\/?>|<span[^>]*>.*?<\/span>)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.match(/<br\s*\/?>/)) {
                    return <br key={index} />;
                }
                if (part.startsWith("<span")) {
                    const content = part.replace(/<[^>]+>/g, ""); // Extract text
                    // extract class
                    const classMatch = part.match(/class=['"]([^'"]*)['"]/);
                    const className = classMatch ? classMatch[1] : "";
                    return <span key={index} className={className}>{content}</span>;
                }
                return part;
            })}
        </>
    );
}
