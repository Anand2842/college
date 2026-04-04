"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Calendar, MapPin, PartyPopper } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import * as LucideIcons from "lucide-react";

export default function AwardsClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/awards")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={32} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Awards & Prizes"
            />

            {/* Intro */}
            <section className="py-20 bg-[#FDFBF2] container mx-auto px-6 max-w-5xl">
                <div className="border-l-4 border-rice-gold pl-8 py-2">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Award Categories</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Explore the various categories designed to honor exceptional work across the spectrum of organic rice research and practice.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.categories.map((cat: any) => (
                        <div key={cat.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-rice-gold hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-rice-gold mb-6">
                                {getIcon(cat.iconName)}
                            </div>
                            <h3 className="font-bold text-xl text-charcoal mb-3 font-serif">{cat.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Criteria */}
            <section className="py-20 bg-[#F5F2E9] container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Selection Criteria</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Submissions are evaluated against a comprehensive set of criteria to ensure fairness and recognize true excellence.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.criteria.map((crit: any) => (
                            <div key={crit.id} className="bg-[#FFFDF7] border border-[#E6E1D0] p-6 rounded-xl">
                                <h4 className="font-bold text-charcoal mb-2">{crit.title}</h4>
                                <p className="text-sm text-gray-600">{crit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Judging Committee */}
            <section className="py-20 container mx-auto px-6 max-w-3xl text-center">
                <div className="mb-6 flex justify-center">
                    <LucideIcons.Gavel size={40} className="text-earth-green" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.judging.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    {data.judging.description}
                </p>
            </section>

            {/* Logistics Cards */}
            <section className="py-12 bg-white container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
                        <Calendar className="text-rice-gold mx-auto mb-4" size={24} />
                        <h4 className="font-bold text-charcoal">Date</h4>
                        <p className="text-sm text-gray-500">{data.logistics.date}</p>
                    </div>
                    <div className="border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
                        <MapPin className="text-rice-gold mx-auto mb-4" size={24} />
                        <h4 className="font-bold text-charcoal">Venue</h4>
                        <p className="text-sm text-gray-500">{data.logistics.venue}</p>
                    </div>
                    <div className="border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
                        <PartyPopper className="text-rice-gold mx-auto mb-4" size={24} />
                        <h4 className="font-bold text-charcoal">Event</h4>
                        <p className="text-sm text-gray-500">{data.logistics.event}</p>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-earth-green py-20 text-center mt-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Present your best work at ORP-5.</h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-10">Showcase your research and innovations to a global audience. The next big breakthrough could be yours.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/submission">
                            <Button className="bg-rice-gold text-charcoal font-bold hover:bg-yellow-500">Submit Abstract</Button>
                        </Link>
                        <Link href="/submission-guidelines">
                            <Button variant="secondary" className="bg-[#FFFDF7] text-charcoal font-bold">View Guidelines</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
