import { createPageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
    title: 'Themes',
    description: '5th International Conference on Organic and Natural Rice Production Systems',
    path: '/themes',
});

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Button } from "@/components/atoms/Button";
import { getThemesPageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Sparkles, Send } from "lucide-react";
import Link from "next/link";

export default async function ThemesPage() {
    const data = await getThemesPageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={28} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Themes"
            />

            {/* Core Themes Section */}
            <section className="py-16 container mx-auto px-6 max-w-7xl">


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {data.themes.map((theme: any, index: number) => (
                        <div 
                            key={theme.id || index} 
                            className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-earth-green/10 hover:border-earth-green/30 transition-all duration-300 luxury-card overflow-hidden flex flex-col"
                        >
                            {/* Decorative Top Accent Bar */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rice-gold via-amber-glow to-earth-green opacity-80 group-hover:h-2 transition-all duration-300" />

                            {/* Watermark Index */}
                            <span className="absolute -top-4 -right-2 text-[120px] font-serif font-black text-earth-green/[0.03] group-hover:text-earth-green/[0.05] transition-colors pointer-events-none select-none leading-none">
                                {String(theme.order || index + 1).padStart(2, '0')}
                            </span>

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="w-14 h-14 bg-earth-green/5 rounded-2xl flex items-center justify-center text-earth-green group-hover:bg-earth-green group-hover:text-rice-gold-light transition-all duration-300 shadow-sm">
                                        {getIcon(theme.iconName || theme.icon)}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-earth-green/40 group-hover:text-earth-green/60 transition-colors">
                                        Track {String(theme.order || index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <h3 className="text-xl font-serif font-bold text-charcoal mb-4 group-hover:text-earth-green transition-colors line-clamp-3">
                                    {theme.title}
                                </h3>
                                
                                <p className="text-charcoal/70 leading-relaxed text-sm font-light mb-8 flex-1">
                                    {theme.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-earth-green/5">
                                    <Link 
                                        href="/submission" 
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth-green group-hover:text-rice-gold-dark hover:gap-3 transition-all"
                                    >
                                        <Send size={13} />
                                        <span>Submit Abstract</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pillars Section */}
            {data.pillars && data.pillars.items && (
                <section className="py-16 bg-white border-y border-gray-200/60 relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <SectionTitle
                            badge="Foundational Values"
                            title={data.pillars.title || "Guiding Scientific Pillars"}
                            subtitle={data.pillars.description || "The core pillars sustaining the international organic rice research continuum."}
                            centered
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                            {data.pillars.items.map((pillar: any, index: number) => (
                                <div key={pillar.id || index} className="bg-[#FAF9F5] rounded-3xl p-8 border border-earth-green/10 hover:border-rice-gold/40 transition-all luxury-card group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-earth-green mb-6 group-hover:bg-earth-green group-hover:text-rice-gold-light transition-all duration-300">
                                        {getIcon(pillar.iconName || pillar.icon)}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-charcoal mb-3">{pillar.title}</h3>
                                    <p className="text-charcoal/70 leading-relaxed text-sm">{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Call for Papers
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Submit Your Abstract for Review
                        </h3>
                        <p className="text-white/70 text-sm">
                            Accepted abstracts will be featured in the official ORP-5 proceedings and considered for Scopus-indexed partner journals.
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center relative z-10 shrink-0">
                        <Link href="/submission-guidelines">
                            <Button variant="glass" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Guidelines
                            </Button>
                        </Link>
                        <Link href="/submission">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Submit Abstract <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
