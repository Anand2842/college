"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { CheckCircle2, Clock, Calendar, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function ImportantDatesClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/important-dates")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const renderText = (text: string) => {
        return text.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} className="text-earth-green font-bold">{part}</strong> : part);
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Important Dates"
            />



            {/* Master Timeline */}
            <section className="py-20 bg-[#FAF9F5]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionTitle
                        badge="Conference Milestones"
                        title="Master Timeline"
                        subtitle="Track key dates from abstract submissions to final registration."
                        centered
                    />

                    <div className="relative mt-16 max-w-4xl mx-auto">
                        {/* Central Line */}
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-earth-green/10" />
                        
                        <div className="space-y-8 md:space-y-12">
                            {data.timeline?.map((item: any, i: number) => {
                                const isEven = i % 2 === 0;
                                return (
                                    <div key={i} className="relative flex flex-col md:flex-row items-center justify-between w-full group">
                                        
                                        {/* Center Dot with Number */}
                                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-earth-green/20 bg-white text-earth-green font-serif font-bold items-center justify-center z-10 shadow-sm group-hover:bg-earth-green group-hover:text-rice-gold group-hover:border-earth-green transition-all duration-300 group-hover:scale-110">
                                            {item.number || i + 1}
                                        </div>
                                        
                                        {/* Content Card */}
                                        <div className={`w-full md:w-[45%] ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                            <div className={`bg-white p-6 sm:p-8 rounded-3xl border border-earth-green/10 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 luxury-card text-center ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                <div className="md:hidden w-10 h-10 rounded-full bg-earth-green/10 text-earth-green font-serif font-bold flex items-center justify-center mx-auto mb-4">
                                                    {item.number || i + 1}
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-earth-green/60 block mb-2">{item.date}</span>
                                                <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal leading-snug group-hover:text-earth-green transition-colors">{item.title}</h3>
                                            </div>
                                        </div>

                                        {/* Empty Spacer */}
                                        <div className={`hidden md:block md:w-[45%] ${isEven ? 'md:order-2' : 'md:order-1'}`} />

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Breakdown */}
            <section className="py-24 bg-[#FAF9F5] relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="5-Day Programme"
                        title="Daily Conference Breakdown"
                        subtitle="Day-by-day thematic focus from inaugural plenaries to the valedictory awards ceremony."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {data.dailyBreakdown?.map((day: any, i: number) => (
                            <div key={i} className="group bg-white rounded-3xl p-8 border border-earth-green/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 luxury-card flex flex-col justify-between">
                                <div>
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-earth-green bg-earth-green/5 group-hover:bg-earth-green group-hover:text-rice-gold-light transition-colors px-4 py-1.5 rounded-full border border-earth-green/10 mb-6">
                                        {day.day}
                                    </span>
                                    <h3 className="font-serif font-bold text-2xl text-charcoal mb-4 group-hover:text-earth-green transition-colors">{day.title}</h3>
                                    <p className="text-charcoal/70 text-base leading-relaxed font-light">{day.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Presenter Deadlines */}
            <section className="py-24 container mx-auto px-6 max-w-4xl relative overflow-hidden border-t border-earth-green/10">
                <div className="relative z-10">
                    <div className="group bg-white rounded-3xl p-10 md:p-12 border border-earth-green/10 shadow-sm hover:shadow-xl hover:border-earth-green/30 transition-all duration-300 luxury-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-earth-green to-rice-gold opacity-80 group-hover:h-2 transition-all duration-300" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-earth-green/60 mb-3 block text-center">
                            Authors & Presenters
                        </span>
                        <h3 className="text-3xl font-serif font-bold text-charcoal mb-4 group-hover:text-earth-green transition-colors text-center">{data.presenterDeadlines?.title}</h3>
                        <p className="text-charcoal/60 text-base mb-10 font-light max-w-lg mx-auto text-center">{data.presenterDeadlines?.intro}</p>
                        
                        <ul className="space-y-6 max-w-2xl mx-auto">
                            {data.presenterDeadlines?.items?.map((item: any) => (
                                <li key={item.id} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-earth-green/5 text-earth-green flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-earth-green group-hover:text-rice-gold-light transition-colors">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed pt-1">{renderText(item.text)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Peer Review in Progress
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Abstract Submissions Closed (25 August 2026)
                        </h3>
                        <p className="text-white/70 text-sm">
                            Submissions are now under evaluation by the Scientific Committee. Track your review decisions and download receipts.
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center relative z-10 shrink-0">
                        <Link href="/ticket-status?tab=abstract">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Track Review Status <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/registration">
                            <Button variant="glass" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Register as Delegate
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
