"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Trophy, Award, Medal, Download, FileText, FileEdit, Paperclip, ExternalLink, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
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

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={28} /> : <Trophy size={28} />;
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero?.headline || "Awards & Honors"}
                subheadline={data.hero?.subheadline || "Celebrating outstanding scientific research, young scientist innovations, and exemplary organic farming practices."}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Awards & Prizes"
            />



            {/* Award Categories */}
            <section className="py-16 container mx-auto px-6 max-w-7xl">
                <SectionTitle
                    badge="Distinctions"
                    title="Award Categories"
                    subtitle="Honor categories designed to celebrate excellence across researchers, students, progressive farmers, and organic institutions."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    {data.categories?.map((cat: any) => (
                        <div 
                            key={cat.id} 
                            className="bg-white flex flex-col p-8 rounded-3xl shadow-sm border border-earth-green/10 hover:border-rice-gold/50 transition-all duration-300 luxury-card justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 bg-earth-green/5 text-rice-gold-dark rounded-2xl flex items-center justify-center mb-6">
                                    {getIcon(cat.iconName)}
                                </div>
                                <h3 className="font-serif font-bold text-xl text-charcoal mb-3">{cat.title}</h3>
                                <p className="text-charcoal/70 text-sm leading-relaxed font-light mb-6">{cat.description}</p>
                            </div>
                            
                            {cat.badges && cat.badges.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    {cat.badges.map((badge: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-[#FAF9F5] text-earth-green text-xs font-bold rounded-full border border-earth-green/15">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Selection Criteria */}
            <section className="py-16 bg-white border-y border-gray-200/60">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Evaluation Matrix"
                        title="Rigorous Selection Criteria"
                        subtitle="All submissions and nominations are evaluated by an independent jury of distinguished senior fellows."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {data.criteria?.map((crit: any) => (
                            <div key={crit.id} className="bg-[#FAF9F5] border border-earth-green/10 p-7 rounded-3xl luxury-card">
                                <h4 className="font-serif font-bold text-lg text-charcoal mb-2">{crit.title}</h4>
                                <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">{crit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Official Guidelines & Application Documents */}
            <section id="awards-notification-2026" className="py-16 container mx-auto px-6 max-w-7xl">
                <SectionTitle
                    badge="Nomination Portal"
                    title="Awards Notification & Official Application Forms"
                    subtitle="Download official nomination proformas, annexures, and submission templates."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    {/* Primary Guidelines Card */}
                    <div className="bg-earth-green-deep text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between border border-white/10 relative overflow-hidden luxury-card-dark">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-rice-gold/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 text-rice-gold flex items-center justify-center mb-6">
                                <LucideIcons.BookOpen size={28} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-3 text-white">Official Guidelines</h3>
                            <p className="text-white/75 text-sm mb-8 leading-relaxed font-light">
                                Comprehensive rules, eligibility criteria, and instructions for the National Awards submission process.
                            </p>
                        </div>

                        <Link 
                            href="https://drive.google.com/file/d/11OfrZl8ZBjU-bs4a5DtnQdvTq-HlRgfg/view?usp=drive_link" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full mt-auto"
                        >
                            <Button variant="premium" className="w-full text-xs uppercase tracking-wider font-bold">
                                <Download size={15} className="mr-2" /> Download Guidelines
                            </Button>
                        </Link>
                    </div>

                    {/* Application Forms Card */}
                    <div className="bg-white border border-earth-green/15 p-8 md:p-10 rounded-3xl shadow-lg flex flex-col justify-between luxury-card">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center mb-6">
                                <FileEdit size={28} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Application Forms</h3>
                            <p className="text-charcoal/70 text-sm mb-6 leading-relaxed font-light">
                                Standard nomination format documents for submitting nominations.
                            </p>
                            
                            <div className="flex flex-col gap-3 mb-6">
                                <Link 
                                    href="https://docs.google.com/document/d/1-1dQVxuzkNWVhuca--HSDW8APansjfOQ/edit?usp=drive_link" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-gray-100 hover:border-earth-green/40 transition-colors"
                                >
                                    <span className="text-xs font-bold text-charcoal">National Awards 2024</span>
                                    <ExternalLink size={14} className="text-earth-green" />
                                </Link>
                                <Link 
                                    href="https://docs.google.com/document/d/1rIa_9kYSgo3KOBnNM7UNFp-FqzeMq686/edit?usp=drive_link" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-gray-100 hover:border-earth-green/40 transition-colors"
                                >
                                    <span className="text-xs font-bold text-charcoal">National Awards 2025</span>
                                    <ExternalLink size={14} className="text-earth-green" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Supporting Annexures Card */}
                    <div className="bg-white border border-earth-green/15 p-8 md:p-10 rounded-3xl shadow-lg flex flex-col justify-between luxury-card">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center mb-6">
                                <Paperclip size={28} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Supporting Annexures</h3>
                            <p className="text-charcoal/70 text-sm mb-4 leading-relaxed font-light">
                                Mandatory declaration annexures and evaluation proformas.
                            </p>
                            
                            <div className="flex flex-col gap-2">
                                <Link 
                                    href="https://docs.google.com/document/d/1E2Ru2PNZpXmxj96zgAiNov0eAww30pUr/edit?usp=drive_link" 
                                    target="_blank" 
                                    className="text-xs text-charcoal/80 hover:text-earth-green py-1.5 flex items-center gap-2"
                                >
                                    <FileText size={13} className="text-rice-gold-dark shrink-0" />
                                    <span>Annexure IA & IIA (2024)</span>
                                </Link>
                                <Link 
                                    href="https://docs.google.com/document/d/1tjuHKtMoY5vCDGWTdWZ1DAbgypfYKBEv/edit?usp=drive_link" 
                                    target="_blank" 
                                    className="text-xs text-charcoal/80 hover:text-earth-green py-1.5 flex items-center gap-2"
                                >
                                    <FileText size={13} className="text-rice-gold-dark shrink-0" />
                                    <span>Annexure IB & IIB (2025)</span>
                                </Link>
                                <Link 
                                    href="https://docs.google.com/document/d/1JEEey-rsr4W2plBkcw_2-x_jQkX6Zclh/edit?usp=drive_link" 
                                    target="_blank" 
                                    className="text-xs text-charcoal/80 hover:text-earth-green py-1.5 flex items-center gap-2"
                                >
                                    <FileText size={13} className="text-rice-gold-dark shrink-0" />
                                    <span>Annexure III (2024)</span>
                                </Link>
                                <Link 
                                    href="https://docs.google.com/document/d/1_GY1QZ60TsxcbooIUyeF2Mj94VaAf7zg/edit?usp=drive_link" 
                                    target="_blank" 
                                    className="text-xs text-charcoal/80 hover:text-earth-green py-1.5 flex items-center gap-2"
                                >
                                    <FileText size={13} className="text-rice-gold-dark shrink-0" />
                                    <span>Annexure IV (2025)</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Apply for Recognition
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            {data.cta?.title || "Nominate Your Research for ORP-5 Honors"}
                        </h3>
                        <p className="text-white/70 text-sm">
                            {data.cta?.description || "Showcase your breakthrough research and innovations to a global audience."}
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        {data.cta?.formLink ? (
                            <Link href={data.cta.formLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                    Apply for Awards <ArrowRight size={15} className="ml-2" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/submission-guidelines">
                                <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                    View Guidelines <ArrowRight size={15} className="ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
