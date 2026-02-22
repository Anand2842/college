"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, Globe, Users, Leaf, Sprout, Sun, FlaskConical, Rocket, CheckCircle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function ExhibitionClient() {
    const [data, setData] = useState<any>(null);
    const [openItem, setOpenItem] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/content/exhibition")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    const toggleAccordion = (index: string) => {
        setOpenItem(openItem === index ? null : index);
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "Globe": return <Globe size={32} />;
            case "Users": return <Users size={32} />;
            case "Leaf": return <Leaf size={32} />;
            case "Sprout": return <Sprout size={24} />;
            case "Sun": return <Sun size={24} />;
            case "FlaskConical": return <FlaskConical size={24} />;
            case "Rocket": return <Rocket size={24} />;
            default: return <Leaf size={32} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Exhibition"
                buttons={[{ label: data.hero.button.label, link: data.hero.button.link, variant: "primary" as const }]}
            />

            {/* Intro Section */}
            <div className="container mx-auto px-6 py-24 max-w-5xl">
                <div className="border-l-4 border-[#DFC074] pl-8 mb-20">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">{data.intro.description}</p>
                </div>

                {/* Why Exhibit Cards */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Why Exhibit?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.whyExhibit.map((item: any, i: number) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-orange-100 hover:border-[#DFC074] transition-colors group">
                                <div className="w-16 h-16 mx-auto bg-[#FDF8EB] rounded-full flex items-center justify-center text-[#DFC074] mb-6 group-hover:bg-[#DFC074] group-hover:text-white transition-colors">
                                    {getIcon(item.icon)}
                                </div>
                                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Segments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-24 text-center">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-12">Exhibition Segments</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.segments.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#f4f1e8] flex items-center justify-center text-[#b89c60]">
                                    {getIcon(item.icon)}
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floor Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="bg-[#123125] p-8 rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 min-h-[300px] flex items-center justify-center">
                        {data.floorLayout.imageUrl ? <img src={data.floorLayout.imageUrl} alt="Floor Layout" className="rounded-lg w-full h-auto opacity-90" /> : <div className="text-white/50">Floor Layout Loading...</div>}
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">{data.floorLayout.title}</h2>
                        <p className="text-gray-600 mb-8">{data.floorLayout.description}</p>
                        <div className="space-y-4">
                            {data.floorLayout.boothTypes.map((booth: any, i: number) => (
                                <div key={i} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                                    <h3 className="font-bold text-[#123125] mb-1">{booth.title}</h3>
                                    <p className="text-xs text-gray-500">{booth.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Who Can Exhibit */}
                <div className="mb-24 text-center">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12">Who Can Exhibit?</h2>
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {data.whoCanExhibit.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 bg-[#F1F3E9] px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                <div className="bg-[#24C535] rounded-full p-0.5"><CheckCircle size={10} className="text-white" /></div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interest Banner */}
                <div className="bg-[#DFC074] rounded-2xl p-12 text-center shadow-lg shadow-yellow-900/10 mb-24">
                    <h2 className="text-2xl font-serif font-bold text-[#123125] mb-2">{data.interestBanner.headline}</h2>
                    <p className="text-[#123125]/80 text-sm mb-8 font-medium">{data.interestBanner.subheadline}</p>
                    <Link href={data.interestBanner.button.link}>
                        <Button className="bg-[#123125] hover:bg-[#0e251c] text-white px-8 font-bold border-none">
                            {data.interestBanner.button.label} <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Guidelines Accordion */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-12 text-center">Guidelines for Exhibitors</h2>
                    <div className="space-y-4">
                        {data.guidelines.map((item: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion(`i-${i}`)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                    {item.title}
                                    {openItem === `i-${i}` ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {openItem === `i-${i}` && (
                                    <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                        {item.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer CTA */}
            <div className="bg-[#123125] py-20 text-center text-white border-t-4 border-[#DFC074]">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="w-16 h-1 bg-[#DFC074] mx-auto mb-8 rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 leading-tight">
                        {data.footerCta.headline}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={data.footerCta.buttonprimary.link}><Button className="bg-[#DFC074] text-[#123125] hover:bg-[#d6b567] font-bold px-6">{data.footerCta.buttonprimary.label}</Button></Link>
                        <Link href={data.footerCta.buttonsecondary.link}><Button variant="outline" className="border-white text-white hover:bg-white/10">{data.footerCta.buttonsecondary.label}</Button></Link>
                        <Link href={data.footerCta.buttontertiary.link}><Button variant="outline" className="border-white text-white hover:bg-white/10">{data.footerCta.buttontertiary.label}</Button></Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
