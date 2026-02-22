
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conference Venue | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { getVenuePageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { ArrowRight, MapPin, Plane, Train, Hotel } from "lucide-react";

import Link from "next/link";

export default async function VenuePage() {
    const data = await getVenuePageData();

    if (!data) return <div className="p-10 text-center">Loading Venue...</div>;

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={32} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Conference Venue"
            />

            {/* Introduction */}
            <section className="py-20 container mx-auto px-6 max-w-5xl">
                <div className="border-l-4 border-rice-gold pl-8 md:pl-12 py-2">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">
                        {data.intro.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-charcoal">Venue Highlights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.highlights.map((item: any) => (
                            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-[#FFFDF7] rounded-full flex items-center justify-center text-rice-gold mb-6 border border-rice-gold/20">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Spaces Grid */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Main Event Spaces</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.spaces.map((space: any) => (
                        <div key={space.id} className="group relative h-80 rounded-2xl overflow-hidden shadow-md bg-gray-200">
                            {space.imageUrl && <img src={space.imageUrl} alt={space.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{space.title}</h3>
                                <p className="text-white/80 text-sm">{space.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Location & Map */}
            <section id="location" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Map Placeholder */}
                    <div className="h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold border-2 border-gray-300 border-dashed">
                        <div className="text-center">
                            <MapPin size={40} className="mx-auto mb-2 text-gray-400" />
                            Map Placeholder
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Location & Address</h2>
                        <p className="font-bold text-charcoal mb-4">NASC Complex,</p>
                        <p className="text-gray-600 mb-8 leading-relaxed max-w-sm">
                            {data.location.address}
                        </p>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-earth-green" />
                                <span><strong>Coordinates:</strong> {data.location.coordinates}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Plane size={18} className="text-earth-green" />
                                <span><strong>Delhi Airport (DEL):</strong> {data.location.airportDist}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Train size={18} className="text-earth-green" />
                                <span><strong>Noida Metro Station:</strong> {data.location.metroDist}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Hotel size={18} className="text-earth-green" />
                                <span><strong>Key Hotels:</strong> {data.location.hotelsDist}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-20 bg-[#FFFDF7]">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-2xl font-bold text-charcoal mb-12">Facilities for Delegates</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6">
                        {data.facilities.map((fac: any) => (
                            <div key={fac.id} className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-earth-green mb-4 border border-gray-100">
                                    {getIcon(fac.iconName)}
                                </div>
                                <span className="text-gray-700 font-medium">{fac.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-earth-green text-center text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold mb-4">Plan your visit</h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-10">Explore accommodation options and travel details to make your conference experience seamless.</p>
                    <Link href="/accommodation"><button className="bg-rice-gold text-charcoal font-bold py-3 px-8 rounded-full hover:bg-yellow-500 transition-colors">Accommodation</button></Link>
                    <Link href="/how-to-reach"><button className="border border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors">How to Reach</button></Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
