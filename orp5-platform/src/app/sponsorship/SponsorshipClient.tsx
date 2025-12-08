"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Globe, Award, Users, Sprout, CheckCircle, Mail, Phone, Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

export default function SponsorshipClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/sponsorship")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Globe": return <Globe size={32} />;
            case "Award": return <Award size={32} />;
            case "Users": return <Users size={32} />;
            case "Sprout": return <Sprout size={32} />;
            default: return <Sun size={32} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-[#123125] pt-40 pb-32 text-center text-white relative overflow-hidden">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="container mx-auto px-6 relative z-10 max-w-4xl"
                >
                    <motion.div variants={fadeInUp} className="text-earth-green/60 text-sm font-semibold mb-6 uppercase tracking-widest">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link> / Sponsorship
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        {data.hero.headline}
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        {data.hero.subheadline}
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex justify-center gap-4">
                        {data.hero.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className={btn.variant === "primary" ? "bg-[#DFC074] hover:bg-[#d6b567] text-[#123125] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all" : "bg-transparent text-white border border-white hover:bg-white/10 font-bold px-8 py-3 rounded-full"}>
                                        {btn.label}
                                    </Button>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Decorative circles with parallax feel (simple animation) */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-[#DFC074]/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-[#24C535]/10 rounded-full blur-3xl"
                />
            </div>

            {/* Intro Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="container mx-auto px-6 py-24 max-w-4xl text-center"
            >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">{data.intro.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">{data.intro.description}</p>
            </motion.div>

            <div className="bg-[#FDF8F3] py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Why Sponsor Cards */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={stagger}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-bold text-charcoal mb-4">Why Sponsor ORP-5?</motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-500 mb-12">Connect with a dedicated global audience and position your brand at the forefront of agricultural innovation.</motion.p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.whySponsor.map((item: any, i: number) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-8 rounded-xl shadow-sm border border-transparent hover:border-[#DFC074]/30 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 bg-[#FFF8E1] rounded-full flex items-center justify-center text-[#DFC074] mb-6 group-hover:bg-[#DFC074] group-hover:text-white transition-colors duration-300">
                                        {getIcon(item.icon)}
                                    </div>
                                    <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sponsorship Tiers */}
            <div className="container mx-auto px-6 py-24 max-w-6xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Sponsorship Tiers</h2>
                    <p className="text-gray-500">Choose a package that aligns with your strategic goals and budget.</p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
                >
                    {data.tiers.map((tier: any, i: number) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className={`rounded-3xl p-8 border transition-all duration-300 relative group
                                ${tier.isHighlighted
                                    ? "bg-gradient-to-br from-white via-[#FFFBF2] to-[#FFFDF5] border-[#DFC074] shadow-[0_20px_50px_-12px_rgba(223,192,116,0.3)] z-10 scale-105"
                                    : "bg-white border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#DFC074]/30"
                                }`}
                        >
                            {tier.isHighlighted && (
                                <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-5">
                                    <div className="bg-gradient-to-r from-[#DFC074] to-[#B89C50] text-[#123125] text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2">
                                        <Award size={14} /> Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="mb-8 p-4 rounded-2xl bg-gray-50/50 group-hover:bg-white transition-colors">
                                <h3 className={`font-bold text-2xl mb-2 ${tier.isHighlighted ? "text-[#B89C50]" : "text-gray-800"}`}>
                                    {tier.name}
                                </h3>
                                <p className="text-gray-500 text-sm h-10 leading-snug">{tier.subheading}</p>
                            </div>

                            <div className="mb-8">
                                <span className={`text-5xl font-bold tracking-tight ${tier.isHighlighted ? "bg-gradient-to-r from-[#123125] to-[#1E5D43] bg-clip-text text-transparent" : "text-gray-900"}`}>
                                    {tier.price}
                                </span>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

                            <ul className="space-y-4 mb-10">
                                {tier.features.map((feat: string, j: number) => (
                                    <li key={j} className="flex items-start gap-4">
                                        <div className={`mt-0.5 p-1 rounded-full ${tier.isHighlighted ? "bg-[#DFC074]/20 text-[#B89C50]" : "bg-gray-100 text-gray-400 group-hover:bg-[#24C535]/10 group-hover:text-[#24C535]"} transition-colors`}>
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact?subject=Sponsorship">
                                <Button className={`w-full py-6 rounded-xl font-bold text-lg transition-all transform group-hover:scale-[1.02]
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
            <div className="bg-[#FBF9F4] py-24 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-serif font-bold text-charcoal mb-4"
                    >
                        How to Become a Sponsor
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-gray-500 mb-16"
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
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10 origin-left"
                        />

                        {data.howItWorks.map((step: any, i: number) => (
                            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 bg-[#DFC074] text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-[#FBF9F4] z-10"
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
            <div className="container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.contact.title}</h2>
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
                className="bg-[#0D241B] py-20 text-center text-white"
            >
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 text-[#DFC074]">Partner with ORP-5</h2>
                    <p className="text-gray-400 mb-10 leading-relaxed font-light">
                        {data.footerCta.subheadline}
                    </p>
                    <div className="flex justify-center gap-4">
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
                    <p className="text-xs text-gray-600 mt-16 uppercase tracking-widest">© 2026 ORP-5 Conference. All Rights Reserved.</p>
                </div>
            </motion.div>

        </main>
    );
}
