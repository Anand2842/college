"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Download, Info, FlaskConical, CalendarDays, Users, MapPin, BedDouble, FileText, Image as ImageIcon, Store, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
// import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrochureClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/brochure")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Info": return <Info size={18} />;
            case "FlaskConical": return <FlaskConical size={18} />;
            case "CalendarDays": return <CalendarDays size={18} />;
            case "Users": return <Users size={18} />;
            case "MapPin": return <MapPin size={18} />;
            case "BedDouble": return <BedDouble size={18} />;
            case "FileText": return <FileText size={18} />;
            case "Image": return <ImageIcon size={18} />;
            case "Store": return <Store size={18} />;
            case "Calendar": return <Calendar size={18} />;
            default: return <Info size={18} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            {/* Hero Section - Card Style */}
            <div className="pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-6xl rounded-3xl overflow-hidden relative min-h-[500px] flex items-end bg-gray-900">
                    {data.hero.backgroundImage && <img src={data.hero.backgroundImage} alt="Brochure Background" className="absolute inset-0 w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="relative z-10 p-10 md:p-16 text-white max-w-4xl">
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Home / Brochure
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-none">
                            {data.hero.headline}
                        </h1>
                        <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed font-light">
                            {data.hero.subheadline}
                        </p>
                    </div>
                </div>
            </div>

            {/* Intro Card */}
            <div className="container mx-auto px-6 mb-16 max-w-5xl">
                <div className="bg-[#FFF8F0] rounded-xl p-10 md:p-14 border-l-4 border-[#D9A648] relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">{data.intro.title}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{data.intro.description}</p>
                    </div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#D9A648]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                </div>
            </div>

            {/* Highlights Grid */}
            <div className="container mx-auto px-6 mb-24 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.highlights.map((item: any, i: number) => (
                        <div key={item.id} className="bg-[#FFFDF7] p-8 rounded-2xl border-t-4 border-[#D9A648] shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-3 text-charcoal">{item.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Download Section */}
            <div className="container mx-auto px-6 mb-24 max-w-5xl">
                <div className="bg-[#FAF9F5] rounded-3xl p-12 md:p-16 text-center border border-[#EFECE5] shadow-lg shadow-[#EFECE5]/50">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">{data.downloadSection.title}</h2>
                    <p className="text-gray-500 mb-10 max-w-2xl mx-auto">{data.downloadSection.description}</p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {data.downloadSection.buttons.map((btn: any, i: number) => {
                            const isPrimary = btn.variant === "primary";
                            return (
                                <Link key={i} href={btn.link}>
                                    <Button className={cn(
                                        "px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2",
                                        isPrimary
                                            ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-lg shadow-emerald-500/20"
                                            : "bg-white border text-[#10B981] border-[#10B981] hover:bg-emerald-50"
                                    )}>
                                        <Download size={18} />
                                        {btn.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{data.downloadSection.footerText}</p>
                </div>
            </div>

            {/* Inside the Brochure - Chapters */}
            <div className="container mx-auto px-6 mb-24 max-w-3xl">
                <h2 className="text-2xl font-serif font-bold text-center text-charcoal mb-12">Inside the Brochure</h2>
                <div className="space-y-4">
                    {data.chapters.map((chapter: any) => (
                        <div key={chapter.id} className="flex items-center gap-6 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg group">
                            <div className="text-[#D9A648] group-hover:text-[#B88A38] transition-colors bg-[#FFF8F0] p-2 rounded-lg">
                                {getIcon(chapter.icon)}
                            </div>
                            <span className="text-gray-600 font-medium group-hover:text-charcoal transition-colors">{chapter.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#0D241B] py-24 text-center text-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{data.footerCta.headline}</h2>
                    <p className="text-emerald-100/70 mb-12 max-w-2xl mx-auto text-lg">{data.footerCta.subheadline}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {data.footerCta.buttons.map((btn: any, i: number) => {
                            if (btn.variant === "primary") {
                                return (
                                    <Link key={i} href={btn.link}>
                                        <Button className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-900/50">
                                            {btn.label}
                                        </Button>
                                    </Link>
                                )
                            }
                            if (btn.variant === "secondary") {
                                return (
                                    <Link key={i} href={btn.link}>
                                        <Button className="bg-[#D9A648] hover:bg-[#B88A38] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-yellow-900/20">
                                            {btn.label}
                                        </Button>
                                    </Link>
                                )
                            }
                            return (
                                <Link key={i} href={btn.link}>
                                    <Button variant="outline" className="border-emerald-700 text-emerald-100 hover:bg-emerald-900/50 hover:text-white px-8 py-3 rounded-full font-bold">
                                        {btn.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                {/* Footer bottom decorative bar */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[#D9A648]"></div>
            </div>

            <Footer />
        </main>
    );
}
