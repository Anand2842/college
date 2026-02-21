"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Download, Image as ImageIcon, Newspaper, FileImage, Share2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GalleryClient() {
    const [data, setData] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState("All Photos");

    useEffect(() => {
        Promise.all([
            fetch("/api/content/gallery").then((res) => res.json()),
            fetch("/api/content/homepage").then((res) => res.json()).catch(() => null),
        ]).then(([galleryData, homeData]) => {
            // Merge homepage gallery images into mainGallery if mainGallery is empty
            const homeGalleryImages = (homeData?.gallery || [])
                .filter((img: any) => img.url)
                .map((img: any, i: number) => ({
                    id: `home-${i}`,
                    image: img.url,
                    title: img.caption || `Gallery Image ${i + 1}`,
                    category: "All Photos",
                }));

            const existingMain = galleryData.mainGallery || [];
            const existingFeatured = galleryData.featuredGallery || [];

            // Use homepage images if no gallery-specific images exist
            const mergedMain = existingMain.length > 0 ? existingMain : homeGalleryImages;
            const mergedFeatured = existingFeatured.length > 0 ? existingFeatured : homeGalleryImages.slice(0, 3);

            // Filter out "Explore Exhibition" button from footerCta
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
            case "Newspaper": return <Newspaper size={20} />;
            case "FileImage": return <FileImage size={20} />;
            case "Share2": return <Share2 size={20} />;
            default: return <ImageIcon size={20} />;
        }
    };

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    const filteredGallery = activeFilter === "All Photos"
        ? data.mainGallery
        : data.mainGallery.filter((item: any) => item.category === activeFilter);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Check if we should show featured gallery (only on 'All Photos' or if it matches category)
    const showFeatured = activeFilter === "All Photos";

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal overflow-x-hidden">
            <Navbar variant="dark" />

            {/* Hero Section */}
            <div className="bg-[#FFFDF7] pt-32 pb-16 text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <p className="text-earth-green/60 text-sm font-semibold mb-4 uppercase tracking-widest">
                        <Link href="/" className="hover:text-earth-green transition-colors">Home</Link> / Photo Gallery
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-charcoal tracking-tight">
                        {data.hero.headline}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {data.hero.subheadline}
                    </p>
                </div>
            </div>

            {/* Intro Card */}
            <div className="container mx-auto px-6 mb-16 max-w-5xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border-l-4 border-[#DFC074] relative overflow-hidden">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4 relative z-10">{data.intro.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-lg relative z-10">{data.intro.description}</p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFC074]/10 rounded-fullblur-2xl -mr-10 -mt-10"></div>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-6 mb-12 overflow-x-auto">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 min-w-max px-2">
                    {data.filters.map((filter: string) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all relative",
                                activeFilter === filter
                                    ? "bg-[#DFC074] text-charcoal shadow-md"
                                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                            )}
                        >
                            {filter}
                            {activeFilter === filter && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-[#DFC074] rounded-full -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Content */}
            <div className="container mx-auto px-6 mb-24 max-w-7xl">

                {/* Featured Gallery (Only shown when 'All Photos' is active) */}
                <AnimatePresence mode="wait">
                    {showFeatured && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        >
                            {data.featuredGallery.map((item: any, i: number) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                                >
                                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full bg-gray-200" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-white font-bold text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform">{item.title}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Grid */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-serif font-bold text-charcoal">{activeFilter === "All Photos" ? "Inauguration & Keynotes" : activeFilter}</h3>
                    <div className="h-1 w-24 bg-[#E5E7EB] mx-auto mt-4 rounded-full relative">
                        <div className="absolute inset-0 bg-[#DFC074] w-1/3 rounded-full mx-auto"></div>
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredGallery.map((item: any) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer bg-gray-100"
                            >
                                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full bg-gray-200" />}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white font-medium text-sm">{item.title}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredGallery.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>No photos found in this category yet.</p>
                    </div>
                )}
            </div>

            {/* Downloadable Media Kits */}
            <div className="bg-[#FAF9F5] py-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Downloadable Media Kits</h2>
                        <p className="text-gray-500">Access official photos, logos, and social media assets from the ORP-5 conference.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.mediaKits.map((kit: any, i: number) => (
                            <motion.div
                                key={kit.id}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#DFC074]/10 text-[#B89C56] rounded-lg flex items-center justify-center group-hover:bg-[#DFC074] group-hover:text-white transition-colors">
                                        {getIcon(kit.icon)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-charcoal text-sm md:text-base">{kit.title}</h3>
                                        <p className="text-xs text-gray-500">{kit.description}</p>
                                    </div>
                                </div>
                                <div className="text-gray-300 group-hover:text-[#DFC074] transition-colors">
                                    <Download size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#0D241B] py-24 text-center text-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="w-16 h-1 bg-[#DFC074] mx-auto mb-8 rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{data.footerCta.headline}</h2>
                    <p className="text-emerald-100/70 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">{data.footerCta.subheadline}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {data.footerCta.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button variant="outline" className="border-emerald-700 text-emerald-100 hover:bg-emerald-900/50 hover:text-white hover:border-emerald-500 px-8 py-3 rounded-full transition-all">
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
