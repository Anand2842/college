"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Mail, MapPin, Clock, Store, MonitorPlay, Handshake } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
// import { motion } from "framer-motion"; // Optional animations
import { cn } from "@/lib/utils";

export default function ContactClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/contact")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Store": return <Store size={18} />;
            case "MonitorPlay": return <MonitorPlay size={18} />;
            case "Handshake": return <Handshake size={18} />;
            default: return <Mail size={18} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal overflow-x-hidden">
            <Navbar variant="dark" />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Contact Us"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 mb-16 max-w-4xl">
                <div className="bg-[#FFF8F0] rounded-xl p-8 border-l-4 border-[#D9A648]">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-3">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{data.intro.description}</p>
                </div>
            </div>

            {/* Departments Grid */}
            <div className="container mx-auto px-6 mb-16 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.departments.map((dept: any, i: number) => (
                        <div key={dept.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-xl mb-3 text-charcoal">{dept.title}</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed min-h-[40px]">{dept.description}</p>
                            <div className="space-y-2">
                                {dept.emails.map((email: string, idx: number) => (
                                    <a key={idx} href={`mailto:${email}`} className="flex items-center gap-2 text-[#10B981] font-medium text-sm hover:underline">
                                        <Mail size={14} /> {email}
                                    </a>
                                ))}
                            </div>
                            {dept.note && <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-wider font-bold">{dept.note}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Contacts Row */}
            <div className="container mx-auto px-6 mb-24 max-w-6xl">
                <div className="bg-[#FFFDF7] border border-[#F3F0E5] rounded-2xl p-8 flex flex-wrap justify-between gap-8">
                    {data.additionalContacts.map((contact: any) => (
                        <div key={contact.id} className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-3 mb-2 text-[#D9A648]">
                                {getIcon(contact.icon)}
                                <h4 className="font-bold text-charcoal text-sm">{contact.title}</h4>
                            </div>
                            <a href={`mailto:${contact.email}`} className="text-sm text-[#10B981] hover:underline pl-8 block">
                                {contact.email}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Organizing Committee */}
            <div className="container mx-auto px-6 mb-24 max-w-5xl">
                <div className="bg-[#0D241B] rounded-2xl p-10 text-white">
                    <h2 className="text-2xl font-serif font-bold mb-8 border-b border-emerald-800 pb-4">Organizing Committee</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.committee.map((member: any) => (
                            <div key={member.id}>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-emerald-400/80 text-xs uppercase tracking-wider mb-2">{member.role}</p>
                                <a href={`mailto:${member.email}`} className="text-emerald-300 hover:text-white text-sm transition-colors">
                                    {member.email}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="container mx-auto px-6 mb-24 max-w-3xl text-center">
                <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Send us a Message</h2>
                <p className="text-gray-500 mb-10">We will get back to you as soon as possible.</p>

                <form className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                            <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981]" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                            <input type="email" placeholder="john.doe@example.com" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institution / Organization</label>
                            <input type="text" placeholder="University of Agriculture" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981]" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country</label>
                            <input type="text" placeholder="e.g. India" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Query Category</label>
                        <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981] appearance-none">
                            <option>General Inquiry</option>
                            <option>Registration Issue</option>
                            <option>Abstract Submission</option>
                            <option>Sponsorship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                        <textarea rows={5} placeholder="Please type your question here..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-[#10B981]"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full">
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>

            {/* Logistics */}
            <div className="container mx-auto px-6 mb-24 max-w-5xl">
                <div className="bg-[#FFFDF7] rounded-3xl p-10 border border-[#F3F0E5] grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-[#D9A648]">
                            <MapPin size={24} />
                            <h3 className="font-bold text-charcoal text-lg">{data.venueInfo.title}</h3>
                        </div>
                        <div className="pl-9 text-gray-600 space-y-1 mb-4">
                            {data.venueInfo.address.map((line: string, i: number) => <p key={i}>{line}</p>)}
                        </div>
                        <p className="pl-9 text-xs text-gray-400 max-w-xs">{data.venueInfo.note}</p>
                    </div>

                    <div className="md:border-l md:border-[#F3F0E5] md:pl-12">
                        <div className="flex items-center gap-3 mb-4 text-[#D9A648]">
                            <Clock size={24} />
                            <h3 className="font-bold text-charcoal text-lg">{data.operatingHours.title}</h3>
                        </div>
                        <p className="pl-9 text-gray-600 mb-4">{data.operatingHours.hours}</p>
                        <p className="pl-9 text-xs text-gray-400 max-w-xs">{data.operatingHours.note}</p>
                    </div>
                </div>
            </div>

            {/* Helpful Links */}
            <div className="container mx-auto px-6 mb-24 text-center">
                <h3 className="text-lg font-serif font-bold text-charcoal mb-6">Helpful Links</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/registration"><span className="px-6 py-2 bg-[#E0F2F1] text-[#00695C] rounded-full text-sm font-bold hover:bg-[#B2DFDB] transition-colors">Registration</span></Link>
                    <Link href="/accommodation"><span className="px-6 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-sm font-bold hover:bg-[#C8E6C9] transition-colors">Accommodation</span></Link>
                    <Link href="/programme"><span className="px-6 py-2 bg-[#E0F7FA] text-[#006064] rounded-full text-sm font-bold hover:bg-[#B2EBF2] transition-colors">Programme</span></Link>
                    <Link href="/submission"><span className="px-6 py-2 bg-[#E3F2FD] text-[#1565C0] rounded-full text-sm font-bold hover:bg-[#BBDEFB] transition-colors">Abstract Submission</span></Link>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#0D241B] py-20 text-center text-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">{data.footerCta.headline}</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.footerCta.buttons.map((btn: any, i: number) => {
                            const isPrimary = btn.variant === "primary";
                            return (
                                <Link key={i} href={btn.link}>
                                    <Button className={cn(
                                        "px-8 py-3 rounded-full font-bold transition-colors",
                                        isPrimary ? "bg-[#10B981] hover:bg-[#059669] text-white" : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                                    )}>
                                        {btn.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
