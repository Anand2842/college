"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Building, GraduationCap, ShieldCheck, MapPin, Sun, Wifi, Plane, Train, Car, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion } from "framer-motion";

export default function CityClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/city")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Building": return <Building size={28} />;
            case "GraduationCap": return <GraduationCap size={28} />;
            case "ShieldCheck": return <ShieldCheck size={28} />;
            case "Plane": return <Plane size={22} />;
            case "Train": return <Train size={22} />;
            case "Car": return <Car size={22} />;
            default: return <MapPin size={28} />;
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
            <Navbar />

            <PageHero
                headline={data.hero?.headline || "Experience New Delhi"}
                subheadline={data.hero?.subheadline || "India's Historic Capital & Center for Global Agriscience"}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / About the City"
            />

            {/* Host City Overview (Asymmetric) */}
            <section className="py-20 bg-white border-b border-earth-green/10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-earth-green/10 w-fit">
                                <Sparkles size={14} className="text-rice-gold-dark" />
                                Host City Overview
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-6 leading-tight">
                                {data.intro?.title}
                            </h2>
                            <p className="text-charcoal/70 leading-relaxed text-lg font-light mb-8">
                                {data.intro?.description}
                            </p>
                            <div className="flex gap-4">
                                <Link href="/how-to-reach">
                                    <Button variant="outline" className="text-xs uppercase tracking-wider font-bold">
                                        Travel Guide
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-7 relative">
                            {/* Abstract decorative shapes */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-rice-gold/10 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-earth-green/5 rounded-full blur-[80px]" />
                            
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="space-y-4 pt-12">
                                    <div className="h-64 rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl border border-earth-green/10">
                                        <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600" alt="India Gate" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="h-48 rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl border border-earth-green/10">
                                        <img src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=600" alt="Indian Culture" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-48 rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl border border-earth-green/10">
                                        <img src="https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&q=80&w=600" alt="Delhi Heritage" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="h-64 rounded-[2rem] overflow-hidden shadow-xl border border-earth-green/10 bg-earth-green-deep p-8 flex flex-col justify-end text-white">
                                        <MapPin className="text-rice-gold mb-4" size={32} />
                                        <h3 className="font-serif text-2xl font-bold mb-2">National Capital Region</h3>
                                        <p className="text-white/70 text-sm font-light">The epicenter of India's agricultural policy and research infrastructure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Highlights Bento */}
            <section className="py-24 bg-[#FAF9F5]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="Capital Highlights"
                        title="City Highlights"
                        subtitle="A global diplomatic metropolis celebrated for academic prestige and historic monuments."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
                        {data.highlights?.map((item: any, i: number) => (
                            <div
                                key={i}
                                className="group bg-white p-10 rounded-[2.5rem] border border-earth-green/10 hover:border-earth-green/30 transition-all duration-300 luxury-card relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center text-center"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-transparent to-earth-green/5 transition-opacity duration-300" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-[#FAF9F5] text-earth-green rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-earth-green/5 group-hover:bg-earth-green group-hover:text-rice-gold transition-colors duration-300 mx-auto">
                                        {getIcon(item.iconName)}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-4 group-hover:text-earth-green transition-colors">{item.title}</h3>
                                    <p className="text-charcoal/60 text-base leading-relaxed font-light">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dark Theme Travel Conditions */}
            {data.about && (
                <section className="py-24 bg-earth-green-deep relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rice-gold/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sapling-green/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-16">
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-4">
                                Climate & Access
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                Travel Conditions in September
                            </h2>
                            <p className="text-white/70 text-lg font-light max-w-2xl mx-auto">
                                Autumn weather in New Delhi offers pleasant temperatures and clear skies, making it an ideal time for academic travel.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl luxury-card group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-6 text-rice-gold">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="uppercase tracking-wider text-sm font-bold text-white">Strategic Location</h3>
                                </div>
                                <p className="text-white/70 leading-relaxed text-base font-light">{data.about.location}</p>
                            </div>
                            <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl luxury-card group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-6 text-rice-gold">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Sun size={24} />
                                    </div>
                                    <h3 className="uppercase tracking-wider text-sm font-bold text-white">September Weather</h3>
                                </div>
                                <p className="text-white/70 leading-relaxed text-base font-light">{data.about.weather}</p>
                            </div>
                            <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl luxury-card group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-6 text-rice-gold">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Wifi size={24} />
                                    </div>
                                    <h3 className="uppercase tracking-wider text-sm font-bold text-white">Connectivity</h3>
                                </div>
                                <p className="text-white/70 leading-relaxed text-base font-light">{data.about.connectivity}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Edge-to-Edge Immersive Attractions */}
            {data.nearbyPlaces && data.nearbyPlaces.length > 0 && (
                <section className="bg-white py-24">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <SectionTitle
                            badge="Excursions"
                            title="Must-Visit Attractions"
                            subtitle="Explore architectural marvels, heritage trails, and botanical landmarks in New Delhi."
                            centered
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
                            {data.nearbyPlaces.map((place: any, i: number) => (
                                <div
                                    key={i}
                                    className={`group relative rounded-[2.5rem] overflow-hidden shadow-xl border border-earth-green/10 bg-charcoal luxury-card ${i === 0 ? 'md:col-span-2 h-[450px]' : 'h-[350px]'}`}
                                >
                                    {place.imageUrl && (
                                        <img 
                                            src={place.imageUrl} 
                                            alt={place.title} 
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10">
                                        <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-3 drop-shadow-lg">{place.title}</h3>
                                        <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light max-w-2xl drop-shadow">{place.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Join Us In New Delhi
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            {data.footerCta?.headline || "Ready to Register for ORP-5?"}
                        </h3>
                        <p className="text-white/70 text-sm">
                            {data.footerCta?.subheadline || "Experience 5 days of transformative discussions, cultural galas, and agricultural exhibitions in New Delhi."}
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center relative z-10 shrink-0">
                        <Link href="/registration">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Register Now <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
