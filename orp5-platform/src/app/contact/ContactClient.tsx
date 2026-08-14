"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Loader2, Mail, MapPin, Clock, Store, MonitorPlay, Handshake, Sparkles, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import Script from 'next/script';

export default function ContactClient() {
    const [data, setData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formError, setFormError] = useState("");

    // Form states
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [institution, setInstitution] = useState("");
    const [country, setCountry] = useState("");
    const [category, setCategory] = useState("General Inquiry");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");
        
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    institution,
                    country,
                    category,
                    message
                })
            });

            const result = await res.json();
            
            if (!res.ok) throw new Error(result.error || "Failed to submit");
            
            setIsSuccess(true);
            setFullName("");
            setEmail("");
            setInstitution("");
            setCountry("");
            setCategory("General Inquiry");
            setMessage("");
            
            setTimeout(() => setIsSuccess(false), 6000);
        } catch (err: any) {
            setFormError(err.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Script id="contact-schema" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "ORP-5 Conference",
                    "url": "https://www.orp5ic.com",
                    "logo": "https://www.orp5ic.com/icon.png",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "email": data.generalInquiries?.email,
                        "contactType": "customer service"
                    }
                })}
            </Script>
            <Navbar variant="default" />

            <PageHero
                headline={data.hero?.headline || "Get in Touch with Secretariat"}
                subheadline={data.hero?.subheadline || "Reach out to the ORP-5 organizing team for registration support, abstract queries, or partnership proposals."}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Contact Us"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-10 md:mt-12 pb-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 shadow-xl luxury-card text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                        <Sparkles size={13} className="text-rice-gold" />
                        Dedicated Support Desks
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">{data.intro?.title}</h2>
                    <p className="text-charcoal/75 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto font-light">{data.intro?.description}</p>
                </div>
            </div>

            {/* Specialized Departments Grid */}
            <section className="container mx-auto px-6 py-12 max-w-7xl">
                <SectionTitle
                    badge="Direct Channels"
                    title="Departmental Contact Desks"
                    subtitle="Connect directly with specialized coordinators for expedited resolution."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    {data.departments?.map((dept: any) => (
                        <div key={dept.id} className="bg-white p-8 rounded-3xl border border-earth-green/10 shadow-sm hover:shadow-xl transition-all luxury-card flex flex-col justify-between">
                            <div>
                                <h3 className="font-serif font-bold text-xl mb-3 text-charcoal">{dept.title}</h3>
                                <p className="text-xs sm:text-sm text-charcoal/70 mb-6 leading-relaxed font-light">{dept.description}</p>
                            </div>
                            
                            <div className="space-y-2 pt-4 border-t border-gray-100 mt-auto">
                                {dept.emails?.map((email: string, idx: number) => (
                                    <a key={idx} href={`mailto:${email}`} className="inline-flex items-center gap-2 text-earth-green font-semibold text-xs sm:text-sm hover:underline break-all">
                                        <Mail size={14} className="shrink-0" /> {email}
                                    </a>
                                ))}
                                {dept.note && <p className="mt-3 text-[10px] text-rice-gold-dark uppercase tracking-wider font-bold">{dept.note}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Contact Form */}
            <section className="py-16 bg-white border-y border-gray-200/60 my-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <SectionTitle
                        badge="Message Us"
                        title="Send an Official Inquiry"
                        subtitle="Fill out the form below. A member of the secretariat will reply within 24–48 hours."
                        centered
                    />

                    {formError && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-200 text-center">
                            {formError}
                        </div>
                    )}

                    <form className="space-y-6 mt-12" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Full Name *</label>
                                <input required value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Dr. Sarah Jenkins" className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Email Address *</label>
                                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="sarah.jenkins@university.org" className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Institution / Organization</label>
                                <input value={institution} onChange={e => setInstitution(e.target.value)} type="text" placeholder="National Agriscience Institute" className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Country</label>
                                <input value={country} onChange={e => setCountry(e.target.value)} type="text" placeholder="e.g. India, Japan, France" className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Query Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm appearance-none cursor-pointer">
                                <option>General Inquiry</option>
                                <option>Registration & Payment</option>
                                <option>Abstract & Paper Submission</option>
                                <option>Sponsorship & Exhibition</option>
                                <option>Visa Support & Accommodation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2">Message *</label>
                            <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Please provide details of your inquiry..." className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-charcoal focus:outline-none focus:border-earth-green transition-colors text-sm"></textarea>
                        </div>

                        {isSuccess && (
                            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-sm font-medium border border-emerald-200 flex items-center justify-center gap-2 text-center">
                                <CheckCircle2 size={18} className="text-earth-green" />
                                Thank you! Your message has been sent successfully. We will be in touch shortly.
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button 
                                type="submit"
                                variant="premium"
                                size="lg"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto text-xs uppercase tracking-wider font-bold min-w-[220px]"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 justify-center">
                                        Send Message <Send size={14} />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
