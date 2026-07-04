import { createPageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';


export const metadata = createPageMetadata({
    title: 'Keynote & Invited Speakers',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/speakers',
});

// Force rebuild
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { getSpeakersPageData } from "@/lib/cms";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function SpeakersPage() {
    const data = await getSpeakersPageData();

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
            <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/60 font-medium">Loading...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            <PageHero
                headline={data.hero.headline}
                subheadline={data.hero.subheadline}
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Speakers"
            />

            {/* Intro Section - Beige with Gold Accent */}
            <section className="py-20 container mx-auto px-6 max-w-5xl">
                <div className="border-l-4 border-rice-gold pl-8 md:pl-12 py-2">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4 max-w-lg">
                        {data.intro.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* Keynote Speakers */}
            <section className="py-12 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Our Esteemed Keynote Speakers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.keynotes.map((speaker: any) => (
                        <div key={speaker.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#DFC074] mx-auto bg-gray-200 group-hover:border-[#1A4D2E] transition-colors">
                                    {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" /> : null}
                                </div>
                                {(speaker.country || speaker.countryCode) && (
                                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl border border-gray-100">
                                        {getFlagEmoji(speaker.country || speaker.countryCode)}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold font-serif text-charcoal mb-1">{speaker.name}</h3>
                            <p className="text-sm font-bold text-[#1A4D2E] mb-3">{speaker.role}</p>
                            {speaker.institution && (
                                <div className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full mb-4 border border-gray-100">
                                    <span className="text-[10px] font-bold text-[#D9A648] bg-[#1A4D2E] w-5 h-5 rounded-full flex items-center justify-center">
                                        {speaker.institution.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                    </span>
                                    <span className="text-xs text-gray-600">{speaker.institution}</span>
                                </div>
                            )}
                            {speaker.focusArea && (
                                <span className="inline-block bg-[#FFF8E1] text-[#B8860B] text-xs font-semibold px-3 py-1 rounded-full border border-[#DFC074]/20">
                                    {speaker.focusArea}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Invited Speakers */}
            {data.invited && data.invited.length > 0 && (
                <section className="py-20 bg-[#FFFDF7]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Distinguished Invited Speakers</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {data.invited.map((speaker: any) => (
                                <div key={speaker.id} className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:border-[#D9A648]/30 hover:shadow-md transition-all group">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-gray-200 border-2 border-gray-100 group-hover:border-[#DFC074] transition-colors">
                                            {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        {(speaker.country || speaker.countryCode) && (
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center text-sm border border-gray-100">
                                                {getFlagEmoji(speaker.country || speaker.countryCode)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-charcoal mb-1">{speaker.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{speaker.role}</p>
                                    {speaker.tags?.map((tag: string) => (
                                        <span key={tag} className="inline-block bg-[#F0FDF4] text-[#1A4D2E] text-[10px] font-semibold px-2 py-1 rounded-md border border-[#1A4D2E]/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Scientific Panel */}
            {data.panel && data.panel.length > 0 && (
                <section className="py-20 container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Scientific & Peer Review Panel</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.panel.map((member: any) => (
                            <div key={member.id} className="border border-rice-gold rounded-xl p-6 bg-white hover:bg-rice-gold/5 transition-colors">
                                <h4 className="font-bold text-charcoal text-lg mb-1">{member.name}</h4>
                                <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                                <p className="text-xs text-gray-400">Expertise: <span className="text-gray-600">{member.expertise}</span></p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Call for Speakers CTA */}
            <section className="py-12 container mx-auto px-6 max-w-5xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-charcoal">Interested in Speaking?</h3>
                        <p className="text-gray-500 text-sm mt-1">Submit your proposal for consideration in future events. Limited slots available.</p>
                    </div>
                    <Link href="/submission">
                        <button className="bg-rice-gold hover:bg-yellow-500 text-charcoal font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-transform hover:-translate-y-1">
                            Submit Proposal <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </section>

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
