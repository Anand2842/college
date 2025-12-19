"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { RegistrationPageData } from "@/types/pages";
import { fetchJSON } from "@/lib/fetchWrapper";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, Globe, Monitor, Coffee, BookOpen, User, StickyNote, Smartphone, Users, Leaf, GraduationCap, Microscope, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RegistrationContent() {
    const [data, setData] = useState<RegistrationPageData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"physical" | "virtual">("physical");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        async function loadData() {
            const { data: jsonData, error: fetchError } = await fetchJSON<RegistrationPageData>("/api/content/registration");
            if (fetchError) {
                setError(fetchError);
            } else {
                setData(jsonData);
            }
        }
        loadData();
    }, []);

    const scrollToForm = (categoryName?: string) => {
        if (categoryName) setSelectedCategory(categoryName);
        document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // --- Data ---
    const pricingPhysical = {
        indian: [
            { category: "UG Students", member: "₹2,500", nonMember: "₹3,500" },
            { category: "PG Students / Research Scholars", member: "₹3,000", nonMember: "₹4,000" },
            { category: "Scientists / Professionals", member: "₹8,000", nonMember: "₹10,000" },
            { category: "Innovative Farmers", member: "₹2,700 (KKM/AIASA)", nonMember: "₹3,700" },
        ],
        foreign: [
            { category: "UG Students", fee: "USD 250" },
            { category: "PG Students / Research Scholars", fee: "USD 300" },
            { category: "Scientists / Professionals", fee: "USD 500" },
        ]
    };

    const pricingVirtual = {
        indian: [
            { category: "UG Students", member: "₹750", nonMember: "₹1,000" },
            { category: "PG Students / Research Scholars", member: "₹1,200", nonMember: "₹1,500" },
            { category: "Scientists / Professionals", member: "₹2,000", nonMember: "₹3,200" },
            { category: "Innovative Farmers", member: "₹900", nonMember: "₹1,300" },
        ],
        foreign: [
            { category: "UG Students", fee: "USD 25" },
            { category: "PG Students / Research Scholars", fee: "USD 35" },
            { category: "Scientists / Professionals", fee: "USD 50" },
        ]
    };

    if (error) return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
            <div className="text-center max-w-md">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-earth-green hover:underline">Try Again</button>
            </div>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-background relative">
            <Navbar variant="transparent" />

            {/* Step 1: Entry Point (Hero) */}
            <section className="pt-32 pb-20 bg-charcoal text-white relative overflow-hidden">
                {/* Green Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-earth-green/20 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-earth-green text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 animate-pulse">
                        <LucideIcons.Ticket size={16} /> {data.hero.statusText || "Registration Open"}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        {data.hero.headline}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {data.hero.subheadline}
                    </p>

                    {/* Primary CTA Button (Sticky on Mobile) */}
                    <div className="sticky top-20 z-40 bg-charcoal/95 backdrop-blur-sm py-4 border-b border-white/10 md:static md:bg-transparent md:border-0 md:p-0">
                        <button
                            onClick={() => scrollToForm()}
                            className="bg-earth-green hover:bg-green-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
                        >
                            Register Now <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* RESTORED: Who Can Participate Section */}
            {data.whoCanParticipate && (
                <section className="py-20 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">{data.whoCanParticipate.title}</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{data.whoCanParticipate.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {data.whoCanParticipate.items?.map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors">
                                    <div className="mt-1 text-earth-green shrink-0">
                                        <LucideIcons.CheckCircle2 size={20} />
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Step 2: Tabs Layout */}
            <section className="py-20 container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Participation Modes & Fees</h2>
                    <p className="text-gray-600">Select your preferred mode of attendance.</p>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="bg-stone-100 p-1.5 rounded-full shadow-inner inline-flex">
                        <button
                            onClick={() => setActiveTab("physical")}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all",
                                activeTab === "physical" ? "bg-earth-green text-white shadow-md" : "text-gray-500 hover:text-earth-green"
                            )}
                        >
                            <User size={18} /> Physical Mode
                        </button>
                        <button
                            onClick={() => setActiveTab("virtual")}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all",
                                activeTab === "virtual" ? "bg-earth-green text-white shadow-md" : "text-gray-500 hover:text-earth-green"
                            )}
                        >
                            <Monitor size={18} /> Virtual / Online Mode
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "physical" ? (
                        <motion.div
                            key="physical"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Indian Delegates */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                                    <div className="bg-stone-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                                        <span className="text-2xl">🇮🇳</span>
                                        <h3 className="text-lg font-serif font-bold text-charcoal">Indian Delegates</h3>
                                    </div>
                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full text-left bg-white text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-gray-500 text-xs">
                                                    <th className="px-6 py-3 font-bold">Category</th>
                                                    <th className="px-6 py-3 font-bold">Member*</th>
                                                    <th className="px-6 py-3 font-bold">Non-Member</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {pricingPhysical.indian.map((item, i) => (
                                                    <tr key={i} className="hover:bg-green-50/5 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-charcoal">{item.category}</td>
                                                        <td className="px-6 py-3 text-earth-green font-bold">{item.member}</td>
                                                        <td className="px-6 py-3 text-gray-600">{item.nonMember}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="px-6 py-2 text-[10px] text-gray-400 text-right">*AIASA Members</div>
                                    </div>
                                    {/* Special Rate */}
                                    <div className="bg-yellow-50/50 px-6 py-4 border-t border-yellow-100 flex items-start gap-3">
                                        <LucideIcons.Lightbulb className="text-yellow-600 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">GU Faculty Special Rate</p>
                                            <p className="text-sm text-yellow-700">Scientists / Faculty (GU Host): <span className="font-bold">₹5,000</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Foreign Delegates */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                                    <div className="bg-stone-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                                        <span className="text-2xl">🌍</span>
                                        <h3 className="text-lg font-serif font-bold text-charcoal">Foreign Delegates</h3>
                                    </div>
                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full text-left bg-white text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-gray-500 text-xs">
                                                    <th className="px-6 py-3 font-bold w-full">Category</th>
                                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Fee (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {pricingPhysical.foreign.map((item, i) => (
                                                    <tr key={i} className="hover:bg-green-50/5 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-charcoal">{item.category}</td>
                                                        <td className="px-6 py-3 text-earth-green font-bold">{item.fee}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="virtual"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Indian Delegates (Virtual) */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                                    <div className="bg-stone-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                                        <span className="text-2xl">🇮🇳</span>
                                        <h3 className="text-lg font-serif font-bold text-charcoal">Indian Delegates</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left bg-white text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-gray-500 text-xs">
                                                    <th className="px-6 py-3 font-bold">Category</th>
                                                    <th className="px-6 py-3 font-bold">Member*</th>
                                                    <th className="px-6 py-3 font-bold">Non-Member</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {pricingVirtual.indian.map((item, i) => (
                                                    <tr key={i} className="hover:bg-green-50/5 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-charcoal">{item.category}</td>
                                                        <td className="px-6 py-3 text-earth-green font-bold">{item.member}</td>
                                                        <td className="px-6 py-3 text-gray-600">{item.nonMember}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="px-6 py-2 text-[10px] text-gray-400 text-right">*AIASA Members</div>
                                    </div>
                                </div>

                                {/* Foreign Delegates (Virtual) */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                                    <div className="bg-stone-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                                        <span className="text-2xl">🌍</span>
                                        <h3 className="text-lg font-serif font-bold text-charcoal">Foreign Delegates</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left bg-white text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-gray-500 text-xs">
                                                    <th className="px-6 py-3 font-bold w-full">Category</th>
                                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Fee (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {pricingVirtual.foreign.map((item, i) => (
                                                    <tr key={i} className="hover:bg-green-50/5 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-charcoal">{item.category}</td>
                                                        <td className="px-6 py-3 text-earth-green font-bold">{item.fee}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Step 3: Registration Kit */}
            <section className="py-20 bg-charcoal text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-earth-green/10 pointer-events-none" />
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-rice-gold font-bold uppercase tracking-widest text-sm mb-2 block">What's Included?</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">Registration Kit & Benefits</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Physical Mode Benefits */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-rice-gold">
                                <User size={24} /> Physical Mode
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <BookOpen className="text-earth-green mb-4" size={32} />
                                    <h4 className="font-bold mb-2">Souvenir / Abstract Book</h4>
                                    <p className="text-sm text-gray-400">Comprehensive conference materials and documentation.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <LucideIcons.Briefcase className="text-earth-green mb-4" size={32} />
                                    <h4 className="font-bold mb-2">Conference Kit</h4>
                                    <p className="text-sm text-gray-400">Official delegate kit with essentials.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors sm:col-span-2">
                                    <Coffee className="text-earth-green mb-4" size={32} />
                                    <h4 className="font-bold mb-2">Refreshments & Lunch</h4>
                                    <p className="text-sm text-gray-400">Daily refreshments and lunch during conference days.</p>
                                </div>
                            </div>
                        </div>

                        {/* Virtual Mode Benefits */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-rice-gold">
                                <Monitor size={24} /> Virtual Mode
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <LucideIcons.Tv className="text-earth-green mb-4" size={32} />
                                    <h4 className="font-bold mb-2">Full Session Access</h4>
                                    <p className="text-sm text-gray-400">Access to all conference day sessions virtually.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <LucideIcons.PlayCircle className="text-earth-green mb-4" size={32} />
                                    <h4 className="font-bold mb-2">Live & Recorded</h4>
                                    <p className="text-sm text-gray-400">Watch sessions live or access recordings (if applicable).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 4: Important Notes */}
            <section className="py-20 container mx-auto px-6 max-w-4xl">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 text-yellow-900">
                        <LucideIcons.AlertTriangle size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <LucideIcons.Info className="text-yellow-700" size={32} />
                            <h2 className="text-2xl font-serif font-bold text-yellow-900">Important Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm border border-yellow-100">
                                <div className="flex items-start gap-3">
                                    <LucideIcons.CheckCircle2 className="text-green-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-charcoal mb-2">Fee Waiver</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Registration fee is waived for Chairpersons, Co-Chairpersons, Keynote Speakers & Hon’ble VCs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm border border-yellow-100">
                                <div className="flex items-start gap-3">
                                    <LucideIcons.Clock className="text-red-500 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-charcoal mb-2">Late Fee</h4>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-bold">₹1,000</span> (Indian Delegates)
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">USD 20</span> (Foreign Delegates)
                                        </p>
                                        <p className="text-xs text-red-500 mt-2 font-medium uppercase tracking-wide">
                                            Applicable after deadline
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 5: Final CTA */}
            {/* Step 5: Final CTA */}
            <section className="bg-earth-green text-white py-6 sticky bottom-0 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border-t border-white/10 backdrop-blur-md bg-earth-green/95">
                <div className="container mx-auto px-6 text-center flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                        <h2 className="text-xl md:text-2xl font-serif font-bold mb-1">Ready to Join ORP-5IC 2026?</h2>
                        <p className="text-white/80 text-sm hidden md:block">Secure your spot now.</p>
                    </div>
                    <button
                        onClick={() => scrollToForm()}
                        className="bg-white text-earth-green hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap"
                    >
                        Proceed to Registration Form <ChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* Form Section */}
            <div id="registration-form" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Registration Form</h2>
                        <p className="text-gray-600">Please fill out the details below to complete your registration.</p>
                    </div>
                    <RegistrationForm selectedCategory={selectedCategory} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
