"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Globe, MapPin, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { getCode } from 'country-list';

// Country flag emoji helper
function countryFlag(country: string): string {
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
  };

  const code = overrides[country] || getCode(country);
  if (!code) return "🌐";

  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
    
  return String.fromCodePoint(...codePoints);
}

// Member card component
function MemberCard({ member, index }: { member: any; index: number }) {
  const roleBadgeClass = !member.role ? "" :
    /patron/i.test(member.role)    ? "bg-amber-50 text-amber-800 border-amber-300" :
    /convenor|convener|chair/i.test(member.role) ? "bg-earth-green text-white border-earth-green" :
    /secretary/i.test(member.role) ? "bg-teal-50 text-teal-800 border-teal-300" :
    /editor|publication/i.test(member.role) ? "bg-violet-50 text-violet-800 border-violet-300" :
    "bg-earth-green/5 text-earth-green border-earth-green/15";

  const primaryEmail = member.email ? member.email.split("|")[0].trim() : null;

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-earth-green/10 flex flex-col justify-between luxury-card"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-earth-green via-rice-gold to-earth-green-deep flex-shrink-0" />

      <div className="p-7 flex flex-col items-center text-center flex-1 justify-between">
        <div className="flex flex-col items-center">
          {/* Photo */}
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-2 ring-earth-green/15 group-hover:ring-earth-green/40 transition-all duration-300">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-earth-green/5 flex items-center justify-center text-earth-green font-serif font-bold text-2xl">
                  {member.name?.charAt(0)}
                </div>
              )}
            </div>
            {member.country && (
              <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center shadow border border-gray-100">
                {countryFlag(member.country)}
              </span>
            )}
          </div>

          {/* Role badge */}
          {member.role && (
            <span className={`mb-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border ${roleBadgeClass}`}>
              {member.role}
            </span>
          )}

          {/* Name */}
          <h3 className="font-serif font-bold text-lg text-charcoal leading-snug mb-1 group-hover:text-earth-green transition-colors">
            {member.name}
          </h3>

          {/* Country */}
          {member.country && (
            <p className="text-xs text-rice-gold-dark font-bold uppercase tracking-widest mb-3">
              {member.country}
            </p>
          )}

          {/* Affiliation */}
          <p className="text-charcoal/70 text-xs leading-relaxed font-light">
            {member.affiliation}
          </p>
        </div>

        {/* Email */}
        {primaryEmail && (
          <a
            href={`mailto:${primaryEmail}`}
            className="mt-5 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs text-charcoal/60 hover:text-earth-green transition-colors break-all"
          >
            <Mail size={12} className="flex-shrink-0 text-earth-green" />
            <span>{primaryEmail}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function CommitteesClient({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || null);
  const [activeTab, setActiveTab] = useState<string>(
    initialData?.committees?.[0]?.label || ""
  );

  useEffect(() => {
    fetch(`/api/content/committees?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData && Object.keys(jsonData).length > 0) {
          setData(jsonData);
          if (jsonData.committees && jsonData.committees.length > 0) {
            setActiveTab((prev) => {
              const exists = jsonData.committees.some((c: any) => c.label === prev);
              return exists && prev ? prev : jsonData.committees[0].label;
            });
          }
        }
      })
      .catch((err) => console.error("Failed to fetch fresh committees:", err));
  }, []);

  if (!data || !data.committees)
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
        <p className="text-earth-green/60 text-sm font-medium tracking-widest uppercase">Loading committees…</p>
      </div>
    );

  const currentCommittee = data.committees?.find((c: any) => c.label === activeTab) || data.committees?.[0];
  const allMembers = data.committees?.flatMap((c: any) => c.members || []) || [];

  return (
    <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
      <Script id="committees-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": allMembers.map((member: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Person",
              "name": member.name,
              "jobTitle": member.role,
              "affiliation": {
                "@type": "Organization",
                "name": member.affiliation || ""
              }
            }
          }))
        })}
      </Script>
      <Navbar />

      <PageHero
        headline="Scientific & Organizing Committees"
        subheadline="Guided by distinguished agronomists, policy directors, and research fellows from premier institutions globally."
        backgroundImage={data.hero?.backgroundImage}
        breadcrumb="Home / Committees"
      />



      {/* Committee Category Navigation Tabs */}
      <section className="sticky top-20 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-y border-earth-green/10 shadow-sm py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {data.committees.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.label)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                  activeTab === c.label
                    ? "bg-earth-green text-rice-gold shadow-md ring-2 ring-earth-green/20"
                    : "bg-white text-charcoal/70 border border-gray-200 hover:border-earth-green/40 hover:text-earth-green"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-14 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-charcoal">{activeTab}</h2>
            {currentCommittee?.members && (
              <p className="text-charcoal/60 text-xs font-medium uppercase tracking-wider mt-1">
                {currentCommittee.members.length} distinguished members across{" "}
                {new Set(currentCommittee.members.map((m: any) => m.country).filter(Boolean)).size} countries
              </p>
            )}
          </div>

          {/* Country flag chips */}
          {currentCommittee?.members && currentCommittee.members.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[...new Set(currentCommittee.members.map((m: any) => m.country).filter(Boolean))].map(
                (country: any) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1.5 bg-white border border-earth-green/15 text-charcoal text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                  >
                    {countryFlag(country)} {country}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {currentCommittee?.members && currentCommittee.members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCommittee.members.map((member: any, idx: number) => (
              <MemberCard key={member.id} member={member} index={idx} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-earth-green/20 bg-white rounded-3xl p-20 text-center luxury-card">
            <h3 className="text-xl font-serif font-bold text-charcoal mb-2">To Be Announced</h3>
            <p className="text-charcoal/60 text-sm">Committee appointments are currently being ratified by the secretariat.</p>
          </div>
        )}
      </section>

      {/* Committee Contacts Desk */}
      {data.contacts && data.contacts.length > 0 && (
        <section className="py-16 bg-white border-y border-gray-200/60">
          <div className="container mx-auto px-6 max-w-6xl">
            <SectionTitle
              badge="Secretariat"
              title="Committee Secretariat Contacts"
              subtitle="Direct contacts for protocol queries, technical tracks, and international delegate coordination."
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {data.contacts.map((contact: any, idx: number) => (
                <div
                  key={contact.id}
                  className="bg-[#FAF9F5] rounded-3xl p-8 border border-earth-green/10 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center luxury-card"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-earth-green/20 mb-4 shadow-md bg-white">
                    {contact.imageUrl ? (
                      <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-earth-green/5 flex items-center justify-center text-earth-green font-serif font-bold text-2xl">
                        {contact.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-charcoal mb-1">{contact.name}</h4>
                  {contact.role && (
                    <p className="text-xs text-earth-green font-semibold uppercase tracking-wider mt-1">{contact.role}</p>
                  )}
                  {contact.phone && (
                    <p className="text-charcoal/60 text-xs mt-2 font-medium">
                      Tel: {contact.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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
              Engage with our international committee members and global keynote speakers in New Delhi.
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
