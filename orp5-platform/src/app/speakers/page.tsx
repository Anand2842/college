import { createPageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
    title: 'Keynote & Invited Speakers',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/speakers',
});

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { getSpeakersPageData } from "@/lib/cms";
import { Globe, Award, Sparkles, Building2 } from "lucide-react";
import Script from "next/script";

export default async function SpeakersPage() {
    const data = await getSpeakersPageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Speakers"
            />
            
            <Script id="speakers-schema" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": [
                        ...(data.keynotes || []).map((speaker: any, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Person",
                                "name": speaker.name,
                                "jobTitle": speaker.role,
                                "affiliation": {
                                    "@type": "Organization",
                                    "name": speaker.institution
                                }
                            }
                        })),
                        ...(data.invited || []).map((speaker: any, index: number) => ({
                            "@type": "ListItem",
                            "position": (data.keynotes?.length || 0) + index + 1,
                            "item": {
                                "@type": "Person",
                                "name": speaker.name,
                                "jobTitle": speaker.role,
                                "affiliation": {
                                    "@type": "Organization",
                                    "name": speaker.institution || ""
                                }
                            }
                        }))
                    ]
                })}
            </Script>


            {/* Keynote Speakers */}
            <section className="py-14 container mx-auto px-6 max-w-7xl">
                <SectionTitle
                    badge="Plenary Addresses"
                    title="Keynote Speakers"
                    subtitle="Eminent scientists, policymakers, and international agricultural leaders delivering plenary keynote addresses."
                    centered
                />

                <div className="flex flex-wrap justify-center gap-8 mt-12">
                    {data.keynotes.map((speaker: any) => (
                        <div 
                            key={speaker.id} 
                            className="w-full max-w-[380px] group bg-white rounded-3xl p-8 border border-earth-green/10 hover:border-earth-green/30 shadow-sm hover:shadow-xl transition-all duration-500 luxury-card flex flex-col items-center text-center relative shrink-0"
                        >
                            {/* Flag / Country Badge */}
                            {(speaker.country || speaker.countryCode) && (
                                <div className="absolute top-5 right-5 z-20 px-3 py-1.5 bg-[#FAF9F5] rounded-xl text-xs font-bold text-charcoal shadow-sm border border-earth-green/10 flex items-center gap-2">
                                    <span className="text-base leading-none">{getFlagEmoji(speaker.country || speaker.countryCode)}</span>
                                    <span className="uppercase text-[10px] tracking-widest">{speaker.country || speaker.countryCode}</span>
                                </div>
                            )}

                            {/* Speaker Image */}
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden mb-6 border border-earth-green/10 shadow-sm relative shrink-0 group-hover:-translate-y-2 transition-transform duration-500 bg-earth-green/5">
                                {speaker.imageUrl ? (
                                    <img 
                                        src={speaker.imageUrl} 
                                        alt={speaker.name} 
                                        className="w-full h-full object-cover object-top" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-earth-green/40 font-serif font-bold text-5xl">
                                        {speaker.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Speaker Details */}
                            <div className="flex-1 flex flex-col justify-between w-full">
                                <div>
                                    <p className="text-earth-green text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
                                        {speaker.role}
                                    </p>
                                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-4 group-hover:text-earth-green transition-colors">
                                        {speaker.name}
                                    </h3>
                                    
                                    {speaker.institution && (
                                        <div className="flex flex-col items-center gap-1.5 text-charcoal/70 text-sm font-medium mb-6">
                                            <Building2 size={16} className="text-rice-gold" />
                                            <span className="leading-relaxed">{speaker.institution}</span>
                                        </div>
                                    )}
                                </div>

                                {speaker.focusArea && (
                                    <div className="pt-6 border-t border-earth-green/5 mt-auto">
                                        <span className="inline-block bg-earth-green/5 text-earth-green text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl">
                                            {speaker.focusArea}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Invited Speakers */}
            {data.invited && data.invited.length > 0 && (
                <section className="py-16 bg-white border-t border-gray-200/60">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <SectionTitle
                            badge="Invited Faculty"
                            title="Distinguished Invited Speakers"
                            subtitle="Leading researchers presenting domain-specific insights across technical conference tracks."
                            centered
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                            {data.invited.map((speaker: any) => (
                                <div 
                                    key={speaker.id} 
                                    className="bg-[#FAF9F5] rounded-3xl p-6 text-center border border-earth-green/10 hover:border-rice-gold/40 shadow-sm hover:shadow-lg transition-all duration-300 luxury-card group flex flex-col items-center justify-between"
                                >
                                    <div className="w-full flex flex-col items-center">
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 bg-gray-200 border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                                            {speaker.imageUrl ? (
                                                <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-earth-green/10 flex items-center justify-center text-earth-green font-bold text-xl">
                                                    {speaker.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            {(speaker.country || speaker.countryCode) && (
                                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center text-xs border border-gray-100">
                                                    {getFlagEmoji(speaker.country || speaker.countryCode)}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-serif font-bold text-charcoal text-base mb-1">{speaker.name}</h3>
                                        <p className="text-xs text-earth-green font-bold mb-2">{speaker.role}</p>
                                        {speaker.institution && (
                                            <p className="text-[11px] text-charcoal/60 line-clamp-2 mb-3">{speaker.institution}</p>
                                        )}
                                    </div>

                                    {speaker.tags && speaker.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                                            {speaker.tags.map((tag: string) => (
                                                <span key={tag} className="inline-block bg-earth-green/5 text-earth-green text-[10px] font-bold px-2 py-0.5 rounded-md border border-earth-green/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Scientific & Peer Review Panel */}
            {data.panel && data.panel.length > 0 && (
                <section className="py-16 container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Peer Review"
                        title="Scientific Advisory & Review Panel"
                        subtitle="Eminent peer reviewers ensuring stringent scientific standards for accepted abstracts and Scopus papers."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {data.panel.map((member: any) => (
                            <div key={member.id} className="p-6 rounded-3xl bg-white border border-earth-green/10 shadow-sm hover:shadow-md transition-all">
                                <h4 className="font-serif font-bold text-charcoal text-lg mb-1">{member.name}</h4>
                                <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-2">{member.role}</p>
                                <p className="text-xs text-charcoal/70">Expertise: <strong className="text-charcoal font-semibold">{member.expertise}</strong></p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}

function getFlagEmoji(countryCode: string | null | undefined) {
    if (!countryCode) return "";
    try {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    } catch (e) {
        return "";
    }
}
