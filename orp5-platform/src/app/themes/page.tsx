
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Themes | ORP-5 Conference',
    description: '5th International Conference on Organic and Natural Rice Production Systems',
};

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

import { getThemesPageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react"; // Import all icons
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ThemesPage() {
    const data = await getThemesPageData();

    if (!data) return <div>Loading...</div>;

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore - Dynamic access to Lucide icons
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={32} /> : null;
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-charcoal text-white">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-earth-green/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-rice-gold/10 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <p className="text-rice-gold/80 text-sm font-bold uppercase tracking-widest mb-4">Focus Areas</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        {data.hero.headline}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {data.hero.subheadline}
                    </p>
                </div>
            </section>

            {/* Core Themes Grid */}
            <section className="py-24 container mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">{data.intro.title}</h2>
                    <div className="h-1 w-20 bg-earth-green rounded-full"></div>
                </div>

                <div className="flex flex-col gap-8 md:gap-12 max-w-4xl mx-auto">
                    {data.themes.map((theme: any, index: number) => (
                        <div key={theme.id || index} className="group relative bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                            {/* Decorative vertical bar on hover */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#DFC074] to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                <div className="shrink-0">
                                    <div className="w-16 h-16 bg-[#123125]/5 rounded-xl flex items-center justify-center text-[#123125] group-hover:bg-[#123125] group-hover:text-[#DFC074] transition-colors duration-300">
                                        {getIcon(theme.iconName)}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-[#B89C50] mb-2">Theme {theme.order || index + 1}</span>
                                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-3 group-hover:text-[#123125] transition-colors">{theme.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">{theme.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pillars Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-serif font-bold text-charcoal mb-6">{data.pillars.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {data.pillars.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.pillars.items.map((pillar: any, index: number) => (
                            <div key={pillar.id} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-earth-green/30 transition-colors group">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-earth-green mb-6 group-hover:bg-earth-green group-hover:text-white transition-colors duration-300">
                                    {getIcon(pillar.iconName)}
                                </div>
                                <h3 className="text-xl font-bold text-charcoal mb-4">{pillar.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-sapling-green/20">
                <div className="container mx-auto px-6">
                    <div className="bg-earth-green/10 rounded-3xl p-12 md:p-16 border border-earth-green/20 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Submit your abstract aligned with any ORP-5 theme.</h2>
                            <p className="text-gray-700">Contribute to the global discussion on organic and natural rice production.</p>
                        </div>
                        <Link href="/submission-guidelines">
                            <button className="bg-earth-green hover:bg-earth-green/90 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-1">
                                View Abstract Guidelines <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
