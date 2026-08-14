"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Star, Clock, Bus, Mail, Phone, Wifi, Utensils, Plane, Dumbbell, Waves, Briefcase, Bed, Building, ChevronDown, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

export default function AccommodationClient() {
    const [data, setData] = useState<any>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/content/accommodation")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const getAmenityIcon = (name: string) => {
        switch (name) {
            case "Wifi": return <Wifi size={14} className="text-earth-green" />;
            case "Utensils": return <Utensils size={14} className="text-earth-green" />;
            case "Plane": return <Plane size={14} className="text-earth-green" />;
            case "Bus": return <Bus size={14} className="text-earth-green" />;
            case "Dumbbell": return <Dumbbell size={14} className="text-earth-green" />;
            case "Waves": return <Waves size={14} className="text-earth-green" />;
            case "Briefcase": return <Briefcase size={14} className="text-earth-green" />;
            case "Bed": return <Bed size={14} className="text-earth-green" />;
            default: return <Building size={14} className="text-earth-green" />;
        }
    };

    const getTypeIcon = (name: string) => {
        if (name === "Briefcase") return <Briefcase size={28} />;
        if (name === "Bed") return <Bed size={28} />;
        if (name === "Building") return <Building size={28} />;
        return <Star size={28} />;
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
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Accommodation"
                buttons={data.hero.buttons}
            />

            {/* Convenient Hotels */}
            <section id="official-hotels" className="container mx-auto px-6 py-16 max-w-7xl">
                <SectionTitle
                    badge="Preferred Lodging"
                    title="Convenient Partner Hotels"
                    subtitle="Curated hotels offering special delegate rates and dedicated conference shuttle transfers."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {data.officialHotels.map((hotel: any, i: number) => (
                        <div
                            key={hotel.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-earth-green/10 flex flex-col luxury-card"
                        >
                            <div className="h-60 overflow-hidden relative bg-gray-200">
                                {hotel.image && (
                                    <img 
                                        src={hotel.image} 
                                        alt={hotel.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                )}
                                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-earth-green shadow-sm flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>{hotel.distance}</span>
                                </div>
                            </div>
                            
                            <div className="p-7 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(hotel.stars || 4)].map((_, idx) => (
                                            <Star key={idx} size={14} className="fill-rice-gold text-rice-gold" />
                                        ))}
                                    </div>

                                    <h3 className="font-serif font-bold text-xl text-charcoal mb-2">{hotel.name}</h3>
                                    
                                    <div className="mb-4">
                                        <span className="text-2xl font-serif font-bold gradient-text-earth">{hotel.priceRange}</span>
                                        <span className="text-xs text-charcoal/60 font-medium"> {hotel.priceUnit}</span>
                                    </div>

                                    <div className="mb-6 pt-4 border-t border-gray-100">
                                        <p className="text-[11px] font-bold text-rice-gold-dark uppercase tracking-wider mb-2">Key Amenities</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/70">
                                            {hotel.amenities?.map((am: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-1.5">
                                                    {getAmenityIcon(am)}
                                                    <span>{am}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-auto">
                                    {hotel.contactDetails ? (
                                        <div>
                                            <button
                                                onClick={() => setOpenAccordion(openAccordion === hotel.id ? null : hotel.id)}
                                                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-earth-green hover:text-rice-gold-dark transition-colors py-2 cursor-pointer"
                                            >
                                                <span>Contact Booking Desk</span>
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform duration-200 ${openAccordion === hotel.id ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {openAccordion === hotel.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-3 pb-1 flex flex-col gap-2 text-xs text-charcoal/80 bg-[#FAF9F5] p-3 rounded-xl border border-gray-100 mt-2">
                                                            {hotel.contactDetails.name && (
                                                                <p className="font-bold text-charcoal">{hotel.contactDetails.name}</p>
                                                            )}
                                                            {hotel.contactDetails.phone && (
                                                                <a
                                                                    href={`tel:${hotel.contactDetails.phone.split('/')[0].trim()}`}
                                                                    className="flex items-center gap-2 text-earth-green hover:underline"
                                                                >
                                                                    <Phone size={12} /> {hotel.contactDetails.phone}
                                                                </a>
                                                            )}
                                                            {hotel.contactDetails.email && (
                                                                <a
                                                                    href={`mailto:${hotel.contactDetails.email}`}
                                                                    className="flex items-center gap-2 text-earth-green hover:underline break-all"
                                                                >
                                                                    <Mail size={12} /> {hotel.contactDetails.email}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <>
                                            {hotel.bookingLink && !hotel.bookingLink.startsWith('#') && (
                                                <Link href={hotel.bookingLink} className="block w-full">
                                                    <Button variant="default" className="w-full text-xs uppercase tracking-wider font-bold mb-2">
                                                        Check Availability <ExternalLink size={13} className="ml-1.5" />
                                                    </Button>
                                                </Link>
                                            )}
                                            {hotel.promoCode && (
                                                <p className="text-center text-[11px] text-charcoal/60 mt-1">
                                                    Discount Code: <span className="font-mono font-bold text-earth-green bg-earth-green/5 px-2 py-0.5 rounded border border-earth-green/15">{hotel.promoCode}</span>
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Nearby Recommended Hotels */}
            {data.nearbyHotels && data.nearbyHotels.length > 0 && (
                <section className="bg-white py-16 border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <SectionTitle
                            badge="Additional Options"
                            title="Nearby Recommended Hotels"
                            subtitle="Alternate comfortable lodging options within 5–10 km radius of the NASC Complex."
                            centered
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                            {data.nearbyHotels.map((hotel: any) => (
                                <div
                                    key={hotel.id}
                                    className="bg-[#FAF9F5] border border-earth-green/10 p-7 rounded-3xl flex flex-col justify-between luxury-card"
                                >
                                    <div>
                                        <h3 className="font-serif font-bold text-lg text-charcoal mb-1">{hotel.name}</h3>
                                        <p className="text-xs text-charcoal/60 mb-3">{hotel.distance}</p>
                                        <p className="text-xl font-serif font-bold gradient-text-earth mb-4">{hotel.price}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-wider">
                                        Check Rates
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Accommodation Types */}
            {data.types && (
                <section className="bg-[#FAF9F5] py-16 border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <SectionTitle
                            badge="Categories"
                            title="Accommodation Categories"
                            subtitle="Options spanning luxury 5-star delegates hotels, standard business hotels, and academic guest houses."
                            centered
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                            {data.types.map((type: any) => (
                                <div key={type.id} className="bg-white rounded-3xl p-8 border border-earth-green/10 luxury-card">
                                    <div className="w-14 h-14 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center mb-6">
                                        {getTypeIcon(type.icon)}
                                    </div>
                                    <h3 className="font-serif font-bold text-xl text-charcoal mb-4">{type.title}</h3>
                                    <ul className="space-y-2.5">
                                        {type.features.map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-xs text-charcoal/70">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rice-gold shrink-0 mt-1.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
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
                            Need Assistance?
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            {data.footerCta?.headline || "Hospitality & Accommodation Desk"}
                        </h3>
                        <p className="text-white/70 text-sm">
                            {data.footerCta?.subheadline || "Contact our organizing hospitality team for group bookings, visa support, and student hostel allotments."}
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link href={data.footerCta?.buttonLink || "/contact"}>
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                {data.footerCta?.buttonLabel || "Contact Team"} <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
