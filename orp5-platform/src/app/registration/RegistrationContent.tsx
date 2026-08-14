"use client";

import { motion } from "framer-motion";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { User, Monitor, Clock, Gift, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function RegistrationContent() {
    const { openModal } = useRegistrationModal();

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline="Conference Registration"
                subheadline="Secure your participation pass for physical attendance at NASC Complex New Delhi or worldwide virtual live streaming."
                breadcrumb="Home / Registration"
            />

            <div className="container mx-auto px-6 max-w-6xl relative z-20 mt-10 md:mt-12 pb-20">
                {/* Participation Modes */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 shadow-xl luxury-card mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                        <Sparkles size={13} className="text-rice-gold" />
                        Hybrid Participation Formats
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">
                        Flexible Attendance Options
                    </h2>
                    <p className="text-charcoal/75 leading-relaxed text-base mb-8 font-light max-w-3xl">
                        ORP-5 is organized in both <strong>physical in-person and interactive virtual streaming modes</strong>. Participants who wish to attend or present oral/poster papers remotely may register under the virtual participation category.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-6 bg-[#FAF9F5] rounded-2xl border border-earth-green/10 luxury-card">
                            <div className="w-12 h-12 rounded-xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-lg text-charcoal mb-1">Physical In-Person Mode</h3>
                                <p className="text-xs sm:text-sm text-charcoal/70 font-light">Attend at the NASC Complex, New Delhi with complete delegate kit, lunch, refreshments & cultural galas.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-[#FAF9F5] rounded-2xl border border-earth-green/10 luxury-card">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                <Monitor size={24} />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-lg text-charcoal mb-1">Virtual / Online Live Mode</h3>
                                <p className="text-xs sm:text-sm text-charcoal/70 font-light">Interactive live stream passes for all 5 conference days, digital Q&A access, and digital proceedings book.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Fee Tables */}
                <section className="mb-16">
                    <SectionTitle
                        badge="Fee Schedule"
                        title="Delegate Registration Tariff"
                        subtitle="Tiered pricing for students, academic researchers, corporate professionals, and progressive farmers."
                        centered
                    />

                    {/* Indian Delegates */}
                    <div className="mt-10 mb-12">
                        <h3 className="text-xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2.5">
                            <span className="text-2xl">🇮🇳</span> For Indian Delegates (INR ₹)
                        </h3>

                        {/* Physical Mode Table */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-earth-green/10 mb-6 luxury-card">
                            <div className="bg-earth-green-deep text-white px-6 py-4 font-serif font-bold flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={18} className="text-rice-gold" /> PHYSICAL ATTENDANCE TARIFF
                                </div>
                                <span className="text-xs text-rice-gold uppercase tracking-wider font-sans font-bold">Includes delegate kit & meals</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead className="bg-[#FAF9F5] border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-charcoal/70">
                                        <tr>
                                            <th className="text-left p-4 pl-6">Category</th>
                                            <th className="text-center p-4">AIASA Members</th>
                                            <th className="text-center p-4 pr-6">Non-Members</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-charcoal">
                                        <tr>
                                            <td className="p-4 pl-6 font-medium">UG Students</td>
                                            <td className="p-4 text-center font-serif font-bold text-earth-green">₹2,500</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹3,500</td>
                                        </tr>
                                        <tr className="bg-[#FAF9F5]/50">
                                            <td className="p-4 pl-6 font-medium">PG Students / Research Scholars</td>
                                            <td className="p-4 text-center font-serif font-bold text-earth-green">₹3,000</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹4,000</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 pl-6 font-medium">Scientists / Faculty / Professionals</td>
                                            <td className="p-4 text-center font-serif font-bold text-earth-green">₹8,000</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹10,000</td>
                                        </tr>
                                        <tr className="bg-[#FAF9F5]/50">
                                            <td className="p-4 pl-6 font-medium">Innovative Farmers (KKM / AIASA Members)</td>
                                            <td className="p-4 text-center font-serif font-bold text-earth-green">₹2,700</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹3,700</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Virtual Mode Table */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-earth-green/10 luxury-card">
                            <div className="bg-blue-900 text-white px-6 py-4 font-serif font-bold flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <Monitor size={18} className="text-blue-300" /> VIRTUAL / ONLINE STREAMING TARIFF
                                </div>
                                <span className="text-xs text-blue-300 uppercase tracking-wider font-sans font-bold">5-Day Live Passes</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead className="bg-[#FAF9F5] border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-charcoal/70">
                                        <tr>
                                            <th className="text-left p-4 pl-6">Category</th>
                                            <th className="text-center p-4">AIASA Members</th>
                                            <th className="text-center p-4 pr-6">Non-Members</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-charcoal">
                                        <tr>
                                            <td className="p-4 pl-6 font-medium">UG Students</td>
                                            <td className="p-4 text-center font-serif font-bold text-blue-600">₹1,000</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹1,300</td>
                                        </tr>
                                        <tr className="bg-[#FAF9F5]/50">
                                            <td className="p-4 pl-6 font-medium">PG Students / Research Scholars</td>
                                            <td className="p-4 text-center font-serif font-bold text-blue-600">₹1,500</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹1,700</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 pl-6 font-medium">Scientists / Faculty / Professionals</td>
                                            <td className="p-4 text-center font-serif font-bold text-blue-600">₹2,800</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹3,600</td>
                                        </tr>
                                        <tr className="bg-[#FAF9F5]/50">
                                            <td className="p-4 pl-6 font-medium">Innovative Farmers (KKM / AIASA Members)</td>
                                            <td className="p-4 text-center font-serif font-bold text-blue-600">₹900</td>
                                            <td className="p-4 pr-6 text-center font-serif font-bold text-charcoal">₹1,300</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Foreign Delegates */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2.5">
                            <span className="text-2xl">🌍</span> For International Foreign Delegates (USD $)
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Physical Mode - Foreign */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-earth-green/10 luxury-card">
                                <div className="bg-earth-green-deep text-white px-6 py-4 font-serif font-bold text-sm flex items-center gap-2">
                                    <User size={18} className="text-rice-gold" /> PHYSICAL ATTENDANCE
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-charcoal">UG Students</span>
                                        <span className="font-serif font-bold text-lg text-earth-green">US$ 250</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-charcoal">PG Students / Research Scholars</span>
                                        <span className="font-serif font-bold text-lg text-earth-green">US$ 300</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm font-medium text-charcoal">Scientists / Professionals</span>
                                        <span className="font-serif font-bold text-lg text-earth-green">US$ 500</span>
                                    </div>
                                </div>
                            </div>

                            {/* Virtual Mode - Foreign */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-earth-green/10 luxury-card">
                                <div className="bg-blue-900 text-white px-6 py-4 font-serif font-bold text-sm flex items-center gap-2">
                                    <Monitor size={18} className="text-blue-300" /> VIRTUAL ATTENDANCE
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-charcoal">UG Students</span>
                                        <span className="font-serif font-bold text-lg text-blue-600">US$ 25</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-charcoal">PG Students / Research Scholars</span>
                                        <span className="font-serif font-bold text-lg text-blue-600">US$ 35</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm font-medium text-charcoal">Scientists / Professionals</span>
                                        <span className="font-serif font-bold text-lg text-blue-600">US$ 50</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Kit Inclusions & Late Fee Notice */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className="bg-white rounded-3xl p-8 border border-earth-green/10 shadow-sm luxury-card">
                        <h3 className="font-serif font-bold text-xl text-charcoal mb-4 flex items-center gap-2">
                            <Gift className="text-earth-green" size={22} /> Registration Kit Inclusions
                        </h3>
                        <div className="space-y-4 text-xs sm:text-sm">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-earth-green mt-0.5 shrink-0" size={16} />
                                <div>
                                    <p className="font-bold text-charcoal">Physical Delegates</p>
                                    <p className="text-charcoal/70 font-light">Souvenir / Abstract Book with ISBN, Official Bag, Conference Badge, Lanyard, Working Lunches & Refreshments.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-blue-600 mt-0.5 shrink-0" size={16} />
                                <div>
                                    <p className="font-bold text-charcoal">Virtual Delegates</p>
                                    <p className="text-charcoal/70 font-light">Interactive live stream passes for all 5 conference days and digital downloadable abstract book.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-amber-200/60 shadow-sm luxury-card flex flex-col justify-between">
                        <div>
                            <h3 className="font-serif font-bold text-xl text-charcoal mb-3 flex items-center gap-2">
                                <Clock className="text-amber-600" size={22} /> Late Fee Advisory
                            </h3>
                            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed font-light mb-4">
                                A late fee surcharge of <strong className="text-amber-700 font-bold">₹1,000 (Indian)</strong> or <strong className="text-amber-700 font-bold">US$ 20 (Foreign)</strong> will apply per registrant after the regular registration deadline.
                            </p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                            <AlertCircle size={16} className="text-amber-600 shrink-0" />
                            <span>Early bird registration is recommended to guarantee physical delegate kit allotment.</span>
                        </div>
                    </div>
                </div>

                {/* Register CTA */}
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Secure Your Attendance
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Ready to Complete Registration?
                        </h2>
                        <p className="text-white/70 text-sm font-light">
                            Fill out the delegate registration form and proceed to secure online payment checkout.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Button
                            onClick={openModal}
                            variant="premium"
                            size="lg"
                            className="text-xs uppercase tracking-wider font-bold"
                        >
                            Open Registration Form <ArrowRight size={15} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
