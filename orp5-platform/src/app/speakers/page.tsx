
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Keynote & Invited Speakers | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

// Force rebuild
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { getSpeakersPageData } from "@/lib/cms";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function SpeakersPage() {
    const data = await getSpeakersPageData();

    if (!data) return <div className="p-10 text-center">Loading Speakers...</div>;

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
                        <div key={speaker.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rice-gold mx-auto bg-gray-200">
                                    {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" /> : null}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-serif text-charcoal mb-1">{speaker.name}</h3>
                            <p className="text-sm font-bold text-gray-500 mb-4">{speaker.role}</p>
                            <p className="text-xs text-gray-400 mb-4 px-4">{speaker.institution}</p>
                            <span className="inline-block bg-rice-gold/10 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                {speaker.focusArea}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Invited Speakers */}
            <section className="py-20 bg-[#FDFBF2]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Distinguished Invited Speakers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {data.invited.map((speaker: any) => (
                            <div key={speaker.id} className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:border-earth-green/30 transition-colors">
                                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                                    {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" /> : null}
                                </div>
                                <h3 className="font-bold text-charcoal mb-1">{speaker.name} {getFlagEmoji(speaker.country || speaker.countryCode)}</h3>
                                <p className="text-xs text-gray-500 mb-2">{speaker.role}</p>
                                {speaker.tags?.map((tag: string) => (
                                    <span key={tag} className="inline-block bg-sapling-green/10 text-earth-green text-[10px] font-semibold px-2 py-1 rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scientific Panel */}
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

            {/* Call for Speakers CTA */}
            <section className="py-12 container mx-auto px-6 max-w-5xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-charcoal">Interested in Speaking?</h3>
                        <p className="text-gray-500 text-sm mt-1">Submit your proposal for consideration in future events. Limited slots available.</p>
                    </div>
                    <Link href="/submission">
                        <button className="bg-rice-gold hover:bg-yellow-500 text-charcoal font-bold py-3 px-6 rounded-md shadow-md flex items-center gap-2 transition-transform hover:-translate-y-1">
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
