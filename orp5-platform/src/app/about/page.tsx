
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { getAboutPageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default async function AboutPage() {
    const data = await getAboutPageData();

    if (!data) return <div className="p-10 text-center">Loading About Page...</div>;

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={32} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            {/* Hero Section - Dark Green */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-charcoal text-white">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-earth-green/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-rice-gold/10 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6 text-center relative z-10">

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        {data.hero.headline}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {data.hero.subheadline}
                    </p>
                </div>
            </section>

            {/* Intro & At A Glance */}
            <section className="py-20 container mx-auto px-6 max-w-6xl">
                <h2 className="text-3xl font-serif font-bold text-charcoal mb-8">{data.intro.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                            {data.intro.description}
                        </p>
                    </div>
                    <div className="bg-[#FFFDF7] border border-rice-gold rounded-xl p-6 shadow-sm relative">
                        <div className="absolute -top-3 left-6 px-3 bg-[#FFFDF7] text-rice-gold font-bold text-sm">ORP-5 at a Glance</div>
                        <ul className="space-y-3 mt-2">
                            {data.intro.atAGlance.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-earth-green text-sm font-medium">
                                    <span className="w-1.5 h-1.5 bg-earth-green rounded-full"></span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why It Matters */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Why ORP-5 Matters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.whyMatters.map((item: any) => (
                            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 text-rice-gold mb-6">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="font-bold text-lg text-charcoal mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="py-20 container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Conference Objectives</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {data.objectives.map((obj: string, i: number) => (
                        <div key={i} className="flex items-start gap-4">
                            <CheckCircle2 size={24} className="text-rice-gold shrink-0 mt-0.5" />
                            <p className="text-gray-700">{obj}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Organizers */}
            <section className="py-20 bg-[#FFFDF7] container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">About the Organizers</h2>
                </div>
                <div className="space-y-6">
                    {data.organizers.map((org: any) => (
                        <div key={org.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            {org.logoUrl && (
                                <div className="w-32 h-32 shrink-0 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                                    <img src={org.logoUrl} alt={org.name} className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-charcoal mb-3">{org.name}</h3>
                                <p className="text-gray-600 leading-relaxed">{org.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Partners */}
            <section className="py-12 text-center container mx-auto px-6">
                <h2 className="text-xl font-bold text-charcoal mb-8">Collaborating Partners</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {data.partners && data.partners.length > 0 ? (
                        data.partners.map((partner: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 group">
                                <div className="w-40 h-32 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-all">
                                    {partner.imageUrl ? (
                                        <img src={partner.imageUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-600">{partner.name}</span>
                                {partner.website && (
                                    <Link href={partner.website} target="_blank" className="text-xs text-earth-green hover:underline">
                                        Visit Website
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Partners</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Custom Footer CTA */}
            <section className="py-12 container mx-auto px-6 max-w-5xl">
                <div className="bg-charcoal rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Explore Themes, Programme & Registration for ORP-5</h3>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link href="/themes">
                            <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold">View Themes</Button>
                        </Link>
                        <Link href="/programme">
                            <Button variant="secondary" className="bg-white text-charcoal font-bold">Programme</Button>
                        </Link>
                        <Link href="/registration">
                            <Button className="bg-green-900 border border-green-700 hover:bg-green-800 text-white font-bold">Register Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
