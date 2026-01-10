import { Navbar } from "@/components/organisms/Navbar";
import { Hero } from "@/components/organisms/Hero";
import { QuickAccessCard } from "@/components/molecules/QuickAccessCard";
import { ThemeCard } from "@/components/molecules/ThemeCard";
import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { ProgrammeCard } from "@/components/molecules/ProgrammeCard";
import { FAQItem } from "@/components/molecules/FAQItem";
import { DateStep } from "@/components/molecules/DateStep";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Footer } from "@/components/organisms/Footer";
import { createPageMetadata } from "@/lib/metadata";
import {
  Info, Leaf, Calendar, UserPlus, Sprout, Mountain, Apple,
  LucideIcon, Globe, Lightbulb, Briefcase, Star, MapPin
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

export const revalidate = 0; // Ensure dynamic fetching for now, or use revalidatePath

export default async function Home() {
  let cmsData = null;
  try {
    cmsData = await getHomepageData();
    console.log(`[${new Date().toISOString()}] Homepage Data Fetched:`, cmsData ? "Success" : "Failed");
  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  // Force usage of CMS Data
  const data = cmsData;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal mb-4">Content Not Loaded</h1>
          <p className="text-gray-600">The homepage content could not be retrieved from the database.</p>
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded text-sm text-left max-w-md mx-auto">
            Debug Info: getHomepageData returned null. Check Supabase connection and Page table content.
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative bg-[#FDFCF8] font-sans">
      <Navbar />

      {/* Hero Section */}
      <Hero
        headline={data.hero.headline}
        subheadline={data.hero.subheadline}
        backgroundImage={data.hero.backgroundImage}
        partners={data.partners || []}
        venue={data.venue?.title ? `${data.venue.title}${data.venue.address ? `, ${data.venue.address}` : ''}` : undefined}
        dateString="21–25 September 2026"
      />

      {/* Quick Access Row - Overlapping Hero */}
      {/* Quick Access Row - Standard flow */}
      <div className="container mx-auto px-6 relative z-30 -mt-16 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAccessCard icon={<Info size={28} />} title="About the Conference" href="/about" delay={0.1} />
          <QuickAccessCard icon={<Leaf size={28} />} title="Themes (ORP-5)" href="/themes" delay={0.2} />
          <QuickAccessCard icon={<Calendar size={28} />} title="Programme Overview" href="/programme" delay={0.3} />
          <QuickAccessCard icon={<UserPlus size={28} />} title="Delegate Registration" href="/registration" delay={0.4} />
        </div>
      </div>

      {/* Themes Preview Section */}
      <section id="themes" className="py-20 bg-[#FDFCF8]">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle
            title="Themes Preview"
            subtitle="Exploring new seeds for sustainable rice farming to shape the future of agriculture."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            {data.themes.map((theme: any, index: number) => {
              const Icon = iconMap[theme.iconName] || Sprout;
              return (
                <ThemeCard
                  key={theme.id}
                  icon={<Icon size={40} strokeWidth={1.5} />}
                  title={theme.title}
                  description={theme.description}
                  href="/themes"
                  colorTheme={theme.colorTheme}
                  delay={0.1 * (index + 1)}
                  subtitle={`Theme ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Speakers Highlight */}
      <section id="speakers" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle
            title="Speakers Highlight"
            subtitle="Hear from leading experts and advisors in the field of organic agriculture."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mt-16">
            {data.speakers.map((speaker: any, index: number) => (
              <SpeakerCard
                key={speaker.id}
                name={speaker.name}
                role={speaker.role}
                institution={speaker.institution}
                imageUrl={speaker.imageUrl}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Programme Snapshot */}
      <section id="programme" className="py-24 bg-[#FDFCF8]">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="Programme Snapshot"
            subtitle="A glimpse into curated sessions of insightful talks, workshops, and networking events."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-16 max-w-7xl mx-auto">
            {['day1', 'day2', 'day3', 'day4', 'day5'].map((dayKey, index) => (
              <ProgrammeCard
                key={dayKey}
                day={`Day ${index + 1}`}
                date={data.programme?.[dayKey]?.date || "TBD"}
                activities={data.programme?.[dayKey]?.activities || []}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/programme" className="text-earth-green font-serif italic text-lg hover:underline transition-all">
              View Full Agenda &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section id="dates" className="py-24 bg-white">
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
              <button className="bg-[#DFC074] hover:bg-[#B89C50] text-[#123125] font-bold py-3 px-8 rounded-full transition-colors shadow-sm text-sm uppercase tracking-wide">
                Download Key Dates
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join ORP-5 */}
      <section className="py-24 bg-[#FDFCF8]">
        <div className="container mx-auto px-6">
          <SectionTitle title="Why Join ORP-5?" subtitle="Connect, learn, and contribute to the future of sustainable agriculture." centered />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            {data.whyJoin?.map((item: any, i: number) => {
              const Icon = iconMap[item.iconName] || Star;
              return (
                <div key={i} className="bg-white p-8 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 bg-[#123125]/5 group-hover:bg-[#DFC074]/10 rounded-full mx-auto mb-6 flex items-center justify-center text-[#123125] group-hover:text-[#B88A38] transition-colors">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-lg mb-3 text-charcoal">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[#FDFCF8]">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="Gallery Preview" subtitle="Moments from past successful symposia." centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {data.gallery?.map((img: any, i: number) => (
              <div key={i} className="overflow-hidden rounded-2xl h-64 shadow-md group relative">
                {img.url ? (
                  <Image
                    src={img.url}
                    alt="Gallery"
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/gallery" className="text-earth-green font-serif italic text-sm hover:underline">
              View Full Gallery &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Banner */}
      <section className="py-24 bg-[#123125] relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container relative z-10 px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 tracking-tight">Registration opens 1 January 2026</h2>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto font-light">
            Reserve your spot early for the premier organic rice farming conference.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/registration">
              <button className="bg-white text-[#123125] font-bold text-sm uppercase tracking-widest px-8 py-4 rounded hover:bg-[#DFC074] transition-colors">
                Register Now
              </button>
            </Link>
            <Link href="/brochure">
              <button className="bg-transparent border border-white/30 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded hover:bg-white/10 transition-colors">
                Download Guidelines
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="Have Questions?"
            subtitle="Find answers to common queries about ORP-5."
            centered
          />
          <div className="max-w-3xl mx-auto mt-16">
            {data.faq?.map((item: any, i: number) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section (Footer Top) */}
      <section className="bg-[#FBF9F4] py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="font-serif font-bold text-3xl text-charcoal mb-4">{data.venue?.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{data.venue?.description}</p>
              <div className="flex items-center gap-3 text-earth-green font-bold text-sm">
                <MapPin size={20} />
                <span>{data.venue?.address}</span>
              </div>
              <Link href="/venue" className="inline-block mt-8 text-xs font-bold uppercase tracking-widest text-[#B89C50] hover:text-[#123125] border-b border-[#B89C50] pb-1">
                View Venue & Directions &rarr;
              </Link>
            </div>
            <div className="flex gap-6">
              <div className="w-40 h-40 bg-[#123125] rounded-xl flex items-center justify-center">
                {/* Placeholder Logo */}
                <Sprout className="text-[#DFC074]" size={40} />
              </div>
              <div className="w-40 h-40 bg-[#123125] rounded-xl flex items-center justify-center">
                {/* Placeholder Logo */}
                <Globe className="text-[#DFC074]" size={40} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
