"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Calendar, Clock, MapPin, Download, CheckCircle, ArrowRight } from "lucide-react";
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

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={20} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Programme"
                buttons={[{ label: "Register Now", link: "/registration", variant: "primary" as const }]}
            />

            {/* Programme Structure Overview */}
            <section className="py-20 container mx-auto px-6 max-w-4xl">
                <h2 className="text-xl font-bold text-charcoal mb-8">Programme Structure Overview</h2>
                <div className="space-y-6 border-l-2 border-gray-200 pl-6 ml-3">
                    {data.overview.map((item: any, i: number) => (
                        <div key={i} className="relative">
                            <span className="absolute -left-[31px] top-1 bg-charcoal text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#FFFDF7]">
                                {i + 1}
                            </span>
                            <h3 className="font-bold text-gray-900">{item.day}</h3>
                            <p className="text-earth-green text-sm">{item.summary}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed Schedule */}
            <section className="py-12 container mx-auto px-6 max-w-5xl">
                <div className="flex gap-8 mb-12 border-b border-gray-100 overflow-x-auto">
                    {Object.keys(data.schedule).map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`pb-4 px-2 text-sm font-bold whitespace-nowrap transition-all relative ${activeDay === day ? "text-earth-green" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {day}
                            {activeDay === day && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-earth-green"></span>}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-[400px]">
                    {data.schedule[activeDay]?.map((session: any) => (
                        <div key={session.id} className="flex gap-6 group hover:bg-white hover:shadow-sm hover:rounded-xl p-4 transition-all -mx-4 border-b border-gray-100 last:border-0 border-dashed md:border-none">
                            <div className="w-32 shrink-0 pt-1">
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                    <Clock size={16} /> {session.time}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-serif font-bold text-charcoal mb-2">{session.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {session.tags.map((tag: string) => (
                                        <span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded-md ${tag === 'Welcome' ? 'bg-green-100 text-green-700' :
                                            tag === 'Soil Health' ? 'bg-blue-100 text-blue-700' :
                                                tag === 'Climate Adaptation' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Field Trip */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-200">
                            {data.fieldTrip.imageUrl && <img src={data.fieldTrip.imageUrl} alt="Field Trip" className="absolute inset-0 w-full h-full object-cover" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                        </div>
                        <div className="md:w-1/2 p-10">
                            <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">{data.fieldTrip.title}</h2>
                            <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                                <MapPin size={16} /> {data.fieldTrip.location}
                            </p>
                            <ul className="space-y-3 mb-8">
                                {data.fieldTrip.features.map((feat: any, i: number) => (
                                    <li key={feat.id || i} className="flex items-start gap-3 text-sm text-gray-700">
                                        <CheckCircle size={16} className="text-earth-green shrink-0 mt-0.5" />
                                        {/* Handle both object (feat.text) and string (feat) cases safely */}
                                        {typeof feat === 'string' ? feat : feat.text}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/registration">
                                <Button className="w-full bg-[#24C535] hover:bg-green-600 text-white font-bold">Add Field Trip to Registration</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Downloads */}
            <section className="py-20 container mx-auto px-6 max-w-5xl">
                <h2 className="text-xl font-bold text-charcoal mb-8">Download Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.downloads.map((item: any, i: number) => (
                        <a
                            key={i}
                            href={item.file || "#"}
                            target={item.file ? "_blank" : "_self"}
                            rel={item.file ? "noopener noreferrer" : ""}
                            className={`flex items-center justify-center gap-3 py-4 px-6 border border-gray-200 rounded-lg transition-colors font-medium
                                ${item.file ? "hover:bg-gray-50 text-charcoal cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"}
                            `}
                            onClick={(e) => !item.file && e.preventDefault()}
                        >
                            {getIcon(item.icon)} {item.label}
                        </a>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-6 max-w-5xl mb-20">
                <div className="bg-[#121E14] rounded-xl p-12 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">Ready to participate? Complete your registration now.</h2>
                    <Link href="/registration">
                        <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-md">Register Now</Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
