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
    const [selectedMedia, setSelectedMedia] = useState<any>(null);

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

    const isAllFilter = activeFilter.startsWith("All");
    const filteredGallery = isAllFilter
        ? data.mainGallery
        : data.mainGallery?.filter((item: any) => item.category === activeFilter);

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar variant="default" />

            <PageHero
                headline={data.hero?.headline || "ORP-5 Official Media & Photo Gallery"}
                subheadline={data.hero?.subheadline || "Live captures, inaugural highlights, global symposia, and keynote moments from New Delhi."}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Photo & Video Gallery"
            />

            {/* Intro Card */}
            <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-10 md:mt-12 pb-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 shadow-xl luxury-card text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                        <Sparkles size={13} className="text-rice-gold" />
                        Live Event & Heritage Archive
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">{data.intro?.title || "Conference Memories & Highlights"}</h2>
                    <p className="text-charcoal/75 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto font-light">{data.intro?.description || "Browse high-definition photographs and video recordings from the 5th International Symposium on Oryza Pollen (ORP-5)."}</p>
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
                                    activeFilter === cat || (cat.startsWith("All") && isAllFilter && activeFilter === "All Photos" && cat === "All Media")
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

            {/* Photo & Video Grid */}
            <section className="container mx-auto px-6 py-8 max-w-7xl pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGallery?.map((item: any) => {
                        const isVideo = item.type === "video" || item.videoUrl || (item.image && item.image.endsWith(".mp4"));
                        const videoSrc = item.videoUrl || (item.image?.endsWith(".mp4") ? item.image : null);
                        const posterSrc = item.poster || (isVideo ? null : item.image);

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-earth-green/10 flex flex-col luxury-card cursor-pointer"
                                onClick={() => setSelectedMedia({ ...item, isVideo, videoSrc, posterSrc })}
                            >
                                <div className="h-64 overflow-hidden relative bg-gray-900 flex items-center justify-center">
                                    {isVideo ? (
                                        <div className="relative w-full h-full group/vid">
                                            {posterSrc ? (
                                                <img
                                                    src={posterSrc}
                                                    alt={item.title || "Video thumbnail"}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <video
                                                    src={videoSrc}
                                                    poster={posterSrc}
                                                    className="w-full h-full object-cover"
                                                    preload="metadata"
                                                    muted
                                                    playsInline
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                                <div className="w-14 h-14 rounded-full bg-earth-green/90 text-rice-gold flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                                Video
                                            </span>
                                        </div>
                                    ) : (
                                        item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title || "Gallery photo"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        )
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                                        <span className="text-white text-xs font-medium">{item.category || "Symposium Highlights"}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-serif font-bold text-base text-charcoal mb-1 group-hover:text-earth-green transition-colors">{item.title}</h3>
                                        {item.caption && <p className="text-xs text-charcoal/60 leading-relaxed font-light">{item.caption}</p>}
                                    </div>
                                    {item.category && (
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-earth-green font-medium">
                                            <span>{item.category}</span>
                                            <span className="text-rice-gold">View &rarr;</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Lightbox / Media Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                        <div className="bg-black max-h-[75vh] flex items-center justify-center overflow-hidden">
                            {selectedMedia.isVideo ? (
                                <video
                                    src={selectedMedia.videoSrc}
                                    poster={selectedMedia.posterSrc}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="max-h-[75vh] w-full object-contain"
                                />
                            ) : (
                                <img
                                    src={selectedMedia.image}
                                    alt={selectedMedia.title}
                                    className="max-h-[75vh] w-full object-contain"
                                />
                            )}
                        </div>
                        <div className="p-6 md:p-8 bg-white">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-earth-green mb-1 block">
                                {selectedMedia.category || "ORP-5 Archive"}
                            </span>
                            <h3 className="text-xl font-serif font-bold text-charcoal">{selectedMedia.title}</h3>
                            {selectedMedia.caption && (
                                <p className="text-sm text-charcoal/70 mt-1 font-light">{selectedMedia.caption}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
