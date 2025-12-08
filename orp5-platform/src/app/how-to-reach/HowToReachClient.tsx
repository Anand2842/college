"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Plane, Train, TrainFront, Car, Bus, MapPin, ChevronDown, ChevronUp, Clock, Users, Accessibility, ShieldAlert, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

export default function HowToReachClient() {
    const [data, setData] = useState<any>(null);
    const [openSection, setOpenSection] = useState<string | null>("tm1"); // Default open first transport mode
    const [openLogistic, setOpenLogistic] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/content/how-to-reach")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Plane": return <Plane size={24} />;
            case "Train": return <Train size={24} />;
            case "TrainFront": return <TrainFront size={24} />;
            case "Car": return <Car size={24} />;
            case "Bus": return <Bus size={24} />;
            default: return <MapPin size={24} />;
        }
    };

    const getLogisticIcon = (title: string) => {
        if (title.includes("Travel Time")) return <Clock size={20} />;
        if (title.includes("Group")) return <Users size={20} />;
        if (title.includes("Accessibility")) return <Accessibility size={20} />;
        if (title.includes("Safety")) return <ShieldAlert size={20} />;
        if (title.includes("Contact")) return <Phone size={20} />;
        return <MapPin size={20} />;
    }

    const toggleSection = (id: string, setOpen: any, current: string | null) => {
        setOpen(current === id ? null : id);
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-[#0D241B] min-h-[70vh] flex items-center justify-center relative overflow-hidden pt-24 pb-24">
                <div className="absolute inset-0 z-0 bg-[#0D241B]">
                    {data.hero.backgroundImage && <img src={data.hero.backgroundImage} alt="Travel" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D241B] via-[#0D241B]/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                        <div className="text-earth-green/80 text-sm font-semibold mb-6 uppercase tracking-widest">
                            <Link href="/venue" className="hover:text-white transition-colors">Venue</Link> / How to Reach
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-tight">
                            {data.hero.headline}
                        </h1>
                        <p className="text-lg text-emerald-100/80 max-w-xl leading-relaxed mb-10">
                            {data.hero.subheadline}
                        </p>
                        <Link href="/contact?subject=Pickup">
                            <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all">
                                {data.hero.buttonLabel}
                            </Button>
                        </Link>
                    </div>

                    {/* Quick Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm ml-auto text-charcoal relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#E0F2FE] rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                        <h3 className="font-bold text-lg mb-6 border-b pb-2">Quick Summary</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-[#10B981] font-bold text-xs uppercase mb-1">Venue</p>
                                <p className="font-medium text-gray-700">{data.quickSummary.venue}</p>
                            </div>
                            <div>
                                <p className="text-[#10B981] font-bold text-xs uppercase mb-1">Dates</p>
                                <p className="font-medium text-gray-600">{data.quickSummary.dates}</p>
                            </div>
                            <div>
                                <p className="text-red-500 font-bold text-xs uppercase mb-1">Emergency Contact</p>
                                <p className="font-medium text-gray-600">{data.quickSummary.emergencyContact}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Transport Modes Accordion */}
            <div className="container mx-auto px-6 py-16 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {data.transportModes.map((item: any, i: number) => {
                        const isOpen = openSection === item.id;
                        return (
                            <div key={item.id} className={`border-b border-gray-100 last:border-0 transition-colors ${isOpen ? 'bg-emerald-50/30' : 'bg-white'}`}>
                                <button
                                    onClick={() => toggleSection(item.id, setOpenSection, openSection)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${isOpen ? 'bg-[#10B981] text-white' : 'bg-emerald-100 text-[#10B981]'} transition-colors`}>
                                            {getIcon(item.icon)}
                                        </div>
                                        <h3 className={`font-bold text-lg ${isOpen ? 'text-[#064E3B]' : 'text-gray-700'}`}>{item.mode}</h3>
                                    </div>
                                    {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
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
                                            <div className="px-8 pb-8 md:pl-20 md:pr-12">
                                                <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                                                {item.travelTime && (
                                                    <div className="inline-block bg-[#D1FAE5] text-[#065F46] text-xs font-bold px-3 py-1 rounded-full">
                                                        Est. Time: {item.travelTime}
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

            {/* Maps Section */}
            <div className="bg-gray-50 py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">{data.maps.title}</h2>
                            <p className="text-gray-500 leading-relaxed mb-8">{data.maps.description}</p>
                            <Link href={data.maps.directionsLink} target="_blank">
                                <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-3 rounded-full">
                                    Get Directions
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-md min-h-[300px] bg-gray-100 flex items-center justify-center">
                            {data.maps.mapImage ? <img src={data.maps.mapImage} alt="Map" className="rounded-lg w-full h-auto object-cover" /> : <div className="text-gray-400">Map Loading...</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logistics Dropdowns */}
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <div className="space-y-4">
                    {data.logistics.map((item: any, i: number) => {
                        const isOpen = openLogistic === item.id;
                        return (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleSection(item.id, setOpenLogistic, openLogistic)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-[#10B981]">{getLogisticIcon(item.title)}</div>
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                    </div>
                                    {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0 text-gray-600 text-sm leading-relaxed pl-12">
                                                {item.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#111827] py-16 text-center text-white m-6 rounded-3xl mx-auto max-w-5xl mb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-fullblur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-8">{data.footerCta.text}</h2>
                    <Link href={data.footerCta.buttonLink}>
                        <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full">
                            {data.footerCta.buttonLabel}
                        </Button>
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
