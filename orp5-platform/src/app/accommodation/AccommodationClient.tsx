"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Star, Clock, Bus, Mail, Wifi, Utensils, Plane, Dumbbell, Waves, Briefcase, Bed, Building } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion } from "framer-motion";

export default function AccommodationClient() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/content/accommodation")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getAmenityIcon = (name: string) => {
        if (name.includes("Wi-Fi")) return <Wifi size={14} className="mr-1" />;
        if (name.includes("Breakfast")) return <Utensils size={14} className="mr-1" />;
        if (name.includes("Airport")) return <Plane size={14} className="mr-1" />;
        if (name.includes("Shuttle")) return <Bus size={14} className="mr-1" />;
        if (name.includes("Gym")) return <Dumbbell size={14} className="mr-1" />;
        if (name.includes("Swimming")) return <Waves size={14} className="mr-1" />;
        return <Star size={14} className="mr-1" />;
    };

    const getTypeIcon = (name: string) => {
        if (name === "Briefcase") return <Briefcase size={32} />;
        if (name === "Bed") return <Bed size={32} />;
        if (name === "Building") return <Building size={32} />;
        return <Star size={32} />;
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <main className="min-h-screen bg-[#F9F7F0] font-sans text-charcoal overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-[#0D241B] min-h-[60vh] flex items-center justify-center relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0 bg-[#0D241B]">
                    {data.hero.backgroundImage && <img src={data.hero.backgroundImage} alt="Hotel" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D241B] via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight leading-tight"
                    >
                        {data.hero.headline}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        {data.hero.subheadline}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {data.hero.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button className={btn.variant === "primary" ? "bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full" : "bg-white text-charcoal hover:bg-gray-100 font-bold px-8 py-3 rounded-full"}>
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Info Bar */}
            <div className="bg-[#EFECE5] border-b border-gray-200 py-4 text-xs md:text-sm font-medium text-gray-700">
                <div className="container mx-auto px-6 flex flex-wrap justify-center gap-6 md:gap-12 text-center">
                    <span className="flex items-center gap-2"><Clock size={16} className="text-earth-green" /> {data.infoBar.checkInOut}</span>
                    <span className="flex items-center gap-2"><Bus size={16} className="text-earth-green" /> {data.infoBar.shuttle}</span>
                    <span className="flex items-center gap-2"><Mail size={16} className="text-earth-green" /> {data.infoBar.contact}</span>
                </div>
            </div>

            {/* Official Partner Hotels */}
            <div id="official-hotels" className="container mx-auto px-6 py-20">
                <div className="text-left mb-12">
                    <h2 className="text-3xl font-serif font-bold text-charcoal">Official Partner Hotels</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.officialHotels.map((hotel: any, i: number) => (
                        <motion.div
                            key={hotel.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col"
                        >
                            <div className="h-56 overflow-hidden relative bg-gray-200">
                                {hotel.image && <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                <div className="absolute top-4 left-4 bg-[#D9A648] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-md">
                                    Official Partner
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-charcoal">{hotel.name}</h3>
                                    <div className="text-xs text-gray-500 text-right">
                                        {hotel.distance}
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={14} className="fill-[#D9A648] text-[#D9A648]" />)}
                                </div>
                                <div className="mb-4">
                                    <span className="text-xl font-bold text-[#10B981]">{hotel.priceRange}</span>
                                    <span className="text-xs text-gray-500"> {hotel.priceUnit}</span>
                                </div>

                                <div className="mb-6 space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amenities:</p>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-1">
                                        {hotel.amenities.map((am: string, idx: number) => (
                                            <div key={idx} className="flex items-center text-xs text-gray-600">
                                                {getAmenityIcon(am)} {am}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Link href={hotel.bookingLink} className="block w-full">
                                        <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-2 rounded-lg mb-2">
                                            Book at Conference Rate
                                        </Button>
                                    </Link>
                                    <p className="text-center text-[10px] text-gray-500">Use code: <span className="font-bold font-mono text-gray-800 bg-gray-100 px-1 rounded">{hotel.promoCode}</span></p>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Nearby Recommended Hotels & Map */}
            <div className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Nearby Recommended Hotels</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
                        {/* Nearby List */}
                        {data.nearbyHotels.map((hotel: any, i: number) => (
                            <motion.div
                                key={hotel.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-xl flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4">{hotel.distance}</p>
                                    <p className="font-bold text-[#10B981] mb-4">{hotel.price}</p>
                                </div>
                                <Button variant="outline" className="w-full text-xs font-bold border-gray-200 bg-emerald-50 hover:bg-emerald-100 text-[#065F46] border-0">
                                    Check Availability
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Accommodation Types */}
            <div className="bg-[#EFEEE9] py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Accommodation Types</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.types.map((type: any, i: number) => (
                            <div key={type.id} className="p-4">
                                <div className="bg-[#DFC074]/20 w-16 h-16 rounded-2xl flex items-center justify-center text-[#8C6B1F] mb-6">
                                    {getTypeIcon(type.icon)}
                                </div>
                                <h3 className="font-bold text-xl text-charcoal mb-4">{type.title}</h3>
                                <ul className="space-y-2">
                                    {type.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-charcoal/50 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#0A221C] py-20 text-center text-white m-6 rounded-3xl mx-auto max-w-6xl relative overflow-hidden">
                <div className="relative z-10 px-6">
                    <h2 className="text-3xl font-serif font-bold mb-4">{data.footerCta.headline}</h2>
                    <p className="text-emerald-100/70 mb-10 max-w-xl mx-auto">{data.footerCta.subheadline}</p>
                    <Link href={data.footerCta.buttonLink}>
                        <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full">
                            {data.footerCta.buttonLabel}
                        </Button>
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
