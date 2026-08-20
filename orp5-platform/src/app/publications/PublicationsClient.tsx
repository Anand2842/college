"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import {
    BookOpen, FileText, Newspaper,
    CheckCircle, PenLine, ExternalLink,
    Type, AlignLeft, FileCode, Globe, Presentation, ClipboardCheck, Hash, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const PUBLICATION_OUTPUTS = [
    {
        icon: <BookOpen size={26} />,
        title: "Souvenir & Abstract Book",
        description: "All peer-reviewed abstracts will be published with an international standard ISBN, indexed and distributed to all registered delegates.",
    },
    {
        icon: <FileText size={26} />,
        title: "Special Issue Journal",
        description: "Selected full-length manuscripts will be published in a peer-reviewed, open-access Scopus & Web of Science indexed journal (Plant Science Today).",
    },
    {
        icon: <Newspaper size={26} />,
        title: "Digital Conference Proceedings",
        description: "Comprehensive digital conference repository featuring oral presentations, poster showcases, and panel consensus resolutions.",
    },
];

const TIMELINE_STEPS = [
    {
        step: "01",
        title: "Submit Abstract",
        description: "Submit online before 25 August 2026.",
    },
    {
        step: "02",
        title: "Blind Peer Review",
        description: "Evaluated by domain editorial referees.",
    },
    {
        step: "03",
        title: "Decision & Status",
        description: "Notification issued by 25 August 2026.",
    },
    {
        step: "04",
        title: "Journal Publication",
        description: "Full papers published in indexed special issue.",
    },
];

const AUTHOR_GUIDELINES = [
    { icon: <AlignLeft size={18} />, label: "Abstract Word Limit", value: "Maximum 300 words" },
    { icon: <Type size={18} />, label: "Typography", value: "Times New Roman / Calibri, 12pt" },
    { icon: <AlignLeft size={18} />, label: "Line Spacing", value: "1.15 single spaced" },
    { icon: <FileCode size={18} />, label: "File Format", value: "MS Word (.doc / .docx)" },
    { icon: <Globe size={18} />, label: "Language", value: "English (UK / US consistent)" },
    { icon: <Presentation size={18} />, label: "Presentation Modes", value: "Oral, Poster, or Virtual" },
    { icon: <ClipboardCheck size={18} />, label: "Review Method", value: "Double-blind peer review" },
    { icon: <Hash size={18} />, label: "Keywords", value: "3–5 keywords separated by semicolons" },
];

export default function PublicationsClient() {
    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline="Publications & Proceedings"
                subheadline="ORP-5 research outputs — from peer-reviewed abstracts to Scopus-indexed journal special issues."
                breadcrumb="Home / Publications"
            />



            {/* Journal Partnership Highlight Showcase */}
            <section className="py-16 bg-[#FAF9F5] relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="bg-earth-green-deep rounded-[3rem] p-10 sm:p-14 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-earth-green/20">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rice-gold/5 blur-[150px] rounded-full pointer-events-none" />
                        
                        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-rice-gold/20 blur-3xl rounded-full" />
                                <div className="w-40 h-52 bg-[#FAF9F5] text-earth-green-deep rounded-2xl flex flex-col items-center justify-center shadow-2xl relative z-10 border-4 border-white/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                    <FileText size={48} className="mb-2" />
                                    <span className="font-serif font-black text-center leading-tight">PLANT<br/>SCIENCE<br/>TODAY</span>
                                </div>
                            </div>

                            <div className="flex-1 text-center lg:text-left">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-3 block">
                                    Official Journal Partnership
                                </span>
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                                    Special Issue in <br/><span className="text-rice-gold">Plant Science Today</span>
                                </h3>
                                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 font-light max-w-2xl">
                                    Selected full-length original research and review articles will undergo fast-track blind peer review for publication in a dedicated Special Issue.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl">
                                    <div className="flex items-center gap-3 text-sm font-semibold text-white/90 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <CheckCircle size={18} className="text-rice-gold shrink-0" />
                                        <span>Scopus, Web of Science & UGC-CARE Indexed</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-semibold text-white/90 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <CheckCircle size={18} className="text-rice-gold shrink-0" />
                                        <span>Crossref DOI Assigned to all papers</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <Link href="/submission">
                                        <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                            Submit Paper for Review <ArrowRight size={15} className="ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/submission-guidelines">
                                        <Button variant="glass" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                            Author Guidelines
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Publication Outputs Grid */}
            <section className="py-16 bg-[#FAF9F5] relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="Deliverables"
                        title="Publication Channels"
                        subtitle="Multiple recognized avenues to publish and archive your research contributions."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {PUBLICATION_OUTPUTS.map((item, i) => (
                            <div key={i} className="group bg-white p-10 rounded-3xl border border-earth-green/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 luxury-card flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-earth-green/5 group-hover:bg-earth-green text-earth-green group-hover:text-rice-gold-light transition-colors rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-serif font-bold text-2xl text-charcoal mb-4 group-hover:text-earth-green transition-colors">{item.title}</h3>
                                    <p className="text-charcoal/70 text-base leading-relaxed font-light">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Author Specifications Matrix */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-earth-green/[0.02] to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <SectionTitle
                        badge="Author Kit"
                        title="Formatting Specifications"
                        subtitle="Adhere to the following manuscript criteria before uploading your document."
                        centered
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 border border-earth-green/10 rounded-3xl overflow-hidden shadow-sm">
                        {AUTHOR_GUIDELINES.map((item, i) => (
                            <div key={i} className={`p-8 bg-white border-earth-green/10 flex flex-col justify-between
                                ${i % 4 !== 3 ? 'lg:border-r' : ''} 
                                ${i < 4 ? 'lg:border-b' : ''}
                                ${i % 2 === 0 && i % 4 === 0 ? 'sm:border-r' : ''}
                                ${i % 2 !== 0 && i % 4 !== 3 ? 'sm:border-r' : ''}
                                ${i < 6 ? 'sm:border-b' : ''}
                                hover:bg-earth-green/[0.02] transition-colors
                            `}>
                                <div className="w-12 h-12 rounded-xl bg-earth-green/5 text-earth-green flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-earth-green/60 block mb-2">
                                        {item.label}
                                    </span>
                                    <p className="font-serif font-bold text-charcoal text-base">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Publication Process Timeline */}
            <section className="py-24 bg-[#FAF9F5] border-t border-earth-green/10 relative">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Editorial Cycle"
                        title="Publication Process Timeline"
                        subtitle="From initial submission to peer review, revision, acceptance, and final publication."
                        centered
                    />

                    <div className="mt-20 relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-8 left-0 w-full h-0.5 bg-earth-green/10" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
                            {TIMELINE_STEPS.map((step, i) => (
                                <div key={i} className="relative text-center flex flex-col items-center group">
                                    <div className="w-16 h-16 rounded-full bg-white border-4 border-[#FAF9F5] text-earth-green font-serif font-black text-xl flex items-center justify-center mb-6 shadow-xl group-hover:bg-earth-green group-hover:text-rice-gold-light transition-colors relative z-10 ring-1 ring-earth-green/10">
                                        {step.step}
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-earth-green/10 shadow-sm w-full group-hover:border-earth-green/30 transition-colors">
                                        <h3 className="font-serif font-bold text-lg text-charcoal mb-3">{step.title}</h3>
                                        <p className="text-charcoal/70 text-sm leading-relaxed font-light">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Join Scientific Proceedings
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Submit Your Abstract for Peer Review
                        </h3>
                        <p className="text-white/70 text-sm">
                            Early submission ensures timely reviewer allocation and expedited review decisions.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link href="/submission">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Submit Abstract <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
