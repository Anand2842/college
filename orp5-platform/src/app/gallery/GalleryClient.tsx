"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Download, Image as ImageIcon, Newspaper, FileImage, Share2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function GalleryClient() {
    const [data, setData] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState("All Photos");

    useEffect(() => {
        Promise.all([
            fetch("/api/content/gallery").then((res) => res.json()),
            fetch("/api/content/homepage").then((res) => res.json()).catch(() => null),
        ]).then(([galleryData, homeData]) => {
            const homeGalleryImages = (homeData?.gallery || [])
                .filter((img: any) => img.url)
                .map((img: any, i: number) => ({
                    id: `home-${i}`,
                    image: img.url,
                    title: img.caption || `Symposium Moment ${i + 1}`,
                    category: "All Photos",
                }));

            const existingMain = galleryData.mainGallery || [];
            const existingFeatured = galleryData.featuredGallery || [];

            const mergedMain = existingMain.length > 0 ? existingMain : homeGalleryImages;
            const mergedFeatured = existingFeatured.length > 0 ? existingFeatured : homeGalleryImages.slice(0, 3);

            if (galleryData.footerCta?.buttons) {
                galleryData.footerCta.buttons = galleryData.footerCta.buttons.filter(
                    (btn: any) => btn.label !== "Explore Exhibition"
                );
            }

            setData({
                ...galleryData,
                mainGallery: mergedMain,
                featuredGallery: mergedFeatured,
            });
        });
    }, []);

    const getIcon = (name: string) => {
        switch (name) {
            case "Newspaper": return <Newspaper size={20} className="text-earth-green" />;
            case "FileImage": return <FileImage size={20} className="text-earth-green" />;
            case "Share2": return <Share2 size={20} className="text-earth-green" />;
            default: return <ImageIcon size={20} className="text-earth-green" />;
        }
    };

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading gallery...</p>
        </div>
    );

    const filteredGallery = activeFilter === "All Photos"
        ? data.mainGallery
        : data.mainGallery.filter((item: any) => item.category === activeFilter);

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar variant="default" />

            <PageHero
                headline={data.hero?.headline || "Global Symposia Gallery"}
                subheadline={data.hero?.subheadline || "A photographic archive of past editions across Montpellier, Rome, Porto Alegre, and Tokyo."}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Photo Gallery"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-10 md:mt-12 pb-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 shadow-xl luxury-card text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                        <Sparkles size={13} className="text-rice-gold" />
                        Heritage Archive
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">{data.intro?.title}</h2>
                    <p className="text-charcoal/75 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto font-light">{data.intro?.description}</p>
                </div>
            </div>

            {/* Category Filter Tabs */}
            {data.categories && data.categories.length > 0 && (
                <section className="container mx-auto px-6 max-w-5xl mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {data.categories.map((cat: string) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                                    activeFilter === cat
                                        ? "bg-earth-green text-rice-gold shadow-md ring-2 ring-earth-green/20"
                                        : "bg-white text-charcoal/70 border border-gray-200 hover:border-earth-green/40 hover:text-earth-green"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Photo Grid */}
            <section className="container mx-auto px-6 py-8 max-w-7xl pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGallery?.map((item: any) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-earth-green/10 flex flex-col luxury-card"
                        >
                            <div className="h-64 overflow-hidden relative bg-gray-100">
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.title || "Gallery photo"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white text-xs font-medium">{item.category || "Symposium Highlights"}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif font-bold text-base text-charcoal mb-1">{item.title}</h3>
                                {item.caption && <p className="text-xs text-charcoal/60 leading-relaxed font-light">{item.caption}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Press & Media Kit */}
            {data.pressKit && (
                <section className="py-16 bg-white border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <SectionTitle
                            badge="Media Assets"
                            title="Press Kit & Official Assets"
                            subtitle="High-resolution logos, brand guidelines, and official symposium photo archives for media outlets."
                            centered
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            {data.pressKit.items?.map((item: any, i: number) => (
                                <div key={i} className="bg-[#FAF9F5] p-7 rounded-3xl border border-earth-green/10 luxury-card flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-earth-green/5 text-earth-green flex items-center justify-center mb-4">
                                            {getIcon(item.icon)}
                                        </div>
                                        <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                                        <p className="text-xs text-charcoal/70 leading-relaxed font-light mb-6">{item.description}</p>
                                    </div>
                                    <Link href={item.downloadLink || "#"} target="_blank">
                                        <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-wider">
                                            <Download size={13} className="mr-1.5" /> Download Asset
                                        </Button>
                                    </Link>
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
                            Be Part of History
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Capture Your Moments at ORP-5
                        </h3>
                        <p className="text-white/70 text-sm font-light">
                            Join over 500 delegates from 40+ countries in New Delhi this September 2026.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
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
