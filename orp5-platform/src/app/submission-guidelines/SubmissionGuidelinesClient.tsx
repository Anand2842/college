"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { ChevronDown, ChevronUp, FlaskConical, Image as ImageIcon, Store, HelpCircle, ArrowRight, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

export default function SubmissionGuidelinesClient() {
    const [data, setData] = useState<any>(null);
    const [openItem, setOpenItem] = useState<string | null>("g1");

    useEffect(() => {
        fetch("/api/content/submission-guidelines")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const toggleAccordion = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "FlaskConical": return <FlaskConical size={22} className="text-earth-green" />;
            case "Image": return <ImageIcon size={22} className="text-earth-green" />;
            case "Store": return <Store size={22} className="text-earth-green" />;
            case "HelpCircle": return <HelpCircle size={22} className="text-earth-green" />;
            default: return <HelpCircle size={22} className="text-earth-green" />;
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero?.headline || "Abstract & Participation Guidelines"}
                subheadline={data.hero?.subheadline || "Formatting specifications, review criteria, and ethical standards for ORP-5."}
                backgroundImage={data.hero?.imageUrl}
                breadcrumb="Home / Submission Guidelines"
                buttons={data.hero?.buttons}
            />

            <div className="container mx-auto px-6 max-w-7xl mt-10 md:mt-16 pb-24">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6 hidden lg:block">
                        <div className="bg-white rounded-3xl p-8 border border-earth-green/15 shadow-sm">
                            <h3 className="font-serif font-bold text-xl text-charcoal mb-6">Page Contents</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#author-guidelines" className="flex items-center gap-3 text-sm font-medium text-charcoal/70 hover:text-earth-green transition-colors">
                                        <Sparkles size={16} className="text-rice-gold" /> Author Guidelines
                                    </a>
                                </li>
                                <li>
                                    <a href="#submission-protocols" className="flex items-center gap-3 text-sm font-medium text-charcoal/70 hover:text-earth-green transition-colors">
                                        <FlaskConical size={16} className="text-rice-gold" /> Submission Protocols
                                    </a>
                                </li>
                                {data.codeOfConduct && (
                                    <li>
                                        <a href="#research-ethics" className="flex items-center gap-3 text-sm font-medium text-charcoal/70 hover:text-earth-green transition-colors">
                                            <ShieldCheck size={16} className="text-rice-gold" /> Research Ethics
                                        </a>
                                    </li>
                                )}
                                {data.contacts && data.contacts.length > 0 && (
                                    <li>
                                        <a href="#helpline" className="flex items-center gap-3 text-sm font-medium text-charcoal/70 hover:text-earth-green transition-colors">
                                            <HelpCircle size={16} className="text-rice-gold" /> Helpline
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* CTA Box in sidebar */}
                        <div className="bg-earth-green-deep text-white rounded-3xl p-8 border border-white/10 shadow-lg relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rice-gold/10 blur-[50px] rounded-full pointer-events-none" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                                Ready to Submit?
                            </span>
                            <h3 className="text-lg font-serif font-bold text-white mb-6">
                                Submit Your Abstract Online
                            </h3>
                            <Link href="/submission" className="block w-full">
                                <Button variant="premium" className="w-full text-xs uppercase tracking-wider font-bold justify-center">
                                    Submit Now <ArrowRight size={15} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* Author Guidelines Intro */}
                        <section id="author-guidelines" className="scroll-mt-32">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                                <Sparkles size={13} className="text-rice-gold" />
                                Author Guidelines
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal mb-6">
                                Standard Abstract Preparation Protocol
                            </h2>
                            <p className="text-charcoal/80 leading-relaxed text-base sm:text-lg font-light bg-white p-8 md:p-10 rounded-3xl border border-earth-green/10 shadow-sm luxury-card">
                                {data.intro}
                            </p>
                        </section>

                        {/* Guidelines Accordion */}
                        <section id="submission-protocols" className="scroll-mt-32">
                            <SectionTitle
                                badge="Specifications"
                                title="Submission Protocols"
                                subtitle="Detailed requirements for oral presentations, poster displays, and commercial exhibits."
                                centered={false}
                            />

                            <div className="space-y-4 mt-8">
                                {data.guidelines?.map((item: any) => {
                                    const isOpen = openItem === item.id;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`border transition-all duration-300 rounded-3xl overflow-hidden ${
                                                isOpen
                                                    ? "border-earth-green/30 bg-white shadow-lg ring-1 ring-earth-green/10"
                                                    : "border-earth-green/10 bg-white/80 hover:bg-white hover:border-earth-green/25 shadow-sm"
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleAccordion(item.id)}
                                                className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer"
                                            >
                                                <span className={`font-serif font-bold text-lg md:text-xl ${isOpen ? "text-earth-green" : "text-charcoal"}`}>
                                                    {item.title}
                                                </span>
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
                                                        <div className="px-6 pb-8 md:px-8 pt-0">
                                                            <p className="text-sm md:text-base leading-relaxed text-charcoal/75 font-light">
                                                                {item.content}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Code of Conduct */}
                        {data.codeOfConduct && (
                            <section id="research-ethics" className="scroll-mt-32 bg-white rounded-3xl p-8 md:p-10 border border-earth-green/10 shadow-sm luxury-card">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldCheck size={24} className="text-earth-green" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark">
                                        Research Ethics
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">{data.codeOfConduct.title}</h2>
                                <p className="text-charcoal/80 leading-relaxed text-base sm:text-lg font-light">{data.codeOfConduct.content}</p>
                            </section>
                        )}

                        {/* Contact Queries Section */}
                        {data.contacts && data.contacts.length > 0 && (
                            <section id="helpline" className="scroll-mt-32">
                                <SectionTitle
                                    badge="Helpline"
                                    title="Contact for Submission Queries"
                                    subtitle="Connect with the dedicated track convenors and editorial desk for assistance."
                                    centered={false}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    {data.contacts.map((contact: any) => (
                                        <div key={contact.id} className="bg-white border border-earth-green/10 rounded-3xl p-7 flex items-center gap-5 shadow-sm hover:shadow-md transition-all luxury-card">
                                            <div className="w-14 h-14 bg-earth-green/10 rounded-2xl flex items-center justify-center shrink-0">
                                                {getIcon(contact.icon)}
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-bold text-lg text-charcoal mb-1">{contact.label}</h3>
                                                <a href={`mailto:${contact.email}`} className="text-xs font-bold text-earth-green hover:underline">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Mobile CTA (Hidden on Desktop) */}
                        <div className="lg:hidden bg-earth-green-deep text-white rounded-3xl p-8 border border-white/10 shadow-lg relative overflow-hidden mt-12">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rice-gold/10 blur-[50px] rounded-full pointer-events-none" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block text-center">
                                Ready to Submit?
                            </span>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6 text-center">
                                Submit Your Abstract Online
                            </h3>
                            <Link href="/submission" className="block w-full">
                                <Button variant="premium" className="w-full text-xs uppercase tracking-wider font-bold justify-center py-4">
                                    Submit Now <ArrowRight size={15} className="ml-2" />
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
