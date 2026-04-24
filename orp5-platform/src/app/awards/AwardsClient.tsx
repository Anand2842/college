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
                        {data.intro.description.replace(" The nominee can receive awards up to 2 times within 5 years.", "")}
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
                        <div key={cat.id} className="bg-white flex flex-col p-8 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-rice-gold hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-rice-gold mb-6">
                                {getIcon(cat.iconName)}
                            </div>
                            <h3 className="font-bold text-xl text-charcoal mb-3 font-serif">{cat.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed flex-grow">{cat.description}</p>
                            
                            {cat.badges && cat.badges.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {cat.badges.map((badge: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-[#FDFBF2] text-earth-green text-xs font-bold rounded-full border border-[#E6E1D0]">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}
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



            {/* Awards Guidelines Notification & Documents */}
            <section id="awards-notification-2026" className="py-20 bg-[#FFFDF7] container mx-auto px-6 border-t border-gray-100">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Awards Notification & Important Documents</h2>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
                        Please ensure you read the official guidelines before proceeding with your application. Download the respective application forms and annexures below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Primary Guidelines */}
                    <div className="bg-earth-green text-white p-8 rounded-2xl shadow-lg flex flex-col h-full transform transition hover:-translate-y-1">
                        <div className="mb-6 text-rice-gold">
                            <LucideIcons.BookOpen size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-3">Official Guidelines</h3>
                        <p className="text-white/80 mb-8 flex-grow">
                            Comprehensive rules, eligibility criteria, and instructions for the National Awards submission process.
                        </p>
                        <Link href="https://drive.google.com/file/d/11OfrZl8ZBjU-bs4a5DtnQdvTq-HlRgfg/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full bg-white text-earth-green hover:bg-gray-100 font-bold flex items-center justify-center gap-2">
                                <LucideIcons.Download size={18} /> Download Guidelines
                            </Button>
                        </Link>
                    </div>

                    {/* Application Forms */}
                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex flex-col h-full transform transition hover:-translate-y-1">
                        <div className="mb-6 text-earth-green">
                            <LucideIcons.FileEdit size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Application Forms</h3>
                        <p className="text-gray-500 mb-8 flex-grow">
                            Standard formats for submitting your nomination. Choose the form corresponding to the award year.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="https://docs.google.com/document/d/1-1dQVxuzkNWVhuca--HSDW8APansjfOQ/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-earth-green hover:bg-earth-green/5 transition-colors">
                                <span className="text-sm font-medium text-charcoal group-hover:text-earth-green transition-colors">National Awards 2024</span>
                                <LucideIcons.ExternalLink size={16} className="text-gray-400 group-hover:text-earth-green transition-colors" />
                            </Link>
                            <Link href="https://docs.google.com/document/d/1rIa_9kYSgo3KOBnNM7UNFp-FqzeMq686/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-earth-green hover:bg-earth-green/5 transition-colors">
                                <span className="text-sm font-medium text-charcoal group-hover:text-earth-green transition-colors">National Awards 2025</span>
                                <LucideIcons.ExternalLink size={16} className="text-gray-400 group-hover:text-earth-green transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* Annexures */}
                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex flex-col h-full transform transition hover:-translate-y-1">
                        <div className="mb-6 text-earth-green">
                            <LucideIcons.Paperclip size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Supporting Annexures</h3>
                        <p className="text-gray-500 mb-8 flex-grow">
                            Required supporting documents and declarations to attach with your primary application.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link href="https://docs.google.com/document/d/1E2Ru2PNZpXmxj96zgAiNov0eAww30pUr/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 hover:text-earth-green transition-colors">
                                <LucideIcons.FileText size={16} className="text-rice-gold flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-earth-green transition-colors">Annexure IA & IIA (2024)</span>
                            </Link>
                            <Link href="https://docs.google.com/document/d/1tjuHKtMoY5vCDGWTdWZ1DAbgypfYKBEv/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 hover:text-earth-green transition-colors">
                                <LucideIcons.FileText size={16} className="text-rice-gold flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-earth-green transition-colors">Annexure IB & IIB (2025)</span>
                            </Link>
                            <Link href="https://docs.google.com/document/d/1JEEey-rsr4W2plBkcw_2-x_jQkX6Zclh/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 hover:text-earth-green transition-colors">
                                <LucideIcons.FileText size={16} className="text-rice-gold flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-earth-green transition-colors">Annexure III (2024)</span>
                            </Link>
                            <Link href="https://docs.google.com/document/d/1_GY1QZ60TsxcbooIUyeF2Mj94VaAf7zg/edit?usp=drive_link&ouid=105886527698035665353&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-2 hover:text-earth-green transition-colors">
                                <LucideIcons.FileText size={16} className="text-rice-gold flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-earth-green transition-colors">Annexure IV (2025)</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-earth-green py-20 text-center mt-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">
                        {data.cta?.title || "Present your best work at ORP-5."}
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-10">
                        {data.cta?.description || "Showcase your research and innovations to a global audience. The next big breakthrough could be yours."}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {data.cta?.formLink && (
                            <Link href={data.cta.formLink} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-white text-earth-green font-bold hover:bg-gray-100 flex items-center gap-2">
                                    <LucideIcons.ExternalLink size={18} /> Apply for Awards
                                </Button>
                            </Link>
                        )}

                        {!data.cta?.formLink && (
                            <Link href="/submission-guidelines">
                                <Button variant="secondary" className="bg-[#FFFDF7] text-charcoal font-bold">View Guidelines</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
