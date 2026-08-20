export const revalidate = 60;

import { Navbar } from "@/components/organisms/Navbar";
import { Hero } from "@/components/organisms/Hero";
import { PartnerCard } from "@/components/molecules/PartnerCard";
import { InfiniteMarquee } from "@/components/molecules/InfiniteMarquee";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { StatsStrip } from "@/components/organisms/StatsStrip";
import { OrganizersHierarchy } from "@/components/organisms/OrganizersHierarchy";
import { AboutPreview } from "@/components/organisms/AboutPreview";
import { VenuePreview } from "@/components/organisms/VenuePreview";
import { Footer } from "@/components/organisms/Footer";
import { createPageMetadata } from "@/lib/metadata";
import {
  Sprout, Mountain, Apple, Leaf, Calendar, UserPlus,
  LucideIcon, Globe, Lightbulb, Briefcase, Star,
  Cpu, Droplets, Wheat, Sun, HeartPulse, TrendingUp, Landmark
} from "lucide-react";
import { getHomepageData } from "@/lib/cms";
import Link from "next/link";

// Icon Mapping (for CMS iconName field)
const iconMap: Record<string, LucideIcon> = {
  Sprout, Mountain, Apple, Leaf, Calendar, UserPlus,
  Globe, Lightbulb, Briefcase, Star, Cpu, Droplets, Wheat, Sun, HeartPulse, TrendingUp, Landmark
};

// Fallback icons per theme index (when CMS has no iconName set)
const themeIconsByIndex: LucideIcon[] = [
  Wheat,        // 1. Organic & Natural Rice Production
  Lightbulb,    // 2. Innovations & Emerging Tech
  Sprout,       // 3. Natural Farming Models
  Sun,          // 4. Climate Change & Carbon-Neutral
  Droplets,     // 5. Soil, Water & Plant Health
  HeartPulse,   // 6. Food Quality, Nutrition & Health
  Cpu,          // 7. AI-Driven Mechanization
  TrendingUp,   // 8. Scaling, Value Chains & Markets
  Landmark,     // 9. Policy, Institutions & Capacity
];

export const metadata = createPageMetadata({
  title: '5th International Conference on Organic and Natural Rice Production Systems',
  description: 'Join ORP-5 for cutting-edge discussions on sustainable organic and natural rice production, featuring leading experts, workshops, and networking opportunities.',
  path: '/',
  keywords: ['organic rice', 'natural farming', 'sustainable agriculture', 'rice conference', 'ORP-5', 'production systems'],
});

export default async function Home() {
  let cmsData = null;
  try {
    cmsData = await getHomepageData();
  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  // High-fidelity fallback default data for instantaneous first paint
  const defaultData: any = {
    hero: {
      headline: "5ᵗʰ International Conference on <br /> <span class='text-rice-gold'>Organic and Natural Rice</span> <br /> Production Systems",
      subheadline: "Cultivating a Sustainable Future",
      backgroundImage: "https://vvqnxqtiwbfmipawtqet.supabase.co/storage/v1/object/public/uploads/1765390801550_Here_is_a_202512102348.gif",
      registrationStart: "2026-09-21T00:00:00Z",
      registrationStatusText: "Countdown to Conference",
      dateVenueLine: "21–25 September 2026 | NASC Complex, New Delhi, India"
    },
    partners: [],
    themes: [
      { id: "t1", title: "Organic and Natural Rice Production Systems – Current Status", iconName: "Wheat" },
      { id: "t2", title: "Innovations and Emerging Technologies in Organic Rice Production Systems", iconName: "Lightbulb" },
      { id: "t3", title: "Natural Farming Models for Sustainable Rice Production", iconName: "Sprout" },
      { id: "t4", title: "Climate Change Adaptation and Carbon-Neutral Rice Production Systems", iconName: "Sun" },
      { id: "t5", title: "Soil, Water and Plant Health Management", iconName: "Droplets" },
      { id: "t6", title: "Food Quality, Nutrition and Human Health", iconName: "HeartPulse" },
      { id: "t7", title: "AI-Driven Mechanization and Digital Intelligence for Organic Rice Production Systems", iconName: "Cpu" },
      { id: "t8", title: "Scaling, Value Chains, and Market Opportunities", iconName: "TrendingUp" },
      { id: "t9", title: "Policy, Institutions, and Capacity Building-Youth & Farmers Perspectives", iconName: "Landmark" }
    ],
    speakers: [],
    programme: {},
    dates: [
      { date: "20 January 2026", label: "Call for Abstracts Opens", status: "completed" },
      { date: "20 January 2026", label: "Registration Opens", status: "completed" },
      { date: "25 August 2026", label: "Abstract Submission Deadline", status: "urgent" },
      { date: "25 August 2026", label: "Notification of Abstract Status", status: "upcoming" },
      { date: "31 August 2026", label: "Registration Deadline", status: "upcoming" },
      { date: "21–25 September 2026", label: "Conference", status: "upcoming" }
    ],
    whyJoin: [],
    gallery: [],
    faq: [],
    venue: {
      title: "Conference Venue",
      description: "NASC Complex, DPS Marg, Pusa, New Delhi, India.",
      address: "NASC Complex, New Delhi, India"
    }
  };

  const data = cmsData || defaultData;
  const registrationStart = data.hero?.registrationStart || "2026-09-21T00:00:00Z";
  const registrationStatusText = data.hero?.registrationStatusText || "Countdown to Conference";

  return (
    <main className="min-h-screen relative bg-[#FAF9F5] font-sans">
      <Navbar />

      {/* 1. Hero */}
      <Hero
        headline={data.hero.headline}
        subheadline={data.hero.subheadline}
        dateVenueLine={data.hero.dateVenueLine}
        backgroundImage={data.hero.backgroundImage}
        partners={data.partners || []}
        registrationStart={registrationStart}
        registrationStatusText={registrationStatusText}
        registrationBannerText={data.hero.registrationBannerText}
        whyJoin={data.whyJoin || []}
      />

      {/* 2. Key Metric Figures Strip */}
      <StatsStrip />

      {/* 3. Global Legacy & About Preview */}
      <AboutPreview />

      {/* 4. Important Deadlines & Dates — Compact Timeline */}
      <section id="dates" className="py-10 md:py-16 bg-[#FAF9F5] border-y border-gray-200/60">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <SectionTitle
            badge="Milestones"
            title="Important Dates"
            subtitle="Key deadlines at a glance."
            centered
          />

          <div className="mt-8 md:mt-10 space-y-0 text-left">
            {data.dates.map((item: any, index: number) => {
              const isCompleted = item.status === "completed";
              const isUrgent = item.status === "urgent" || item.status === "active";
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 py-3.5 ${index !== data.dates.length - 1 ? 'border-b border-gray-200/60' : ''}`}
                >
                  {/* Status dot */}
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    isCompleted ? 'bg-sapling-green' : isUrgent ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  {/* Date */}
                  <span className={`text-sm font-serif font-bold shrink-0 w-[130px] sm:w-[160px] ${
                    isUrgent ? 'text-earth-green' : isCompleted ? 'text-charcoal/50' : 'text-charcoal'
                  }`}>
                    {item.date}
                  </span>
                  {/* Label */}
                  <span className={`text-sm ${
                    isCompleted ? 'text-charcoal/50 line-through' : isUrgent ? 'text-charcoal font-semibold' : 'text-charcoal/80'
                  }`}>
                    {item.label}
                  </span>
                  {/* Urgent badge */}
                  {isUrgent && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                      Deadline
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href="/important-dates">
              <button className="gold-shimmer-btn font-bold py-3 px-8 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer">
                View Full Timeline
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Conference Thematic Tracks — Premium Mini Cards */}
      <section id="themes" className="py-10 md:py-16 bg-white relative">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <SectionTitle
            badge="Scientific Agenda"
            title="Conference Thematic Areas"
            subtitle="9 core tracks shaping the future of organic and natural rice systems."
            centered
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-10">
            {data.themes.map((theme: any, index: number) => {
              const Icon = (theme.iconName && iconMap[theme.iconName]) || themeIconsByIndex[index] || Sprout;
              const num = String(index + 1).padStart(2, "0");
              return (
                <Link
                  key={theme.id || index}
                  href="/themes"
                  className="group relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-[#FAF9F5] to-white border border-earth-green/8 hover:border-rice-gold/40 hover:shadow-lg transition-all duration-300 text-left"
                >
                  {/* Watermark Number */}
                  <span className="absolute -top-1 -right-1 text-5xl md:text-6xl font-serif font-black text-earth-green/[0.04] group-hover:text-rice-gold/[0.12] transition-colors duration-300 select-none pointer-events-none leading-none">
                    {num}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-earth-green/8 text-earth-green flex items-center justify-center mb-3 group-hover:bg-earth-green group-hover:text-white transition-all duration-300">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm md:text-base font-bold text-charcoal leading-snug group-hover:text-earth-green transition-colors">
                    {theme.title}
                  </h3>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href="/themes">
              <button className="bg-earth-green hover:bg-earth-green-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer">
                Explore All 9 Tracks In Detail
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Venue & Accommodation Preview */}
      <VenuePreview venue={data.venue} />

      {/* 7. Organizers & Global Partners */}
      <section id="partners" className="py-16 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <SectionTitle
            badge="Collaborative Leadership"
            title="Organizers & Global Partners"
            subtitle="Distinguished academic, scientific, and institutional bodies driving ORP-5."
            centered
          />
          
          <div className="mt-10">
            {/* Organizers Hierarchy */}
            {data.partnersByCategory && (
              <div className="mb-14">
                <OrganizersHierarchy partnersByCategory={data.partnersByCategory} />
              </div>
            )}
            
            {/* Other Partners */}
            {data.partnersByCategory && Object.keys(data.partnersByCategory).filter(cat => !['Jointly organised by', 'Supported by', 'Knowledge partner', 'Technical collaborating partners', 'In collaboration with'].includes(cat)).length > 0 && (
              <div className="mt-12">
                {Object.entries(data.partnersByCategory)
                  .filter(([cat]) => !['Jointly organised by', 'Supported by', 'Knowledge partner', 'Technical collaborating partners', 'In collaboration with'].includes(cat))
                  .sort(([catA], [catB]) => {
                    const orderA = data.partnerCategorySettings?.find((s: any) => s.name === catA)?.order ?? 99;
                    const orderB = data.partnerCategorySettings?.find((s: any) => s.name === catB)?.order ?? 99;
                    return orderA - orderB;
                  })

                  .map(([category, catPartners]: [string, any]) => {
                    const setting = data.partnerCategorySettings?.find((s: any) => s.name === category);
                    const mode = setting?.mode || "grid";
                    return (
                      <div key={category} className="mt-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-earth-green/60 mb-6">{category}</h3>
                        {mode === "marquee" ? (
                          <InfiniteMarquee partners={catPartners} />
                        ) : (
                          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {catPartners.map((partner: any, index: number) => (
                              <PartnerCard
                                key={partner.id || index}
                                name={partner.name}
                                logoUrl={partner.logoUrl}
                                website={partner.website}
                                delay={0.05 * (index + 1)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
