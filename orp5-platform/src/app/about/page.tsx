import { createPageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';


export const metadata = createPageMetadata({
    title: 'About',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/about',
});

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { getAboutPageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { CheckCircle2, Wheat, Thermometer, Leaf, Users, GraduationCap, UserCheck, Sprout, BookOpen, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default async function AboutPage() {
    const data = await getAboutPageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

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
                breadcrumb="Home / About"
            />

            {/* Intro & At A Glance */}
            <section className="py-20 container mx-auto px-6 max-w-6xl">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-8">{data.intro.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                            {data.intro.description}
                        </p>
                    </div>
                    <div className="bg-[#FFFDF7] border border-rice-gold rounded-xl p-6 shadow-sm relative">
                        <div className="absolute -top-3 left-6 px-3 bg-[#FFFDF7] text-rice-gold font-bold text-sm">At a Glance</div>
                        <ul className="space-y-3 mt-2">
                            {data.intro.atAGlance.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-earth-green text-sm font-medium">
                                    <span className="w-1.5 h-1.5 bg-earth-green rounded-full"></span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why It Matters */}
            <section className="py-20 bg-[#FFFDF7]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Why It Matters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.whyMatters.map((item: any) => (
                            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 text-rice-gold mb-6">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="font-bold text-lg text-charcoal mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="py-20 container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Conference Objectives</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {data.objectives.map((obj: string, i: number) => (
                        <div key={i} className="flex items-start gap-4">
                            <CheckCircle2 size={24} className="text-rice-gold shrink-0 mt-0.5" />
                            <p className="text-gray-700">{obj}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Significance of ORP-5 */}
            <section className="py-20 bg-[#123125] text-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-4">Significance of ORP-5</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">Addressing critical global challenges through organic and natural rice production systems.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Wheat size={32} />,
                                title: "Food Security",
                                description: "Promoting sustainable rice production to meet the growing global food demand while maintaining nutritional quality and biodiversity.",
                                sdg: "SDG 2",
                                sdgLabel: "Zero Hunger",
                            },
                            {
                                icon: <Thermometer size={32} />,
                                title: "Climate Action",
                                description: "Reducing carbon footprint of rice cultivation through organic practices, methane emission reduction, and climate-resilient farming methods.",
                                sdg: "SDG 13",
                                sdgLabel: "Climate Action",
                            },
                            {
                                icon: <Leaf size={32} />,
                                title: "Environmental Sustainability",
                                description: "Protecting ecosystems through organic farming practices that conserve water, improve soil health, and eliminate chemical pollution.",
                                sdg: "SDG 15",
                                sdgLabel: "Life on Land",
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-14 h-14 bg-[#DFC074]/20 rounded-xl flex items-center justify-center text-[#DFC074] mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-6">{item.description}</p>
                                <div className="inline-flex items-center gap-2 bg-[#DFC074]/10 text-[#DFC074] px-3 py-1.5 rounded-full text-xs font-bold">
                                    <span>{item.sdg}</span>
                                    <span className="w-px h-3 bg-white/20"></span>
                                    <span className="font-normal">{item.sdgLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Participate */}
            <section className="py-20 container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Who Can Participate</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">ORP-5 welcomes diverse stakeholders from across the agricultural and scientific communities.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Sprout size={28} />, title: "Scientists", description: "Researchers in organic agriculture, agronomy, plant science, and sustainable farming." },
                        { icon: <GraduationCap size={28} />, title: "Academicians", description: "Faculty and educators from agricultural universities and research institutions." },
                        { icon: <BookOpen size={28} />, title: "Students", description: "Postgraduate and doctoral students in agricultural and environmental sciences." },
                        { icon: <Users size={28} />, title: "Farmers & FPOs", description: "Progressive farmers and Farmer Producer Organizations practicing organic methods." },
                        { icon: <UserCheck size={28} />, title: "Extension Professionals", description: "Agricultural extension workers and technology transfer specialists." },
                        { icon: <Landmark size={28} />, title: "Policymakers", description: "Government officials and policy advisors in agriculture and environment." },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#D9A648]/30 hover:shadow-lg transition-all text-center group">
                            <div className="w-14 h-14 bg-[#FFF8E1] rounded-xl flex items-center justify-center text-[#D9A648] mx-auto mb-4 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Organizers */}
            <section className="py-20 bg-[#FFFDF7] container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">About the Organizers</h2>
                </div>
                <div className="space-y-6">
                    {data.organizers.map((org: any) => (
                        <div key={org.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            {org.logoUrl && (
                                <div className="w-32 h-32 shrink-0 flex items-center justify-center bg-[#FFFDF7] rounded-lg p-2">
                                    <img src={org.logoUrl} alt={org.name} className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-charcoal mb-3">{org.name}</h3>
                                <p className="text-gray-600 leading-relaxed">{org.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Supported By */}
            {data.supportedBy && data.supportedBy.length > 0 && (
                <section className="py-12 text-center container mx-auto px-6">
                    <h2 className="text-xl font-bold text-charcoal mb-8">Supported By</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {data.supportedBy.map((supporter: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 group">
                                <div className="w-40 h-32 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-all">
                                    {supporter.imageUrl ? (
                                        <img src={supporter.imageUrl} alt={supporter.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-600">{supporter.name}</span>
                                {supporter.website && (
                                    <Link href={supporter.website} target="_blank" className="text-xs text-earth-green hover:underline">
                                        Visit Website
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Partners */}
            <section className="py-12 text-center container mx-auto px-6">
                <h2 className="text-xl font-bold text-charcoal mb-8">Collaborating Partners</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {data.partners && data.partners.length > 0 ? (
                        data.partners.map((partner: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 group">
                                <div className="w-40 h-32 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-all">
                                    {partner.imageUrl ? (
                                        <img src={partner.imageUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-600">{partner.name}</span>
                                {partner.website && (
                                    <Link href={partner.website} target="_blank" className="text-xs text-earth-green hover:underline">
                                        Visit Website
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="w-32 h-32 bg-earth-green/5 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-earth-green/40 font-medium">To Be Announced</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Custom Footer CTA */}
            <section className="py-16 container mx-auto px-6 max-w-5xl">
                <div className="bg-charcoal rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Explore Themes, Programme & Registration</h3>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link href="/themes">
                            <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold">View Themes</Button>
                        </Link>
                        <Link href="/programme">
                            <Button variant="secondary" className="bg-white text-charcoal font-bold">Programme</Button>
                        </Link>
                        <Link href="/registration">
                            <Button className="bg-green-900 border border-green-700 hover:bg-green-800 text-white font-bold">Register Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
