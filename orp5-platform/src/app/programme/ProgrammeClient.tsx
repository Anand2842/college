"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Calendar, Clock, MapPin, Download, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import * as LucideIcons from "lucide-react";

export default function ProgrammeClient() {
    const [data, setData] = useState<any>(null);
    const [activeDay, setActiveDay] = useState("Day 1");

    useEffect(() => {
        fetch("/api/content/programme")
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
        return IconComponent ? <IconComponent size={20} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Programme"
                buttons={[{ label: "Register as Delegate", link: "/registration", variant: "primary" as const }]}
            />

            {/* Programme Overview Structure */}
            <section className="py-16 container mx-auto px-6 max-w-6xl">
                <SectionTitle
                    badge="5-Day Roadmap"
                    title="Programme Structure Overview"
                    subtitle="A structured 5-day flow featuring inaugural plenaries, technical parallel tracks, farmer-scientist roundtables, and valedictory awards."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10">
                    {data.overview?.map((item: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => {
                                const matchedDay = Object.keys(data.schedule).find(d => d.includes(String(i + 1))) || `Day ${i + 1}`;
                                if (data.schedule[matchedDay]) setActiveDay(matchedDay);
                            }}
                            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer luxury-card ${
                                activeDay.includes(String(i + 1))
                                    ? "bg-earth-green text-white border-rice-gold/50 shadow-xl"
                                    : "bg-white border-earth-green/10 text-charcoal hover:border-earth-green/30"
                            }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                                activeDay.includes(String(i + 1)) ? "text-rice-gold" : "text-rice-gold-dark"
                            }`}>
                                Day {i + 1}
                            </span>
                            <h3 className="font-serif font-bold text-lg mb-2 leading-snug">{item.day}</h3>
                            <p className={`text-xs leading-relaxed ${
                                activeDay.includes(String(i + 1)) ? "text-white/80" : "text-charcoal/70"
                            }`}>{item.summary}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed Interactive Day Schedule */}
            <section className="py-16 bg-white border-y border-gray-200/60">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionTitle
                        badge="Technical Agenda"
                        title="Detailed Daily Schedule"
                        subtitle="Filter by conference day to explore keynote addresses, panel discussions, and parallel paper presentations."
                        centered
                    />

                    {/* Day Tabs */}
                    <div className="flex justify-center gap-3 md:gap-4 my-12 overflow-x-auto pb-2">
                        {Object.keys(data.schedule || {}).map((day) => {
                            const isActive = activeDay === day;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`py-3 px-6 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                                        isActive
                                            ? "bg-earth-green text-rice-gold shadow-lg ring-2 ring-earth-green/20"
                                            : "bg-[#FAF9F5] text-charcoal/70 hover:bg-earth-green/5 hover:text-earth-green border border-gray-200"
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Schedule Sessions */}
                    <div className="space-y-4 min-h-[400px]">
                        {data.schedule[activeDay]?.map((session: any) => (
                            <div 
                                key={session.id} 
                                className="bg-[#FAF9F5] rounded-3xl p-6 md:p-8 border border-earth-green/10 hover:border-rice-gold/40 transition-all luxury-card flex flex-col md:flex-row gap-6 md:items-center justify-between"
                            >
                                <div className="flex items-start md:items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-xs font-bold text-rice-gold-dark uppercase tracking-wider mb-1">
                                            <span>{session.time}</span>
                                        </div>
                                        <h4 className="text-lg md:text-xl font-serif font-bold text-charcoal">{session.title}</h4>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 md:justify-end">
                                    {session.tags?.map((tag: string) => (
                                        <span 
                                            key={tag} 
                                            className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-earth-green border border-earth-green/15 shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Programme Highlights */}
            {data.highlights && data.highlights.length > 0 && (
                <section className="py-16 container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="Special Features"
                        title="Conference Programme Highlights"
                        subtitle="Distinctive deliberative platforms designed into the ORP-5 scientific schedule."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {data.highlights.map((item: any, i: number) => (
                            <div key={i} className="bg-white rounded-3xl p-8 border border-earth-green/10 luxury-card flex flex-col items-start">
                                <div className="w-14 h-14 bg-earth-green/10 text-earth-green rounded-2xl flex items-center justify-center mb-6">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="font-serif font-bold text-xl text-charcoal mb-3">{item.title}</h3>
                                <p className="text-charcoal/70 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Join ORP-5
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Secure Your Delegate Pass Today
                        </h3>
                        <p className="text-white/70 text-sm">
                            Access all plenary sessions, 9 thematic break-outs, conference lunches, and official reception dinner.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link href="/registration">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Register Now <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
