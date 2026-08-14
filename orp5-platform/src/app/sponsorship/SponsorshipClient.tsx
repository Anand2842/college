"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Globe, Award, Users, Sprout, CheckCircle, Mail, Phone, Sun, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920";

export default function SponsorshipClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/sponsorship")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Globe": return <Globe size={26} />;
            case "Award": return <Award size={26} />;
            case "Users": return <Users size={26} />;
            case "Sprout": return <Sprout size={26} />;
            default: return <Sun size={26} />;
        }
    };

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero?.headline || "Partnership & Sponsorship"}
                subheadline={data.hero?.subheadline || "Position your brand as an industry leader before 500+ global agriscience decision-makers and policy delegates."}
                backgroundImage={data.hero?.backgroundImage || FALLBACK_HERO_IMAGE}
                breadcrumb="Home / Sponsorship"
                buttons={data.hero?.buttons}
            />



            {/* Sponsorship Tiers */}
            <section className="container mx-auto px-6 py-16 max-w-7xl">
                <SectionTitle
                    badge="Partnership Packages"
                    title="Sponsorship Tiers & Benefits"
                    subtitle="Tiered packages designed for industry champions, technical providers, and institutional patrons."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 items-stretch">
                    {data.tiers?.map((tier: any, i: number) => (
                        <div
                            key={i}
                            className={`rounded-3xl p-8 md:p-10 border transition-all duration-300 relative flex flex-col justify-between ${
                                tier.isHighlighted
                                    ? "bg-earth-green-deep text-white border-rice-gold shadow-2xl ring-2 ring-rice-gold/40 luxury-card-dark"
                                    : "bg-white border-earth-green/10 text-charcoal shadow-sm hover:shadow-xl luxury-card"
                            }`}
                        >
                            {tier.isHighlighted && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="bg-rice-gold text-charcoal text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                        <Award size={12} /> Premier Tier
                                    </span>
                                </div>
                            )}

                            <div>
                                <div className="mb-6">
                                    <h3 className={`font-serif font-bold text-2xl mb-1 ${tier.isHighlighted ? "text-rice-gold" : "text-charcoal"}`}>
                                        {tier.name}
                                    </h3>
                                    <p className={`text-xs ${tier.isHighlighted ? "text-white/70" : "text-charcoal/60"}`}>{tier.subheading}</p>
                                </div>

                                <div className="mb-6">
                                    <span className={`text-3xl sm:text-4xl font-serif font-bold ${tier.isHighlighted ? "text-white" : "gradient-text-earth"}`}>
                                        {tier.price}
                                    </span>
                                </div>

                                <div className={`h-px mb-6 ${tier.isHighlighted ? "bg-white/10" : "bg-gray-100"}`}></div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features?.map((feat: string, j: number) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <CheckCircle size={15} className={`shrink-0 mt-0.5 ${tier.isHighlighted ? "text-rice-gold" : "text-earth-green"}`} />
                                            <span className={`text-xs sm:text-sm font-medium ${tier.isHighlighted ? "text-white/80" : "text-charcoal/70"}`}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href="/contact?subject=Sponsorship" className="mt-auto">
                                <Button 
                                    variant={tier.isHighlighted ? "premium" : "default"} 
                                    className="w-full text-xs uppercase tracking-wider font-bold"
                                >
                                    {tier.buttonLabel || "Inquire for Tier"}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Sponsor Section */}
            <section className="py-14 bg-white border-y border-gray-200/60">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="Strategic ROI"
                        title="Why Sponsor ORP-5?"
                        subtitle="Direct engagement with high-level policy delegations, UN agencies, state ministries, and research directors."
                        centered
                    />

                    <div className={`grid gap-6 mt-10 ${data.whySponsor?.length <= 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                        {data.whySponsor?.map((item: any, i: number) => (
                            <div
                                key={i}
                                className="bg-[#FAF9F5] p-8 rounded-3xl border border-earth-green/10 luxury-card flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-14 h-14 bg-earth-green/10 text-earth-green rounded-2xl flex items-center justify-center mb-6">
                                        {getIcon(item.icon)}
                                    </div>
                                    <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                                    <p className="text-charcoal/70 text-xs sm:text-sm leading-relaxed font-light">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            {data.howItWorks && (
                <section className="py-16 bg-white border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-6xl text-center">
                        <SectionTitle
                            badge="Onboarding Flow"
                            title="How to Become an Official Sponsor"
                            subtitle="A transparent onboarding process from initial inquiry to booth allocation."
                            centered
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                            {data.howItWorks.map((step: any, i: number) => (
                                <div key={i} className="bg-[#FAF9F5] rounded-3xl p-7 border border-earth-green/10 luxury-card text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-earth-green text-rice-gold font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-md">
                                        {step.step}
                                    </div>
                                    <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{step.title}</h3>
                                    <p className="text-charcoal/70 text-xs leading-relaxed font-light">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Direct Sponsorship Desk Contacts */}
            {data.contact && (
                <section className="container mx-auto px-6 py-14 max-w-4xl">
                    <div className="bg-white rounded-3xl p-8 md:p-10 border border-earth-green/15 shadow-lg text-center luxury-card">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2 block">
                            Direct Support Desk
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">{data.contact.title}</h3>
                        <p className="text-charcoal/70 text-sm max-w-md mx-auto mb-8 font-light">{data.contact.text}</p>
                        
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-charcoal/80 bg-[#FAF9F5] px-5 py-3 rounded-2xl border border-gray-100">
                                <Mail size={16} className="text-earth-green" />
                                <span>{data.contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-charcoal/80 bg-[#FAF9F5] px-5 py-3 rounded-2xl border border-gray-100">
                                <Phone size={16} className="text-earth-green" />
                                <span>{data.contact.phone}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}



            <Footer />
        </main>
    );
}
