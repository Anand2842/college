"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Globe, Award, Users, Sprout, CheckCircle, Mail, Phone, Sun } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion } from "framer-motion";

const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920";

export default function SponsorshipClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/sponsorship")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Globe": return <Globe size={28} />;
            case "Award": return <Award size={28} />;
            case "Users": return <Users size={28} />;
            case "Sprout": return <Sprout size={28} />;
            default: return <Sun size={28} />;
        }
    };

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const fadeInUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage || FALLBACK_HERO_IMAGE}
                breadcrumb="Home / Sponsorship"
                buttons={data.hero.buttons}
            />

            {/* Intro Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeInUp}
                className="container mx-auto px-6 pt-16 pb-12 max-w-4xl text-center"
            >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-5">{data.intro.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">{data.intro.description}</p>
            </motion.div>

            {/* Why Sponsor Section */}
            <div className="py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="text-center mb-10"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-bold text-charcoal mb-3">Why Sponsor ORP-5?</motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-500 mb-10 max-w-2xl mx-auto">Connect with a dedicated global audience and position your brand at the forefront of agricultural innovation.</motion.p>
                        <div className={`grid gap-6 ${data.whySponsor.length <= 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                            {data.whySponsor.map((item: any, i: number) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                    className="bg-white p-7 rounded-xl shadow-sm border border-gray-100 hover:border-[#DFC074]/30 hover:shadow-md transition-all text-left group"
                                >
                                    <div className="w-11 h-11 bg-[#FFF8E1] rounded-full flex items-center justify-center text-[#DFC074] mb-5 group-hover:bg-[#DFC074] group-hover:text-white transition-colors duration-300">
                                        {getIcon(item.icon)}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sponsorship Tiers */}
            <div className="container mx-auto px-6 py-16 max-w-6xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-3">Sponsorship Tiers</h2>
                    <p className="text-gray-500">Choose a package that aligns with your strategic goals and budget.</p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
                >
                    {data.tiers.map((tier: any, i: number) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            whileHover={{ y: -8 }}
                            className={`rounded-3xl p-8 border transition-all duration-300 relative group flex flex-col
                                ${tier.isHighlighted
                                    ? "bg-gradient-to-br from-white via-[#FFF8E1] to-[#FFF8E1] border-[#DFC074] shadow-[0_8px_30px_-4px_rgba(223,192,116,0.35)] ring-1 ring-[#DFC074]/20"
                                    : "bg-white border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#DFC074]/30"
                                }`}
                        >
                            {tier.isHighlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-[#DFC074] to-[#B89C50] text-[#123125] text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                                        <Award size={13} /> Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 p-4 rounded-2xl bg-gray-50/50 group-hover:bg-white transition-colors">
                                <h3 className={`font-bold text-xl mb-1 ${tier.isHighlighted ? "text-[#B89C50]" : "text-gray-800"}`}>
                                    {tier.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-snug">{tier.subheading}</p>
                            </div>

                            <div className="mb-6">
                                <span className={`text-4xl font-bold tracking-tight ${tier.isHighlighted ? "bg-gradient-to-r from-[#123125] to-[#1E5D43] bg-clip-text text-transparent" : "text-gray-900"}`}>
                                    {tier.price}
                                </span>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {tier.features.map((feat: string, j: number) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-1 rounded-full shrink-0 ${tier.isHighlighted ? "bg-[#DFC074]/20 text-[#B89C50]" : "bg-gray-100 text-gray-400 group-hover:bg-[#24C535]/10 group-hover:text-[#24C535]"} transition-colors`}>
                                            <CheckCircle size={13} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact?subject=Sponsorship" className="mt-auto">
                                <Button className={`w-full py-5 rounded-lg font-bold text-base transition-all transform group-hover:scale-[1.02]
                                    ${tier.isHighlighted
                                        ? "bg-gradient-to-r from-[#DFC074] to-[#C5A048] hover:to-[#B89C50] text-[#123125] shadow-lg shadow-[#DFC074]/20"
                                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-md"}
                                `}>
                                    {tier.buttonLabel}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* How It Works */}
            <div className="py-16 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-serif font-bold text-charcoal mb-3"
                    >
                        How to Become a Sponsor
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-gray-500 mb-12"
                    >
                        Follow these simple steps to partner with ORP-5.
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {/* Connecting Line (desktop only) */}
                        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#DFC074]/30 via-[#DFC074]/60 to-[#DFC074]/30 -z-0" />

                        {data.howItWorks.map((step: any, i: number) => (
                            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 bg-[#DFC074] text-white rounded-full flex items-center justify-center font-bold text-xl mb-5 shadow-md border-4 border-[#FDFCF8] relative z-10"
                                >
                                    {step.step}
                                </motion.div>
                                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-3">{data.contact.title}</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">{data.contact.text}</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-700 font-medium">
                            <div className="bg-[#FFF8E1] p-2 rounded-full text-[#DFC074]"><Mail size={20} /></div>
                            {data.contact.email}
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-700 font-medium">
                            <div className="bg-[#FFF8E1] p-2 rounded-full text-[#DFC074]"><Phone size={20} /></div>
                            {data.contact.phone}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Footer CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[#123125] py-16 text-center text-white border-t border-white/10"
            >
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 text-[#DFC074]">Partner with ORP-5</h2>
                    <p className="text-white/60 mb-8 leading-relaxed font-light">
                        {data.footerCta.subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {data.footerCta.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className={btn.variant === "primary" ? "bg-[#DFC074] hover:bg-[#d6b567] text-[#123125] font-bold px-8 shadow-lg shadow-[#DFC074]/20" : "bg-transparent text-white border border-white hover:bg-white/10 font-bold px-8"}>
                                        {btn.label}
                                    </Button>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>

            <Footer />
        </main>
    );
}
