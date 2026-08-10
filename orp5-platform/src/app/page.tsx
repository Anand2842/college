export const dynamic = 'force-dynamic';

import { Navbar } from "@/components/organisms/Navbar";
import { Hero } from "@/components/organisms/Hero";
import { ThemeCard } from "@/components/molecules/ThemeCard";
import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { ProgrammeCard } from "@/components/molecules/ProgrammeCard";
import { FAQItem } from "@/components/molecules/FAQItem";
import { DateStep } from "@/components/molecules/DateStep";
import { PartnerCard } from "@/components/molecules/PartnerCard";
import { InfiniteMarquee } from "@/components/molecules/InfiniteMarquee";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { StatsStrip } from "@/components/organisms/StatsStrip";
import { OrganizersHierarchy } from "@/components/organisms/OrganizersHierarchy";
import { AboutPreview } from "@/components/organisms/AboutPreview";
import { CallForPapers } from "@/components/organisms/CallForPapers";
import { AwardsPreview } from "@/components/organisms/AwardsPreview";
import { PublicationInfo } from "@/components/organisms/PublicationInfo";
import { VenuePreview } from "@/components/organisms/VenuePreview";
import { Footer } from "@/components/organisms/Footer";
import { createPageMetadata } from "@/lib/metadata";
import {
  Sprout, Mountain, Apple, Info, Leaf, Calendar, UserPlus,
  LucideIcon, Globe, Lightbulb, Briefcase, Star
} from "lucide-react";
import { getHomepageData } from "@/lib/cms";
import Link from "next/link";
import Image from "next/image";

// Icon Mapping
const iconMap: Record<string, LucideIcon> = {
  Sprout, Mountain, Apple, Info, Leaf, Calendar, UserPlus,
  Globe, Lightbulb, Briefcase, Star
};

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
    console.log(`[${new Date().toISOString()}] Homepage Data Fetched:`, cmsData ? "Success" : "Failed");
  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  // Fallback default data if CMS returns null (first load before admin save)
  const defaultData: any = {
    hero: {
      headline: "5ᵗʰ International Conference on <br /> <span class='text-rice-gold'>Organic and Natural Rice</span> <br /> Production Systems",
      subheadline: "Cultivating a Sustainable Future",
      backgroundImage: "https://images.unsplash.com/photo-1536617621972-e5659779df3a?q=80&w=2938&auto=format&fit=crop",
      registrationStart: "2026-09-21T00:00:00Z",
      registrationStatusText: "Countdown to Conference"
    },
    partners: [
      { id: "p1", name: "Organizer 1", logoUrl: "" },
      { id: "p2", name: "Organizer 2", logoUrl: "" },
      { id: "p3", name: "Organizer 3", logoUrl: "" }
    ],
    themes: [],
    speakers: [],
    programme: {},
    dates: [
      { date: "20 January 2026", label: "Call for Abstracts Opens", status: "completed" },
      { date: "20 January 2026", label: "Registration Opens", status: "completed" },
      { date: "20 August 2026", label: "Abstract Submission Deadline", status: "urgent" },
      { date: "25 August 2026", label: "Notification of Abstract Status", status: "upcoming" },
      { date: "31 August 2026", label: "Registration Deadline", status: "upcoming" },
      { date: "21–25 September 2026", label: "Conference", status: "upcoming" }
    ],
    whyJoin: [],
    gallery: [],
    faq: [],
    venue: {
      title: "Conference Venue",
      description: "Join us at our world-class facility.",
      address: "123 Conference Center Dr."
    }
  };

  const data = cmsData || defaultData;
  const registrationStart = data.hero?.registrationStart || "2026-09-21T00:00:00Z";
  const registrationStatusText = data.hero?.registrationStatusText || "Countdown to Conference";

  return (
    <main className="min-h-screen relative bg-[#FFFDF7] font-sans">
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

      {/* 2. Important Dates */}
      <section id="dates" className="py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle
            title="Important Dates"
            subtitle="Keep on track with these key deadlines for abstracts, registration, and the conference itself."
            centered
          />

          <div className="flex flex-col md:flex-row justify-center gap-6 mt-16">
            {data.dates.map((item: any, index: number) => (
              <DateStep
                key={index}
                date={item.date}
                label={item.label}
                status={item.status}
                isLast={index === data.dates.length - 1}
              />
            ))}
          </div>

          <div className="mt-16">
            <Link href="/important-dates">
              <button className="bg-[#DFC074] hover:bg-[#B89C50] text-[#123125] font-bold py-3 px-8 rounded-lg transition-colors shadow-sm text-sm uppercase tracking-wide">
                Download Key Dates
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Conference Themes */}
      <section id="themes" className="py-20 bg-[#FFFDF7]">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle
            title="Conference Themes"
            subtitle="Explore the 9 core thematic areas shaping the future of organic agriculture."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
            {data.themes.map((theme: any, index: number) => {
              const Icon = iconMap[theme.iconName] || Sprout;
              return (
                <ThemeCard
                  key={theme.id}
                  icon={<Icon size={36} strokeWidth={1.5} />}
                  title={theme.title}
                  description={theme.description}
                  href="/themes"
                  submissionHref="/submission"
                  colorTheme={theme.colorTheme}
                  delay={0.1 * (index + 1)}
                  subtitle={`Theme ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Venue Preview */}
      <VenuePreview venue={data.venue} />

      {/* 5. Partners (Combined Organizers and Other Partners) */}
      <section id="partners" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle
            title="Our Partners"
            subtitle="Collaboratively driving the future of organic rice production."
            centered
          />
          
          <div className="mt-12">
            {/* Organizers Hierarchy */}
            {data.partnersByCategory && (
              <div className="mb-12">
                <OrganizersHierarchy partnersByCategory={data.partnersByCategory} />
              </div>
            )}
            
            {/* Other Partners */}
            {data.partnersByCategory && Object.keys(data.partnersByCategory).filter(cat => !['Jointly organised by', 'Supported by', 'In collaboration with'].includes(cat)).length > 0 && (
              <div className="mt-10">
                {Object.entries(data.partnersByCategory)
                  .filter(([cat]) => !['Jointly organised by', 'Supported by', 'In collaboration with'].includes(cat))
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
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-earth-green/50 mb-6">{category}</h3>
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
