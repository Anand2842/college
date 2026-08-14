"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Plane, Train, TrainFront, Car, Bus, MapPin, ChevronDown, ChevronUp, Clock, Users, Accessibility, ShieldAlert, Phone, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

export default function HowToReachClient() {
    const [data, setData] = useState<any>(null);
    const [openSection, setOpenSection] = useState<string | null>("tm1");
    const [openLogistic, setOpenLogistic] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/content/how-to-reach")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Plane": return <Plane size={22} />;
            case "Train": return <Train size={22} />;
            case "TrainFront": return <TrainFront size={22} />;
            case "Car": return <Car size={22} />;
            case "Bus": return <Bus size={22} />;
            default: return <MapPin size={22} />;
        }
    };

    const getLogisticIcon = (title: string) => {
        if (title.includes("Travel Time")) return <Clock size={18} />;
        if (title.includes("Group")) return <Users size={18} />;
        if (title.includes("Accessibility")) return <Accessibility size={18} />;
        if (title.includes("Safety")) return <ShieldAlert size={18} />;
        if (title.includes("Contact")) return <Phone size={18} />;
        return <MapPin size={18} />;
    };

    const toggleSection = (id: string, setOpen: any, current: string | null) => {
        setOpen(current === id ? null : id);
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
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / How to Reach"
                buttons={[{ label: data.hero.buttonLabel || "Request Pickup", link: "/contact?subject=Pickup", variant: "primary" as const }]}
            />

            {/* Transport Modes Accordion */}
            <div className="container mx-auto px-6 py-14 max-w-5xl relative z-20 mt-10 md:mt-12">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-earth-green/15">
                    {data.transportModes.map((item: any) => {
                        const isOpen = openSection === item.id;
                        return (
                            <div key={item.id} className={`border-b border-gray-100 last:border-0 transition-colors ${isOpen ? 'bg-[#FAF9F5]' : 'bg-white'}`}>
                                <button
                                    onClick={() => toggleSection(item.id, setOpenSection, openSection)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50/80 transition-colors focus:outline-none cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOpen ? 'bg-earth-green text-rice-gold' : 'bg-earth-green/10 text-earth-green'} transition-colors shadow-sm`}>
                                            {getIcon(item.icon)}
                                        </div>
                                        <div>
                                            <h3 className={`font-serif font-bold text-lg md:text-xl ${isOpen ? 'text-earth-green' : 'text-charcoal'}`}>{item.mode}</h3>
                                            {item.travelTime && (
                                                <span className="text-xs text-charcoal/60 font-medium">Est. Transit: {item.travelTime}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-charcoal/60">
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-8 md:pl-24 md:pr-12">
                                                <p className="text-charcoal/75 leading-relaxed text-sm sm:text-base font-light mb-4">{item.description}</p>
                                                {item.travelTime && (
                                                    <div className="inline-flex items-center gap-2 bg-earth-green/10 text-earth-green text-xs font-bold px-3.5 py-1.5 rounded-full border border-earth-green/15">
                                                        <Clock size={13} />
                                                        <span>Est. Travel Time: {item.travelTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation & Maps */}
            <section className="bg-white py-16 border-y border-gray-200/60">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2 block">
                                GPS Navigation
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal mb-4">{data.maps.title}</h2>
                            <p className="text-charcoal/75 leading-relaxed mb-8 font-light text-base">{data.maps.description}</p>
                            <Link href={data.maps.directionsLink} target="_blank">
                                <Button variant="default" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                    Open in Google Maps <ExternalLink size={14} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="lg:col-span-6 bg-[#FAF9F5] p-3 rounded-3xl shadow-xl border border-earth-green/15 min-h-[340px] flex items-center justify-center overflow-hidden">
                            {data.maps.mapImage ? (
                                <img src={data.maps.mapImage} alt="Map Route" className="rounded-2xl w-full h-auto object-cover" />
                            ) : (
                                <div className="text-earth-green/50 text-sm font-medium">Interactive Map Loaded</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Practical Travel & Logistics Guidelines */}
            <section className="container mx-auto px-6 py-16 max-w-5xl">
                <SectionTitle
                    badge="Advisory"
                    title="Delegate Logistics & Transit FAQs"
                    subtitle="Practical recommendations for international delegates arriving in New Delhi."
                    centered
                />

                <div className="space-y-4 mt-10">
                    {data.logistics.map((item: any) => {
                        const isOpen = openLogistic === item.id;
                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-earth-green/10 shadow-sm overflow-hidden transition-all">
                                <button
                                    onClick={() => toggleSection(item.id, setOpenLogistic, openLogistic)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/80 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                            {getLogisticIcon(item.title)}
                                        </div>
                                        <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal">{item.title}</h3>
                                    </div>
                                    <div className="text-charcoal/50">
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0 text-charcoal/75 text-sm leading-relaxed pl-16 font-light">
                                                {item.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Travel Assistance CTA */}
            <section className="py-16 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Delegate Support Desk
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            {data.footerCta?.text || "Need Special Airport Transit Coordination?"}
                        </h3>
                        <p className="text-white/70 text-sm">
                            Our protocol desk assists with official invitation letters, visa clearances, and airport shuttle scheduling.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link href={data.footerCta?.buttonLink || "/contact"}>
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                {data.footerCta?.buttonLabel || "Contact Protocol Desk"} <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
