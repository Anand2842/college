"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import {
    BookOpen, FileText, Newspaper,
    CheckCircle, PenLine, ExternalLink,
    Type, AlignLeft, FileCode, Globe, Presentation, ClipboardCheck, Hash
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const PUBLICATION_OUTPUTS = [
    {
        icon: <BookOpen size={28} />,
        title: "Souvenir & Abstract Book",
        description: "All selected abstracts will be published in the official conference Souvenir with ISBN, distributed to all physical participants.",
    },
    {
        icon: <FileText size={28} />,
        title: "Special Issue Journal",
        description: "Full-length papers will be published in the Special Issue of Plant Science Today, a peer-reviewed, open-access journal.",
    },
    {
        icon: <Newspaper size={28} />,
        title: "Conference Proceedings",
        description: "Digital proceedings featuring all accepted oral, poster, and video presentations will be made available post-conference.",
    },
];

const TIMELINE_STEPS = [
    {
        step: "01",
        title: "Submit Abstract",
        description: "Submit via the online portal before 31 July 2026.",
    },
    {
        step: "02",
        title: "Peer Review",
        description: "Blind peer review by the Scientific Committee.",
    },
    {
        step: "03",
        title: "Acceptance",
        description: "Notification of abstract status by 05 August 2026.",
    },
    {
        step: "04",
        title: "Publication",
        description: "Published in Souvenir & Journal after the conference.",
    },
];

const AUTHOR_GUIDELINES = [
    { icon: <AlignLeft size={20} />, label: "Abstract Word Limit", value: "Maximum 500 words" },
    { icon: <Type size={20} />, label: "Font", value: "Times New Roman, 12pt" },
    { icon: <AlignLeft size={20} />, label: "Spacing", value: "Single-spaced" },
    { icon: <FileCode size={20} />, label: "File Format", value: "MS Word (.doc / .docx)" },
    { icon: <Globe size={20} />, label: "Language", value: "English" },
    { icon: <Presentation size={20} />, label: "Presentation Types", value: "Oral, Poster, or Video" },
    { icon: <ClipboardCheck size={20} />, label: "Review Process", value: "Blind peer review" },
    { icon: <Hash size={20} />, label: "Keywords", value: "3–5 keywords in alphabetical order" },
];

export default function PublicationsClient() {

    const fadeInUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            <PageHero
                headline="Publications & Proceedings"
                subheadline="ORP-5 research outputs — from abstracts to peer-reviewed journal publications."
                breadcrumb="Home / Publications"
            />

            {/* Intro Card */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeInUp}
                className="container mx-auto px-6 pt-16 mb-16 max-w-5xl"
            >
                <div className="bg-[#FFF8E1] rounded-xl p-10 md:p-14 border-l-4 border-[#D9A648] relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">Sharing Knowledge, Advancing Science</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Selected abstracts will be published in the <strong>Souvenir &amp; Abstract Book</strong>.
                            Full-length papers will be published in the <strong>Special Issue of Plant Science Today</strong>,
                            a peer-reviewed, open-access journal. At least one author must register before the deadline
                            for the abstract to be considered.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#D9A648]/10 rounded-full blur-3xl -mr-10 -mt-10" />
                </div>
            </motion.div>

            {/* Journal Partnership Card */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeInUp}
                className="container mx-auto px-6 mb-20 max-w-5xl"
            >
                <div className="bg-white rounded-3xl p-10 md:p-14 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        {/* Left: Journal Icon */}
                        <div className="shrink-0">
                            <div className="w-28 h-28 bg-gradient-to-br from-[#1A4D2E] to-[#2d7a4a] rounded-2xl flex items-center justify-center shadow-lg">
                                <FileText size={48} className="text-[#DFC074]" />
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#D9A648] mb-2">Journal Partnership</p>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal mb-4">
                                Published in <span className="text-[#1A4D2E]">Plant Science Today</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                Full-length papers from ORP-5 will be published in a dedicated Special Issue.
                                Plant Science Today is a peer-reviewed, open-access journal covering plant science research.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                <div className="bg-[#FFF8E1] px-5 py-3 rounded-xl border border-[#D9A648]/20">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Article Processing Charges</p>
                                    <p className="text-xl font-bold text-charcoal">₹16,000</p>
                                </div>
                                <div className="bg-[#F0FDF4] px-5 py-3 rounded-xl border border-emerald-200">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Review Type</p>
                                    <p className="text-xl font-bold text-charcoal">Blind Peer Review</p>
                                </div>
                            </div>
                            <Link href="/submission">
                                <Button className="bg-[#1A4D2E] hover:bg-[#143d24] text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                                    <PenLine size={18} />
                                    Submit Full Paper
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A648]/5 rounded-full blur-2xl -mr-10 -mt-10" />
                </div>
            </motion.div>

            {/* Publication Outputs */}
            <div className="py-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="text-center mb-12"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-bold text-charcoal mb-3">
                            What Gets Published
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto">
                            ORP-5 offers multiple publication opportunities for presenters and authors.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {PUBLICATION_OUTPUTS.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -8 }}
                                className="bg-white p-8 rounded-2xl border-t-4 border-[#D9A648] shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="w-14 h-14 bg-[#FFF8E1] rounded-xl flex items-center justify-center text-[#D9A648] mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg text-charcoal mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Publication Process Timeline */}
            <div className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-3">Publication Process</h2>
                        <p className="text-gray-500">From submission to publication — a clear four-step journey.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
                    >
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#D9A648]/30 via-[#D9A648]/60 to-[#D9A648]/30 -z-0" />

                        {TIMELINE_STEPS.map((step, i) => (
                            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 bg-[#D9A648] text-white rounded-full flex items-center justify-center font-bold text-xl mb-5 shadow-md border-4 border-[#FDFCF8] relative z-10"
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

            {/* Author Guidelines */}
            <div className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-3">Author Guidelines</h2>
                        <p className="text-gray-500">Key requirements for abstract and paper submissions.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid md:grid-cols-2 gap-4"
                    >
                        {AUTHOR_GUIDELINES.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:border-[#D9A648]/30 hover:shadow-md transition-all"
                            >
                                <div className="w-10 h-10 bg-[#FFF8E1] rounded-lg flex items-center justify-center text-[#D9A648] shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">{item.label}</p>
                                    <p className="font-semibold text-charcoal">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Downloads */}
            <div className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-3">Resources & Downloads</h2>
                        <p className="text-gray-500">Everything you need to prepare your submission.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: <FileText size={22} />,
                                title: "Submission Guidelines",
                                description: "Detailed instructions for abstract formatting and submission.",
                                link: "/submission-guidelines",
                                linkLabel: "View Guidelines",
                            },
                            {
                                icon: <BookOpen size={22} />,
                                title: "Conference Brochure",
                                description: "Download the full conference brochure with all details.",
                                link: "/downloads/prospectus.pdf",
                                linkLabel: "Download Brochure",
                            },
                            {
                                icon: <ExternalLink size={22} />,
                                title: "Submit Abstract",
                                description: "Ready to submit? Access the online submission portal.",
                                link: "/submission",
                                linkLabel: "Go to Portal",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -6 }}
                                className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <div className="w-12 h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center text-[#D9A648] mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{item.description}</p>
                                <Link href={item.link}>
                                    <Button variant="outline" className="w-full justify-center border-[#D9A648] text-[#D9A648] hover:bg-[#FFF8E1] font-bold text-sm">
                                        {item.linkLabel}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Footer CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[#123125] py-20 text-center text-white border-t border-white/10"
            >
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-serif font-bold mb-4 text-[#DFC074]">Ready to Share Your Research?</h2>
                    <p className="text-white/60 mb-10 leading-relaxed font-light">
                        Submit your abstract and contribute to the global body of knowledge in organic and natural rice production systems.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/submission">
                            <Button className="bg-[#DFC074] hover:bg-[#d6b567] text-[#123125] font-bold px-8 py-3 rounded-lg shadow-lg shadow-[#DFC074]/20">
                                Submit Abstract
                            </Button>
                        </Link>
                        <Link href="/submission-guidelines">
                            <Button className="bg-transparent text-white border border-white hover:bg-white/10 font-bold px-8 py-3 rounded-lg">
                                View Guidelines
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            <Footer />
        </main>
    );
}
