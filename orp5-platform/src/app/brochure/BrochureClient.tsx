"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Download, Info, FlaskConical, CalendarDays, Users, MapPin, BedDouble, FileText, Image as ImageIcon, Store, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function BrochureClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/brochure")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Info": return <Info size={20} className="text-earth-green" />;
            case "FlaskConical": return <FlaskConical size={20} className="text-earth-green" />;
            case "CalendarDays": return <CalendarDays size={20} className="text-earth-green" />;
            case "Users": return <Users size={20} className="text-earth-green" />;
            case "MapPin": return <MapPin size={20} className="text-earth-green" />;
            case "BedDouble": return <BedDouble size={20} className="text-earth-green" />;
            case "FileText": return <FileText size={20} className="text-earth-green" />;
            case "Image": return <ImageIcon size={20} className="text-earth-green" />;
            case "Store": return <Store size={20} className="text-earth-green" />;
            case "Calendar": return <Calendar size={20} className="text-earth-green" />;
            default: return <Info size={20} className="text-earth-green" />;
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
                headline={data.hero?.headline || "Official Conference Brochure"}
                subheadline={data.hero?.subheadline || "Download the comprehensive conference prospectus, call for papers, and sponsorship dossier."}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Brochure"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-10 md:mt-12 pb-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 shadow-xl luxury-card text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                        <Sparkles size={13} className="text-rice-gold" />
                        Comprehensive Prospectus
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">{data.intro?.title}</h2>
                    <p className="text-charcoal/75 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto font-light">{data.intro?.description}</p>
                </div>
            </div>

            {/* Highlights Grid */}
            <section className="container mx-auto px-6 py-12 max-w-7xl">
                <SectionTitle
                    badge="Brochure Contents"
                    title="Key Information Included"
                    subtitle="Everything delegates, presenters, and sponsors need in a consolidated document."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    {data.highlights?.map((item: any) => (
                        <div key={item.id} className="bg-white p-7 rounded-3xl border border-earth-green/10 shadow-sm hover:shadow-lg transition-all luxury-card flex flex-col justify-between">
                            <div>
                                <h3 className="font-serif font-bold text-lg mb-2 text-charcoal">{item.title}</h3>
                                <p className="text-xs text-charcoal/70 leading-relaxed font-light">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Download Action Section */}
            <section className="py-16 bg-white border-y border-gray-200/60 my-12">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2 block">
                        PDF Downloads
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal mb-4">{data.downloadSection?.title}</h2>
                    <p className="text-charcoal/70 text-base mb-10 max-w-2xl mx-auto font-light">{data.downloadSection?.description}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {data.downloadSection?.buttons?.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link} target="_blank">
                                <Button 
                                    variant={btn.variant === "primary" ? "premium" : "outline"} 
                                    size="lg"
                                    className="text-xs uppercase tracking-wider font-bold"
                                >
                                    <Download size={16} className="mr-2" />
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            {data.quickLinks && (
                <section className="container mx-auto px-6 py-14 max-w-5xl">
                    <SectionTitle
                        badge="Fast Navigation"
                        title="Explore Conference Sections"
                        subtitle="Jump directly to detailed pages across the ORP-5 platform."
                        centered
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                        {data.quickLinks.map((link: any) => (
                            <Link key={link.id} href={link.link}>
                                <div className="p-5 rounded-2xl bg-white border border-earth-green/10 hover:border-earth-green/40 transition-all flex items-center justify-between group luxury-card">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-earth-green/5 flex items-center justify-center">
                                            {getIcon(link.icon)}
                                        </div>
                                        <span className="text-xs font-bold text-charcoal group-hover:text-earth-green transition-colors">{link.title}</span>
                                    </div>
                                    <ArrowRight size={14} className="text-charcoal/40 group-hover:text-earth-green group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
