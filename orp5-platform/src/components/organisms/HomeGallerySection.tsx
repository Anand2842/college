"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Play, Image as ImageIcon, Video, ArrowRight, Download, Maximize2, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface MediaItem {
  id?: string;
  type?: "image" | "video" | string;
  image?: string;
  videoUrl?: string;
  poster?: string;
  title?: string;
  caption?: string;
  category?: string;
  url?: string;
}

interface HomeGallerySectionProps {
  items?: MediaItem[];
}

export function HomeGallerySection({ items = [] }: HomeGallerySectionProps) {
  const [activeTab, setActiveTab] = useState("All Media");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // Normalize items
  const normalizedItems: MediaItem[] = (items || [])
    .map((item, idx) => {
      const isVideo =
        item.type === "video" ||
        Boolean(item.videoUrl) ||
        (item.image && item.image.endsWith(".mp4")) ||
        (item.url && item.url.endsWith(".mp4"));

      const image = item.image || item.url || "";
      const videoUrl = item.videoUrl || (image.endsWith(".mp4") ? image : undefined);
      const poster = item.poster || (isVideo ? image : undefined);

      return {
        id: item.id || `home-gallery-${idx}`,
        type: isVideo ? "video" : "image",
        image: isVideo ? (poster || "") : image,
        videoUrl,
        poster,
        title: item.title || item.caption || `ORP-5 Highlight ${idx + 1}`,
        caption: item.caption || (isVideo ? "Conference session recordings and delegate interactions." : "Live photography from ORP-5 proceedings."),
        category: item.category || (isVideo ? "Conference Videos" : "Day 1 (21 Sep 2026)")
      };
    })
    .filter((item) => item.image || item.videoUrl);

  if (normalizedItems.length === 0) return null;

  const categories = ["All Media", "Day 1 (21 Sep 2026)", "Conference Videos"];

  const filteredItems = activeTab === "All Media"
    ? normalizedItems
    : normalizedItems.filter((item) => {
        if (activeTab === "Conference Videos") return item.type === "video";
        return item.category === activeTab || (item.type !== "video" && activeTab.includes("Day 1"));
      });

  // Take top 6 items for homepage preview
  const previewItems = filteredItems.slice(0, 6);

  return (
    <section id="gallery-preview" className="py-20 bg-[#0c1f17] text-white relative overflow-hidden border-t border-earth-green/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rice-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sapling-green/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rice-gold/10 text-rice-gold border border-rice-gold/20 text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
            <Sparkles size={14} className="text-rice-gold animate-pulse" />
            Live Event & Media Archive
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Symposium Moments & <span className="text-rice-gold font-normal italic">Live Highlights</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
            High-definition photographs, inaugural addresses, and session recordings capturing the energy of ORP-5 New Delhi.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === cat
                  ? "bg-rice-gold text-[#0c1f17] shadow-lg shadow-rice-gold/20 scale-105"
                  : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item, idx) => {
            const isVideo = item.type === "video";
            return (
              <div
                key={item.id || idx}
                onClick={() => setSelectedMedia(item)}
                className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-rice-gold/50 shadow-xl hover:shadow-2xl hover:shadow-rice-gold/10 transition-all duration-500 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Media Container */}
                <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-black/40">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "Gallery Media"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                      {isVideo ? <Video size={12} className="text-rice-gold" /> : <ImageIcon size={12} className="text-rice-gold" />}
                      {item.category}
                    </span>
                  </div>

                  {/* Play Button Overlay for Videos */}
                  {isVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-rice-gold text-[#0c1f17] flex items-center justify-center shadow-2xl transform group-hover:scale-115 transition-transform">
                        <Play size={22} className="fill-current ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  )}

                  {/* Bottom Text Over image */}
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-rice-gold transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-1 mt-1 font-light">
                      {item.caption}
                    </p>
                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between text-xs text-rice-gold font-semibold">
                  <span>{isVideo ? "Watch Stream" : "View Photo"}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Gallery CTA */}
        <div className="mt-14 text-center">
          <Link href="/gallery">
            <Button
              variant="premium"
              size="lg"
              className="px-10 py-4 text-xs uppercase tracking-[0.15em] font-bold shadow-xl shadow-rice-gold/20 hover:scale-105 transition-transform"
            >
              Explore Full Photo & Video Gallery <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Lightbox / Video Player Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-[#12281e] border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="bg-black max-h-[75vh] flex items-center justify-center overflow-hidden">
              {selectedMedia.type === "video" && selectedMedia.videoUrl ? (
                <video
                  src={selectedMedia.videoUrl}
                  poster={selectedMedia.poster || selectedMedia.image}
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

            <div className="p-6 md:p-8">
              <span className="text-[11px] uppercase font-bold tracking-widest text-rice-gold mb-1 block">
                {selectedMedia.category || "ORP-5 Highlight"}
              </span>
              <h3 className="text-xl font-serif font-bold text-white">{selectedMedia.title}</h3>
              {selectedMedia.caption && (
                <p className="text-sm text-white/70 mt-1 font-light">{selectedMedia.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
