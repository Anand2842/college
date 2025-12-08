"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, ChevronDown, ChevronUp, FlaskConical, Image as ImageIcon, Store, HelpCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function SubmissionGuidelinesClient() {
    const [data, setData] = useState<any>(null);
    const [openItem, setOpenItem] = useState<string | null>("g1"); // Default first open

    useEffect(() => {
        fetch("/api/content/submission-guidelines")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    const toggleAccordion = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "FlaskConical": return <FlaskConical size={20} className="text-earth-green" />;
            case "Image": return <ImageIcon size={20} className="text-earth-green" />;
            case "Store": return <Store size={20} className="text-earth-green" />;
            case "HelpCircle": return <HelpCircle size={20} className="text-earth-green" />;
            default: return <HelpCircle size={20} className="text-earth-green" />;
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center text-center text-white px-6">
                <div className="absolute inset-0 z-0 bg-gray-900">
                    {data.hero.imageUrl && <img src={data.hero.imageUrl} alt="Background" className="w-full h-full object-cover brightness-[0.3]" />}
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">{data.hero.headline}</h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">{data.hero.subheadline}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {data.hero.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button
                                    className={btn.variant === "primary" ? "bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg" : "bg-white text-charcoal hover:bg-gray-100 font-bold px-8 py-3 rounded-full text-lg"}
                                >
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl py-20">
                {/* Intro */}
                <p className="text-gray-600 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
                    {data.intro}
                </p>

                {/* Guidelines Accordion */}
                <div className="space-y-4 mb-20">
                    {data.guidelines.map((item: any) => (
                        <div
                            key={item.id}
                            className={`border transition-all duration-300 rounded-xl overflow-hidden ${openItem === item.id ? "border-[#24C535]/30 bg-[#F0FDF4]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                        >
                            <button
                                onClick={() => toggleAccordion(item.id)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-bold text-lg ${openItem === item.id ? "text-[#104030]" : "text-gray-800"}`}>
                                    {item.title}
                                </span>
                                {openItem === item.id ? <ChevronUp className="text-[#24C535]" /> : <ChevronDown className="text-gray-400" />}
                            </button>
                            <div
                                className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${openItem === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <div className="px-6 pb-6 pt-0">
                                    <p className={`text-sm md:text-base leading-relaxed ${openItem === item.id ? "text-[#155e45]" : "text-gray-600"}`}>
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Code of Conduct */}
                <div className="mb-20">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.codeOfConduct.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{data.codeOfConduct.content}</p>
                </div>

                {/* Contact Queries */}
                <div className="mb-20">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">Contact for Queries</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.contacts.map((contact: any) => (
                            <div key={contact.id} className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                                    {getIcon(contact.icon)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{contact.label}</h4>
                                    <a href={`mailto:${contact.email}`} className="text-[#24C535] text-xs hover:underline mt-0.5 block">{contact.email}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-[#12221C] py-20 text-center relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">{data.cta.headline}</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">{data.cta.subheadline}</p>
                    <div className="flex justify-center gap-4">
                        {data.cta.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button
                                    className={btn.variant === "primary" ? "bg-[#24C535] hover:bg-green-600 text-white font-bold px-6 border-none" : "bg-transparent border border-gray-600 text-white hover:bg-white/5 px-6 font-bold"}
                                >
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
