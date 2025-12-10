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
  title: '5th International Conference on Organic Rice Farming',
  description: 'Join ORP-5 for cutting-edge discussions on sustainable organic rice farming, featuring leading experts, workshops, and networking opportunities.',
  path: '/',
  keywords: ['organic rice farming', 'sustainable agriculture', 'rice conference', 'ORP-5', 'agriculture symposium'],
});

export const revalidate = 0; // Ensure dynamic fetching for now, or use revalidatePath

export default async function Home() {
  const cmsData = await getHomepageData();

  // Fallback default data if CMS returns null (first load before admin save)
  const defaultData: any = {
    hero: {
      headline: "5th International Conference on <br /> <span class='text-rice-gold'>Organic & Natural Rice</span> <br /> Farming",
      subheadline: "Advancing Global Agricultural Innovation & Sustainability <br/> 7-9 September 2026 | Galgotias University, Greater Noida, India",
      backgroundImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop"
    },
    themes: [
      { id: "1", title: "Breeding & Genetics", description: "Developing resilient rice varieties through advanced breeding techniques and genetic research.", iconName: "Sprout", colorTheme: "green" },
      { id: "2", title: "Soil Health Management", description: "Sustainable soil management practices for optimal organic rice cultivation.", iconName: "Mountain", colorTheme: "brown" },
      { id: "3", title: "Pest & Disease Control", description: "Natural and organic methods for pest management and disease prevention.", iconName: "Apple", colorTheme: "red" }
    ],
    speakers: [],
    programme: {
      day1: { date: "7 September 2026", activities: ["Opening Ceremony", "Keynote Speeches", "Technical Sessions"] },
      day2: { date: "8 September 2026", activities: ["Workshops", "Field Visits", "Panel Discussions"] },
      day3: { date: "9 September 2026", activities: ["Closing Sessions", "Awards Ceremony", "Networking"] },
      day4: { date: "10 September 2026", activities: ["Post-Conference Tour", "Community Outreach"] },
      day5: { date: "11 September 2026", activities: ["Departure", "Farewell Breakfast"] }
    },
    dates: [
      { date: "Jan 1, 2026", label: "Registration Opens", status: "upcoming" },
      { date: "Mar 15, 2026", label: "Abstract Submission Deadline", status: "upcoming" },
      { date: "Sep 7-9, 2026", label: "Conference Dates", status: "upcoming" }
    ],
    whyJoin: [
      { iconName: "Star", title: "Global Networking", desc: "Connect with experts from around the world." },
      { iconName: "Globe", title: "Latest Research", desc: "Learn about cutting-edge developments in organic rice farming." },
      { iconName: "Briefcase", title: "Practical Insights", desc: "Gain actionable knowledge for your agricultural practices." }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop" },
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop" },
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop" }
    ],
    venue: {
      title: "Conference Venue",
      description: "Galgotias University, Greater Noida, India - A premier institution dedicated to excellence in education and research.",
      address: "Plot No. 2, Techzone 4, Greater Noida, Uttar Pradesh 201310, India"
    },
    faq: [
      { question: "What is the date and venue of ORP-5?", answer: "The 5th International Conference on Organic and Natural Rice Farming and Production Systems (ORP 5) will be held from September 21-25, 2026 at Galgotias University, Greater Noida, India." },
      { question: "What is the focus of the conference?", answer: "ORP-5 focuses on advancing sustainable and eco-friendly rice cultivation, highlighting global advancements in organic farming, natural farming models, pest-resilient varieties, and soil health management." },
      { question: "Who can attend?", answer: "The conference welcomes scientists, rice growers, policymakers, students, and other stakeholders across the organic and natural rice production and commercialization chain." },
      { question: "How do I submit an abstract?", answer: "Abstracts (not exceeding 500 words) can be sent to the conference email (organizingsecretary@orp5ic.com) on or before 31 July 2026. The call for abstracts opens on 01 January 2026." },
      { question: "When does registration open?", answer: "Registration for the conference will start from 1 January 2026. Details of the registration will be shared shortly." },
      { question: "Are there awards for researchers?", answer: "Yes, prizes and awards will be announced shortly to encourage participation from young researchers and students through poster sessions and innovation pitches." },
      { question: "Is accommodation provided?", answer: "Information about hotels near the venue along with tariffs will be uploaded on the site shortly." }
    ]
  };

  const data = cmsData || defaultData;

  return (
    <main className="min-h-screen relative bg-[#FDFCF8] font-sans">
      <Navbar />

      {/* Hero Section */}
      <Hero
        headline={data.hero.headline}
        subheadline={data.hero.subheadline}
        backgroundImage={data.hero.backgroundImage}
      />

      {/* Quick Access Row - Overlapping Hero */}
      <div className="container mx-auto px-6 relative z-30 -mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Collaborating Partners */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="Collaborating Partners" subtitle="Proudly supported by leading organizations dedicated to advancing sustainable agriculture." centered />

          <div className="flex flex-wrap justify-center gap-12 mt-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-32 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-300">
                LOGO {i}
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/sponsorship">
              <button className="bg-[#F3EACB] text-[#6D5D3A] font-bold px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-[#DFC074] hover:text-[#123125] transition-colors">
                Become a Partner
              </button>
            </Link>
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
                <Image
                  src={img.url}
                  alt="Gallery"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
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
