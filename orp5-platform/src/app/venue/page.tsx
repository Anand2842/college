import { createPageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
    title: 'Conference Venue',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/venue',
});

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Button } from "@/components/atoms/Button";
import { getVenuePageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { ArrowRight, MapPin, Plane, Train, Hotel, Landmark, Camera, Church, TreeDeciduous, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";

export default async function VenuePage() {
    const data = await getVenuePageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={28} /> : null;
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Conference Venue"
            />

            {/* Introduction Section */}
            <section className="py-16 bg-[#FAF9F5] border-b border-earth-green/10">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-earth-green/10">
                            <Sparkles size={14} className="text-rice-gold-dark" />
                            Official Venue
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-6 leading-tight">
                            {data.intro.title || "National Agricultural Science Complex"}
                        </h2>
                        <p className="text-charcoal/70 leading-relaxed text-lg font-light max-w-3xl mx-auto">
                            {data.intro.description}
                        </p>
                    </div>

                    {/* Venue Image / Showcase */}
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-earth-green/10 h-[400px] w-full relative">
                        {data.spaces[0]?.imageUrl && (
                            <img 
                                src={data.spaces[0].imageUrl} 
                                alt="NASC Complex" 
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-serif text-2xl font-bold">{data.intro.title || "NASC Complex"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Address & Connectivity */}
            <section className="py-16 bg-white border-b border-earth-green/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                        <div className="flex flex-col justify-center">
                            <SectionTitle
                                badge="Location"
                                title="A.P. Shinde Symposium Hall"
                                subtitle="Strategically located in Central New Delhi with rapid access to transit corridors."
                                centered={false}
                            />
                            
                            <p className="text-charcoal/70 mb-8 font-light text-base leading-relaxed">
                                {data.location.address}
                            </p>

                            <div className="space-y-4 text-sm text-charcoal/80 mb-8">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                        <Plane size={18} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-charcoal mb-0.5">IGI Airport (DEL)</span>
                                        <span className="text-charcoal/60">{data.location.airportDist}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                        <Train size={18} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-charcoal mb-0.5">Nearest Metro Station</span>
                                        <span className="text-charcoal/60">{data.location.metroDist}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pb-2">
                                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                                        <Hotel size={18} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-charcoal mb-0.5">Hotels & Lodging</span>
                                        <span className="text-charcoal/60">{data.location.hotelsDist}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/how-to-reach">
                                    <Button variant="default" className="text-xs uppercase tracking-wider font-bold">
                                        Transit Guide
                                    </Button>
                                </Link>
                                <Link href="/accommodation">
                                    <Button variant="outline" className="text-xs uppercase tracking-wider font-bold">
                                        View Hotels
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="w-full min-h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-lg border border-earth-green/15 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5!2d77.5779!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdd240d7a2847%3A0x2e3e5e5e5e5e5e5e!2sNASC%20Complex%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="NASC Complex, New Delhi"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Grid */}
            <section className="py-16 bg-[#FAF9F5]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Amenities"
                        title="Venue Highlights"
                        subtitle="Purpose-built infrastructure designed to facilitate high-level academic discourse."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {data.highlights.map((item: any) => (
                            <div key={item.id} className="bg-white p-8 rounded-3xl border border-earth-green/10 shadow-sm flex flex-col items-start luxury-card">
                                <div className="w-12 h-12 bg-[#FAF9F5] border border-earth-green/10 rounded-2xl flex items-center justify-center text-earth-green mb-5">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="text-lg font-serif font-bold text-charcoal mb-2">{item.title}</h3>
                                <p className="text-charcoal/70 text-sm leading-relaxed font-light">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Spaces */}
            <section className="py-16 bg-white border-y border-earth-green/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Deliberative Halls"
                        title="Main Event Spaces"
                        subtitle="State-of-the-art auditoriums and poster exhibition concourses."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        {data.spaces.map((space: any) => (
                            <div key={space.id} className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-earth-green/10">
                                {space.imageUrl && (
                                    <img 
                                        src={space.imageUrl} 
                                        alt={space.title} 
                                        loading="lazy" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{space.title}</h3>
                                    <p className="text-white/80 text-sm font-light leading-relaxed">{space.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delegate Facilities */}
            <section className="py-16 bg-[#FAF9F5] text-center border-b border-earth-green/10">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionTitle
                        badge="Services"
                        title="Delegate Facilities"
                        subtitle="Comprehensive on-site provisions ensuring delegate comfort."
                        centered
                    />

                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        {data.facilities.map((fac: any) => (
                            <div key={fac.id} className="px-6 py-4 rounded-2xl bg-white border border-earth-green/10 shadow-sm flex items-center gap-3">
                                <div className="text-earth-green">
                                    {getIcon(fac.iconName)}
                                </div>
                                <span className="text-charcoal font-semibold text-sm">{fac.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Discover New Delhi */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Capital City"
                        title="Discover New Delhi"
                        subtitle="A majestic confluence of historic heritage and contemporary innovation."
                        centered
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {[
                            { icon: <Landmark size={22} />, title: "India Gate", description: "Iconic national monument and ceremonial boulevard." },
                            { icon: <Church size={22} />, title: "Qutub Minar", description: "UNESCO World Heritage Site with 12th-century architecture." },
                            { icon: <Camera size={22} />, title: "Red Fort", description: "Mughal citadel symbolizing India's rich sovereign history." },
                            { icon: <TreeDeciduous size={22} />, title: "Lodhi Gardens", description: "Serene landscaped botanical gardens and historic tombs." },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#FAF9F5] rounded-3xl p-6 border border-earth-green/10 flex flex-col luxury-card">
                                <div className="w-10 h-10 bg-white shadow-sm border border-earth-green/5 rounded-xl flex items-center justify-center text-earth-green mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-serif font-bold text-charcoal text-lg mb-2">{item.title}</h3>
                                <p className="text-charcoal/70 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
