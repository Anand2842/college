"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Building, GraduationCap, ShieldCheck, MapPin, Sun, Wifi, Plane, Train, Car } from "lucide-react";
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
            case "Building": return <Building size={32} />;
            case "GraduationCap": return <GraduationCap size={32} />;
            case "ShieldCheck": return <ShieldCheck size={32} />;
            case "Plane": return <Plane size={24} />;
            case "Train": return <Train size={24} />;
            case "Car": return <Car size={24} />;
            default: return <MapPin size={32} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

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
            <div className="bg-[#0A1F18] min-h-[60vh] flex items-center justify-center text-center text-white relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0 bg-[#0A1F18]">
                    {data.hero.backgroundImage && <img src={data.hero.backgroundImage} alt="New Delhi" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F18] via-transparent to-transparent"></div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="container mx-auto px-6 relative z-10 max-w-4xl"
                >
                    <motion.div variants={fadeInUp} className="text-earth-green/60 text-sm font-semibold mb-6 uppercase tracking-widest">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link> / About the City
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-tight">
                        {data.hero.headline}
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
                        {data.hero.subheadline}
                    </motion.p>
                </motion.div>
            </div>

            {/* Intro Card */}
            <div className="container mx-auto px-6 -mt-20 relative z-20 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-xl p-8 md:p-12 border-l-8 border-[#DFC074] max-w-5xl mx-auto"
                >
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">{data.intro.description}</p>
                </motion.div>
            </div>

            {/* Highlights */}
            <div className="bg-[#FBF9F4] py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal">City Highlights</h2>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {data.highlights.map((item: any, i: number) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="w-14 h-14 bg-emerald-50 text-earth-green rounded-full flex items-center justify-center mb-6">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* About Grid (Location, Weather, Connectivity) */}
            <div className="container mx-auto px-6 py-24 max-w-6xl">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">About New Delhi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-earth-green font-bold">
                                <MapPin size={20} />
                                <h3 className="uppercase tracking-wider text-sm">Strategic Location</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">{data.about.location}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-earth-green font-bold">
                                <Sun size={20} />
                                <h3 className="uppercase tracking-wider text-sm">Weather in September</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">{data.about.weather}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-earth-green font-bold">
                                <Wifi size={20} />
                                <h3 className="uppercase tracking-wider text-sm">Easy Connectivity</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">{data.about.connectivity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-gray-50 py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Must-Visit Nearby Places</h2>
                        <p className="text-gray-500">Explore the rich heritage and modern attractions of the NCR region.</p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {data.nearbyPlaces.map((place: any, i: number) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
                            >
                                <div className="h-56 overflow-hidden bg-gray-200">
                                    {place.imageUrl && <img src={place.imageUrl} alt={place.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                </div>
                                <div className="p-8">
                                    <h3 className="font-bold text-lg mb-2 text-charcoal">{place.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{place.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* City Map & Travel Info */}
            <div className="container mx-auto px-6 py-24 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal">City Map & Travel Info</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Travel Times Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 h-fit">
                        <h3 className="font-bold text-xl mb-6">Approx. Travel Times</h3>
                        <div className="space-y-6">
                            {data.travelInfo.times.map((item: any, i: number) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-earth-green flex items-center justify-center shrink-0">
                                        {getIcon(item.icon)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-charcoal text-sm">{item.label}</p>
                                        <p className="text-gray-500 text-xs">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Image */}
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden shadow-md relative min-h-[400px]">
                        {data.travelInfo.mapImage && <img src={data.travelInfo.mapImage} alt="City Map" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <p className="text-white font-bold bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">Interactive Map Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#0A1F18] py-20 text-center text-white relative overflow-hidden border-t-4 border-[#DFC074]">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <h2 className="text-3xl font-bold mb-4 leading-snug">{data.footerCta.headline}</h2>
                    <p className="text-emerald-200 mb-12">{data.footerCta.subheadline}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {data.footerCta.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button className={btn.variant === "primary" ? "bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full" : "bg-transparent text-white border border-gray-500 hover:bg-white/10 font-bold px-8 py-3 rounded-full"}>
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
