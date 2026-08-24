"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Building2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import Script from "next/script";
import { getCode, getName } from 'country-list';

// Country flag emoji helper
function countryFlag(countryOrCode: string | null | undefined): string {
  if (!countryOrCode) return "🌐";

  const overrides: Record<string, string> = {
    "USA": "US",
    "United States": "US",
    "United States of America": "US",
    "UK": "GB",
    "United Kingdom": "GB",
    "Great Britain": "GB",
    "South Korea": "KR",
    "North Korea": "KP",
    "Russia": "RU",
    "Vietnam": "VN",
    "Taiwan": "TW",
    "Japan": "JP",
    "India": "IN",
    "Italy": "IT",
    "Brazil": "BR",
    "Spain": "ES",
  };

  let code = countryOrCode.trim().toUpperCase();
  if (code.length !== 2) {
    code = overrides[countryOrCode] || getCode(countryOrCode) || "";
  }

  if (!code || code.length !== 2) return "🌐";

  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🌐";
  }
}

function resolveCountryName(countryOrCode: string | null | undefined): string {
  if (!countryOrCode) return "";
  const trimmed = countryOrCode.trim();
  if (trimmed.length === 2) {
    return getName(trimmed.toUpperCase()) || trimmed.toUpperCase();
  }
  return trimmed;
}

// Speaker Card Component - Matches Committees MemberCard Exactly
function SpeakerCard({ speaker, type }: { speaker: any; type: string }) {
  const roleBadgeClass =
    type === 'keynote' ? "bg-earth-green text-rice-gold border-earth-green/20" :
    type === 'invited' ? "bg-amber-50 text-amber-800 border-amber-300" :
    "bg-earth-green/5 text-earth-green border-earth-green/15";

  const countryDisplay = resolveCountryName(speaker.country || speaker.countryCode);
  const flag = countryFlag(speaker.country || speaker.countryCode);

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-earth-green/10 flex flex-col justify-between luxury-card"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-earth-green via-rice-gold to-earth-green-deep flex-shrink-0" />

      <div className="p-7 flex flex-col items-center text-center flex-1 justify-between">
        <div className="flex flex-col items-center w-full">
          {/* Photo */}
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-2 ring-earth-green/15 group-hover:ring-earth-green/40 transition-all duration-300 bg-earth-green/5">
              {speaker.imageUrl ? (
                <img
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-earth-green/5 flex items-center justify-center text-earth-green font-serif font-bold text-2xl">
                  {speaker.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || "S"}
                </div>
              )}
            </div>
            {(speaker.country || speaker.countryCode) && (
              <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center shadow border border-gray-100" title={countryDisplay}>
                {flag}
              </span>
            )}
          </div>

          {/* Role badge */}
          {speaker.role && (
            <span className={`mb-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border ${roleBadgeClass}`}>
              {speaker.role}
            </span>
          )}

          {/* Name */}
          <h3 className="font-serif font-bold text-lg text-charcoal leading-snug mb-1 group-hover:text-earth-green transition-colors">
            {speaker.name}
          </h3>

          {/* Country */}
          {countryDisplay && (
            <p className="text-xs text-rice-gold-dark font-bold uppercase tracking-widest mb-3">
              {countryDisplay}
            </p>
          )}

          {/* Affiliation / Institution */}
          {speaker.institution && (
            <p className="text-charcoal/70 text-xs leading-relaxed font-light line-clamp-2">
              {speaker.institution}
            </p>
          )}
        </div>

        {/* Bottom Focus Area / Tags / Expertise */}
        {(speaker.focusArea || (speaker.tags && speaker.tags.length > 0) || speaker.expertise) && (
          <div className="mt-5 pt-3 border-t border-gray-100 w-full flex flex-wrap items-center justify-center gap-1.5">
            {speaker.focusArea && (
              <span className="inline-block bg-earth-green/5 text-earth-green text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-earth-green/10">
                {speaker.focusArea}
              </span>
            )}
            {speaker.tags && speaker.tags.map((tag: string) => (
              <span key={tag} className="inline-block bg-earth-green/5 text-earth-green text-[10px] font-bold px-2 py-0.5 rounded-md border border-earth-green/10">
                {tag}
              </span>
            ))}
            {speaker.expertise && (
              <p className="text-xs text-charcoal/70">
                Expertise: <strong className="text-charcoal font-semibold">{speaker.expertise}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpeakersClient({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || null);
  const [activeTab, setActiveTab] = useState<string>("KEYNOTE SPEAKERS");

  useEffect(() => {
    fetch(`/api/content/presenters?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData && Object.keys(jsonData).length > 0) {
          setData(jsonData);
        }
      })
      .catch((err) => console.error("Failed to fetch fresh speakers:", err));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
        <p className="text-earth-green/60 text-sm font-medium tracking-widest uppercase">Loading speakers…</p>
      </div>
    );
  }

  const keynotes = (data.keynotes || []).map((s: any) => ({ ...s, _type: 'keynote' }));
  const invited = (data.invited || []).map((s: any) => ({ ...s, _type: 'invited' }));
  const panel = (data.panel || []).map((s: any) => ({ ...s, _type: 'panel' }));

  const allSpeakers = [...keynotes, ...invited, ...panel];

  const currentList =
    activeTab === "KEYNOTE SPEAKERS" ? keynotes :
    activeTab === "INVITED SPEAKERS" ? invited :
    activeTab === "SCIENTIFIC PANEL" ? panel :
    allSpeakers;

  const tabs = [
    { label: "KEYNOTE SPEAKERS", count: keynotes.length },
    { label: "INVITED SPEAKERS", count: invited.length },
    { label: "SCIENTIFIC PANEL", count: panel.length },
    { label: "ALL SPEAKERS", count: allSpeakers.length },
  ].filter(t => t.count > 0 || t.label === "KEYNOTE SPEAKERS");

  const countriesInCurrentList: string[] = Array.from(
    new Set(
      currentList
        .map((s: any) => resolveCountryName(s.country || s.countryCode))
        .filter((c: any): c is string => typeof c === 'string' && c.length > 0)
    )
  );

  return (
    <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
      <Script id="speakers-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": allSpeakers.map((speaker: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
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
        })}
      </Script>

      <Navbar />

      <PageHero
        headline={data.hero?.headline || "Keynote & Invited Speakers"}
        subheadline={data.hero?.subheadline || "Learn from world-renowned experts, researchers, and policymakers shaping the future of organic and natural rice farming."}
        backgroundImage={data.hero?.backgroundImage}
        breadcrumb="Home / Speakers"
      />

      {/* Category Navigation Tabs */}
      <section className="sticky top-20 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-y border-earth-green/10 shadow-sm py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {tabs.map((t) => (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.label)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                  activeTab === t.label
                    ? "bg-earth-green text-rice-gold shadow-md ring-2 ring-earth-green/20"
                    : "bg-white text-charcoal/70 border border-gray-200 hover:border-earth-green/40 hover:text-earth-green"
                }`}
              >
                {t.label} {t.count > 0 && <span className="ml-1 opacity-70">({t.count})</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-14 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-charcoal">{activeTab}</h2>
            <p className="text-charcoal/60 text-xs font-medium uppercase tracking-wider mt-1">
              {currentList.length} distinguished {activeTab === "SCIENTIFIC PANEL" ? "members" : "speakers"}{" "}
              {countriesInCurrentList.length > 0 && `across ${countriesInCurrentList.length} countries`}
            </p>
          </div>

          {/* Country flag chips */}
          {countriesInCurrentList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {countriesInCurrentList.map((country: string) => (
                <span
                  key={country}
                  className="inline-flex items-center gap-1.5 bg-white border border-earth-green/15 text-charcoal text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                >
                  {countryFlag(country)} {country}
                </span>
              ))}
            </div>
          )}
        </div>

        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentList.map((speaker: any) => (
              <SpeakerCard
                key={speaker.id || speaker.name}
                speaker={speaker}
                type={speaker._type || 'keynote'}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-earth-green/20 bg-white rounded-3xl p-20 text-center luxury-card">
            <h3 className="text-xl font-serif font-bold text-charcoal mb-2">To Be Announced</h3>
            <p className="text-charcoal/60 text-sm">Distinguished speakers for this track will be announced shortly.</p>
          </div>
        )}
      </section>

      {/* Global Participation CTA */}
      <section className="py-14 container mx-auto px-6 max-w-6xl">
        <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
              Global Participation
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Join 500+ Leading Delegates at ORP-5
            </h3>
            <p className="text-white/70 text-sm">
              Engage with our international keynote speakers and global delegates in New Delhi.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link href="/registration">
              <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                Register as Delegate <ArrowRight size={15} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
