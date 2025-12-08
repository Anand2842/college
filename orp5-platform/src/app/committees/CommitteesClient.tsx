"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Mail, Loader2, Hourglass } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function CommitteesClient() {
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        fetch("/api/content/committees")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                if (jsonData.committees && jsonData.committees.length > 0) {
                    setActiveTab(jsonData.committees[0].label);
                }
            });
    }, []);

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    const currentCommittee = data.committees.find((c: any) => c.label === activeTab);

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-charcoal text-white">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-earth-green/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-rice-gold/10 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6 text-center relative z-10">

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        {data.hero.headline}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {data.hero.subheadline}
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className="py-16 container mx-auto px-6 max-w-5xl">
                <div className="border-l-4 border-rice-gold pl-6 py-2">
                    <h2 className="text-2xl font-serif font-bold text-earth-green mb-4">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* Tabs & Grid */}
            <section className="pb-20 container mx-auto px-6 max-w-6xl">
                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-gray-200 w-full text-center">
                    {data.committees.map((c: any) => (
                        <button
                            key={c.id}
                            onClick={() => setActiveTab(c.label)}
                            className={`pb-4 px-4 text-sm md:text-base font-bold transition-all relative ${activeTab === c.label
                                ? "text-earth-green"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {c.label}
                            {activeTab === c.label && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-earth-green rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Members Grid */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {currentCommittee?.members && currentCommittee.members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentCommittee.members.map((member: any) => (
                                <div key={member.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-28 h-28 rounded-full p-1 border-2 border-rice-gold mb-6 overflow-hidden relative bg-gray-100">
                                        {member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>}
                                    </div>
                                    <h3 className="font-bold text-xl text-charcoal mb-1">{member.name}</h3>
                                    <p className="text-gray-500 text-sm mb-1">{member.affiliation}</p>
                                    <p className="text-earth-green font-bold text-xs uppercase tracking-wide">{member.country}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-rice-gold/40 bg-rice-gold/5 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                            <Hourglass className="text-rice-gold mb-4" size={40} />
                            <h3 className="text-xl font-bold text-rice-gold/80 mb-2">To be announced shortly</h3>
                            <p className="text-gray-500 text-sm">The International Organizing Committee members will be listed here soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Advisory Board */}
            <section className="py-20 bg-[#FFFDF7] container mx-auto px-6 max-w-5xl">
                <div className="bg-[#FDF9F0] border border-[#F2E8D0] p-10 rounded-2xl">
                    <h2 className="text-2xl font-serif font-bold text-earth-green mb-4">{data.advisory.title}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {data.advisory.description}
                    </p>
                </div>
            </section>

            {/* Contacts */}
            <section className="py-20 container mx-auto px-6 max-w-5xl text-center">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Committee Contacts</h2>
                <p className="text-gray-500 mb-12">For inquiries, please reach out to the relevant contacts below.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.contacts.map((contact: any) => (
                        <div key={contact.id} className="bg-white p-6 rounded-xl border border-gray-200 md:hover:border-earth-green transition-colors flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden border border-gray-100">
                                {contact.imageUrl ? (
                                    <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                                )}
                            </div>
                            <h4 className="font-bold text-charcoal mb-2">{contact.name}</h4>
                            <a href={`mailto:${contact.email}`} className="text-sm text-gray-500 hover:text-earth-green flex items-center justify-center gap-2">
                                <Mail size={14} /> {contact.email}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-earth-green py-20 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-white mb-8">Explore Themes, Programme & Registration for ORP-5.</h2>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href="/themes">
                            <Button className="bg-rice-gold text-charcoal font-bold hover:bg-yellow-500">View Themes</Button>
                        </Link>
                        <Link href="/programme">
                            <Button variant="secondary" className="bg-[#B0A380] text-charcoal font-bold">See Programme</Button>
                        </Link>
                        <Link href="/registration">
                            <Button className="bg-white text-earth-green font-bold hover:bg-gray-100">Register Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
