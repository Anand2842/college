"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Calendar, CheckCircle, FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function ImportantDatesClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/important-dates")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Helper to bold text wrapped in **
    const renderText = (text: string) => {
        return text.split("**").map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
    };

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Important Dates"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 max-w-5xl mb-16 relative -mt-12 z-20">
                <div className="bg-[#FFF8F0] border-l-4 border-[#C1A87D] shadow-sm rounded-r-xl p-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-charcoal mb-3 font-serif">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{data.intro.description}</p>
                </div>

                {/* Master Timeline */}
                <div className="mb-20">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Master Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-gray-200 -z-10"></div>

                        {data.timeline.map((item: any, i: number) => (
                            <div key={i} className="group relative">
                                <div className="w-12 h-12 bg-[#C1A87D] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-md border-4 border-[#FDFCF8] group-hover:scale-110 transition-transform duration-300">
                                    {item.number}
                                </div>
                                <p className="text-earth-green font-bold text-sm mb-2 uppercase tracking-wide">{item.date}</p>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Breakdown */}
                <div className="mb-20">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Daily Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.dailyBreakdown.map((day: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group">
                                <p className="text-earth-green font-bold text-xs uppercase mb-3 bg-earth-green/5 w-fit px-2 py-1 rounded inline-block">
                                    {day.day}
                                </p>
                                <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-earth-green transition-colors">{day.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{day.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deadlines Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Presenter Deadlines */}
                    <div className="bg-[#FFFDF7] border border-[#F2EFE5] rounded-xl p-8 shadow-sm">
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.presenterDeadlines.title}</h3>
                        <p className="text-gray-500 text-sm mb-8">{data.presenterDeadlines.intro}</p>
                        <ul className="space-y-6">
                            {data.presenterDeadlines.items.map((item: any) => (
                                <li key={item.id} className="flex gap-4 items-start">
                                    <div className="bg-[#C1A87D]/10 p-1.5 rounded-full shrink-0 mt-0.5">
                                        <CheckCircle size={16} className="text-[#C1A87D]" />
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{renderText(item.text)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Exhibitor Deadlines */}
                    <div className="bg-[#F6FAf8] border border-earth-green/5 rounded-xl p-8 shadow-sm">
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.exhibitorDeadlines.title}</h3>
                        <p className="text-gray-500 text-sm mb-8">{data.exhibitorDeadlines.intro}</p>
                        <ul className="space-y-6">
                            {data.exhibitorDeadlines.items.map((item: any) => (
                                <li key={item.id} className="flex gap-4 items-start">
                                    <div className="bg-earth-green/10 p-1.5 rounded-full shrink-0 mt-0.5">
                                        <Calendar size={16} className="text-earth-green" />
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{renderText(item.text)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Downloads */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 mb-20">
                    <h3 className="text-xl font-bold text-charcoal mb-8">Downloads</h3>
                    <p className="text-sm text-gray-500 mb-8">Access key documents to help you plan your conference participation.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.downloads.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                                <div className="bg-white p-3 rounded-lg shadow-sm text-charcoal">
                                    {item.icon === "FileText" ? <FileText size={24} /> : item.icon === "Clock" ? <Clock size={24} /> : <Calendar size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.label}</h4>
                                    {item.file ? (
                                        <a href={item.file} className="text-xs text-[#C1A87D] hover:underline font-medium block mt-0.5">{item.sublabel}</a>
                                    ) : (
                                        <span className="text-xs text-gray-400 block mt-0.5">{item.sublabel}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-[#123125] rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 max-w-2xl mx-auto">
                            Don’t miss key deadlines — register early and submit your abstract on time.
                        </h2>
                        <Link href="/registration">
                            <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg shadow-green-900/20">
                                Register for ORP-5
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
