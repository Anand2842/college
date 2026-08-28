import { createPageMetadata } from '@/lib/metadata';
export const revalidate = 300; // cache 5 minutes

export const metadata = createPageMetadata({
    title: 'About',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/about',
});

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { getAboutPageData } from "@/lib/cms";
import * as LucideIcons from "lucide-react";
import { CheckCircle2, Wheat, Thermometer, Leaf, Users, GraduationCap, UserCheck, Sprout, BookOpen, Landmark, Globe2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/atoms/Button";

export default async function AboutPage() {
    const data = await getAboutPageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={28} /> : null;
    };

    const legacyEditions = [
        { year: "2012", city: "Montpellier", country: "France" },
        { year: "2015", city: "Milan", country: "Italy" },
        { year: "2018", city: "Porto Alegre", country: "Brazil" },
        { year: "2023", city: "Niigata", country: "Japan" },
        { year: "2026", city: "New Delhi", country: "India", active: true },
    ];

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Script id="about-schema" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "ORP-5 Conference",
                    "url": "https://www.orp5ic.com",
                    "logo": "https://www.orp5ic.com/icon.png",
                    "description": data.intro.description?.substring(0, 160)
                })}
            </Script>
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / About"
            />

            {/* Global Legacy Strip */}
            <section className="py-12 bg-earth-green text-white border-b border-white/10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <Globe2 size={22} className="text-rice-gold" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light">
                                International Symposia Heritage
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center">
                            {legacyEditions.map((ed, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        ed.active 
                                            ? "bg-rice-gold text-earth-green-dark shadow-lg ring-2 ring-white/30 scale-105" 
                                            : "bg-white/5 text-white/70 border border-white/10"
                                    }`}>
                                        <span className="font-serif text-sm font-bold block">{ed.year}</span>
                                        <span className="text-[10px] tracking-wider uppercase opacity-90">{ed.country}</span>
                                    </div>
                                    {idx < legacyEditions.length - 1 && (
                                        <span className="text-white/20 hidden sm:inline">→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro & At A Glance */}
            <section className="py-16 container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
                            <Sparkles size={13} className="text-rice-gold" />
                            Executive Overview
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6 leading-tight">
                            {data.intro.title}
                        </h2>
                        <p className="text-charcoal/75 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-light">
                            {data.intro.description}
                        </p>
                    </div>

                    <div className="lg:col-span-5 bg-white border border-earth-green/15 rounded-3xl p-8 shadow-xl relative luxury-card">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h3 className="text-xl font-serif font-bold text-charcoal">At a Glance</h3>
                            <span className="text-xs font-bold uppercase tracking-widest text-rice-gold-dark">Key Highlights</span>
                        </div>
                        <ul className="space-y-4">
                            {data.intro.atAGlance.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-charcoal/80 text-sm font-medium">
                                    <div className="w-5 h-5 rounded-full bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 size={13} />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why It Matters */}
            <section className="py-16 bg-white border-y border-gray-200/60">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionTitle
                        badge="Strategic Imperative"
                        title="Why ORP-5 Matters"
                        subtitle="Accelerating scientific transformation toward ecological, high-yield, and pesticide-free rice cultivation."
                        centered
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {data.whyMatters.map((item: any) => (
                            <div key={item.id} className="bg-[#FAF9F5] p-8 rounded-3xl border border-earth-green/10 flex flex-col items-start luxury-card">
                                <div className="w-14 h-14 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center mb-6">
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className="font-serif font-bold text-xl text-charcoal mb-3">{item.title}</h3>
                                <p className="text-charcoal/70 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="py-16 container mx-auto px-6 max-w-6xl">
                <SectionTitle
                    badge="Conference Charter"
                    title="Core Objectives"
                    subtitle="Key scientific and developmental goals guiding our technical deliberative tracks."
                    centered
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    {data.objectives.map((obj: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-8 h-8 rounded-xl bg-rice-gold/15 text-rice-gold-dark flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 size={18} />
                            </div>
                            <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed">{obj}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Significance of ORP-5 & SDG Alignment */}
            <section className="py-16 bg-earth-green-deep text-white relative overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-sapling-green/10 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <SectionTitle
                        badge="United Nations SDGs"
                        title="Significance & Global Impact"
                        subtitle="Addressing critical sustainable development challenges through organic and natural rice systems."
                        centered
                        variant="dark"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {[
                            {
                                icon: <Wheat size={28} />,
                                title: "Food Security & Nutrition",
                                description: "Promoting sustainable rice production to meet the growing global food demand while maintaining nutritional density and varietal biodiversity.",
                                sdg: "SDG 2",
                                sdgLabel: "Zero Hunger",
                            },
                            {
                                icon: <Thermometer size={28} />,
                                title: "Climate Action & Resilience",
                                description: "Mitigating methane emissions, lowering carbon intensity in cultivation, and developing climate-resilient organic paddy models.",
                                sdg: "SDG 13",
                                sdgLabel: "Climate Action",
                            },
                            {
                                icon: <Leaf size={28} />,
                                title: "Life on Land & Soil Health",
                                description: "Protecting aquatic & terrestrial ecosystems, restoring soil microbiome vitality, and eliminating synthetic chemical runoffs.",
                                sdg: "SDG 15",
                                sdgLabel: "Life on Land",
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/[0.04] backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-rice-gold/40 hover:bg-white/[0.08] transition-all luxury-card-dark flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 bg-rice-gold/20 text-rice-gold rounded-2xl flex items-center justify-center mb-6">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">{item.description}</p>
                                </div>
                                <div className="inline-flex items-center gap-2 bg-white/10 text-rice-gold-light px-3.5 py-1.5 rounded-full text-xs font-bold w-fit border border-white/10">
                                    <span>{item.sdg}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30"></span>
                                    <span className="font-normal text-white/80">{item.sdgLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Participate */}
            <section className="py-16 container mx-auto px-6 max-w-7xl">
                <SectionTitle
                    badge="Delegation Profile"
                    title="Who Can Participate"
                    subtitle="ORP-5 welcomes diverse stakeholders from across scientific, agricultural, policy, and industry spectrums."
                    centered
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {[
                        { icon: <Sprout size={24} />, title: "Scientists & Agronomists", description: "Researchers in organic agriculture, soil chemistry, plant genetics, and natural farming." },
                        { icon: <GraduationCap size={24} />, title: "Academicians & Faculty", description: "Educators from agricultural universities, state colleges, and global research institutions." },
                        { icon: <BookOpen size={24} />, title: "Students & Research Scholars", description: "Postgraduate and doctoral researchers exploring sustainable food systems." },
                        { icon: <Users size={24} />, title: "Farmers & FPO Leaders", description: "Progressive paddy producers and Farmer Producer Organizations driving ground-level adoption." },
                        { icon: <UserCheck size={24} />, title: "Extension Professionals", description: "Agricultural field officers and technology transfer specialists bridging research to fields." },
                        { icon: <Landmark size={24} />, title: "Policymakers & Regulators", description: "Government officials, international bodies, and agricultural ministry representatives." },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-3xl p-7 border border-earth-green/10 hover:border-rice-gold/50 shadow-sm hover:shadow-lg transition-all luxury-card group">
                            <div className="w-12 h-12 bg-earth-green/5 group-hover:bg-earth-green group-hover:text-rice-gold-light rounded-2xl flex items-center justify-center text-earth-green mb-5 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                            <p className="text-charcoal/70 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 1. Jointly Organised by */}
            <section className="py-16 bg-white border-t border-gray-200/60 container mx-auto px-6 max-w-6xl">
                <SectionTitle
                    title="Jointly organised by"
                    subtitle="Jointly convened by premier agricultural student leadership and leading international universities."
                    centered
                />

                <div className="space-y-6 mt-10">
                    {data.organizers?.map((org: any) => (
                        <div key={org.id} className="bg-[#FAF9F5] p-8 md:p-10 rounded-3xl border border-earth-green/10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left luxury-card">
                            {org.logoUrl && (
                                <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 flex items-center justify-center bg-white rounded-full p-4 shadow-md border border-gray-100/80">
                                    <img src={org.logoUrl} alt={org.name} className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{org.name}</h3>
                                {org.shortName && (
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-rice-gold-dark mb-3">
                                        {org.shortName}
                                    </span>
                                )}
                                <p className="text-charcoal/75 leading-relaxed text-sm sm:text-base font-light mb-4">{org.description}</p>
                                {org.website && (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earth-green hover:text-rice-gold transition-colors"
                                    >
                                        Visit Institution Website <ArrowRight size={13} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Supported by & Knowledge Partner (Dual Pillar) */}
            <section className="py-16 bg-[#FAF9F5] border-t border-earth-green/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                        
                        {/* Supported by Card */}
                        <div className="flex flex-col">
                            <SectionTitle
                                title="Supported by"
                                subtitle="National policy leadership and institutional patronage."
                            />
                            <div className="mt-6 flex-1 flex flex-col justify-between bg-white p-8 md:p-10 rounded-3xl border-2 border-rice-gold/30 shadow-md luxury-card relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-rice-gold/10 rounded-full blur-3xl pointer-events-none" />
                                {data.supportedBy?.[0] && (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-5 mb-6">
                                                {data.supportedBy[0].imageUrl && (
                                                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100">
                                                        <img
                                                            src={data.supportedBy[0].imageUrl}
                                                            alt={data.supportedBy[0].name}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-serif font-bold text-charcoal leading-snug">
                                                        {data.supportedBy[0].name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className="text-charcoal/75 text-sm sm:text-base leading-relaxed font-light mb-6">
                                                {data.supportedBy[0].description}
                                            </p>
                                        </div>
                                        {data.supportedBy[0].website && (
                                            <a
                                                href={data.supportedBy[0].website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth-green hover:text-rice-gold transition-colors pt-4 border-t border-gray-100"
                                            >
                                                Visit Ministry Portal <ArrowRight size={13} />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Knowledge Partner Card */}
                        <div className="flex flex-col">
                            <SectionTitle
                                title="Knowledge partner"
                                subtitle="International scientific guidance and rice innovation."
                            />
                            <div className="mt-6 flex-1 flex flex-col justify-between bg-white p-8 md:p-10 rounded-3xl border-2 border-earth-green/20 shadow-md luxury-card relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-earth-green/10 rounded-full blur-3xl pointer-events-none" />
                                {data.knowledgePartner?.[0] && (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-5 mb-6">
                                                {data.knowledgePartner[0].imageUrl && (
                                                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100">
                                                        <img
                                                            src={data.knowledgePartner[0].imageUrl}
                                                            alt={data.knowledgePartner[0].name}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-serif font-bold text-charcoal leading-snug">
                                                        {data.knowledgePartner[0].name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className="text-charcoal/75 text-sm sm:text-base leading-relaxed font-light mb-6">
                                                {data.knowledgePartner[0].description}
                                            </p>
                                        </div>
                                        {data.knowledgePartner[0].website && (
                                            <a
                                                href={data.knowledgePartner[0].website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth-green hover:text-rice-gold transition-colors pt-4 border-t border-gray-100"
                                            >
                                                Visit IRRI Official Website <ArrowRight size={13} />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. Technical Collaborating Partners */}
            {((data.technicalPartners && data.technicalPartners.length > 0) || (data.partners && data.partners.length > 0)) && (
                <section className="py-16 bg-white border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <SectionTitle
                            title="Technical collaborating partners"
                            subtitle="Strategic technical allies across agricultural universities, soil mineral innovators, and scientific publishing."
                            centered
                        />


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10">
                            {(data.technicalPartners || data.partners).map((partner: any, idx: number) => (
                                <div
                                    key={partner.id || idx}
                                    className="bg-[#FAF9F5] p-7 md:p-8 rounded-3xl border border-earth-green/10 flex flex-col justify-between hover:border-rice-gold/50 shadow-sm hover:shadow-md transition-all luxury-card group"
                                >
                                    <div>
                                        <div className="flex items-center gap-4 mb-5">
                                            {partner.imageUrl ? (
                                                <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                                                    <img
                                                        src={partner.imageUrl}
                                                        alt={partner.name}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 bg-earth-green/10 rounded-2xl flex items-center justify-center text-earth-green">
                                                    <Globe2 size={24} />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-serif font-bold text-base md:text-lg text-charcoal leading-snug">
                                                    {partner.name}
                                                </h4>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-earth-green/80 block mt-0.5">
                                                    Technical Collaborator
                                                </span>
                                            </div>
                                        </div>
                                        {partner.subtitle && (
                                            <p className="text-xs font-semibold text-earth-green mb-2">
                                                {partner.subtitle}
                                            </p>
                                        )}
                                        <p className="text-charcoal/70 text-xs sm:text-sm leading-relaxed font-light mb-6">
                                            {partner.description}
                                        </p>
                                    </div>
                                    {partner.website && (
                                        <a
                                            href={partner.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-green group-hover:text-rice-gold transition-colors pt-4 border-t border-gray-200/60"
                                        >
                                            Explore Website <ArrowRight size={13} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}



            {/* CTA Band */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Join The Deliberation
                        </span>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                            Submit Your Abstract or Register as a Delegate
                        </h3>
                        <p className="text-white/70 text-sm">
                            Participate in 9 technical sessions, Scopus indexed proceedings, and 80+ national and global awards.
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center relative z-10 shrink-0">
                        <Link href="/submission">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Submit Abstract
                            </Button>
                        </Link>
                        <Link href="/registration">
                            <Button variant="glass" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Register Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
