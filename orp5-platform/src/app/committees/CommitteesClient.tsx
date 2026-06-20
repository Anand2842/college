"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Globe, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { getCode } from 'country-list';

// Country flag emoji helper
function countryFlag(country: string): string {
  // Common alternative names that might not exactly match the official ISO list
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

  // Try to find the exact ISO 3166-1 alpha-2 code
  const code = overrides[country] || getCode(country);
  
  // Fallback to globe if country is not found
  if (!code) return "🌐";

  // Convert 2-letter ISO code to regional indicator symbol emojis
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
    
  return String.fromCodePoint(...codePoints);
}

// Animated counter
function AnimatedNumber({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-white mb-1">{count}+</div>
      <div className="text-emerald-200 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  );
}

// Member card component
function MemberCard({ member, index }: { member: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Role badge style
  const roleBadgeClass = !member.role ? "" :
    /patron/i.test(member.role)    ? "bg-amber-50 text-amber-700 border-amber-300" :
    /convenor|convener|chair/i.test(member.role) ? "bg-earth-green text-white border-earth-green" :
    /secretary/i.test(member.role) ? "bg-teal-50 text-teal-700 border-teal-300" :
    /editor|publication/i.test(member.role) ? "bg-violet-50 text-violet-700 border-violet-300" :
    "bg-gray-50 text-gray-500 border-gray-200";

  // First email only (the primary one)
  const primaryEmail = member.email ? member.email.split("|")[0].trim() : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-0.5 border border-gray-100 flex flex-col"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-earth-green via-sapling-green to-rice-gold flex-shrink-0" />

      <div className="p-6 flex flex-col items-center text-center flex-1">

        {/* Photo */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-earth-green/15 group-hover:ring-earth-green/40 transition-all duration-300">
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>
          {/* Country flag only — no text */}
          {member.country && (
            <span className="absolute -bottom-1 -right-1 text-base bg-white rounded-full w-6 h-6 flex items-center justify-center shadow border border-gray-100">
              {countryFlag(member.country)}
            </span>
          )}
        </div>

        {/* Role badge */}
        {member.role && (
          <span className={`mb-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border ${roleBadgeClass}`}>
            {member.role}
          </span>
        )}

        {/* Name */}
        <h3 className="font-serif font-bold text-lg text-charcoal leading-snug mb-1 group-hover:text-earth-green transition-colors">
          {member.name}
        </h3>

        {/* Country */}
        {member.country && (
          <p className="text-xs text-sapling-green font-semibold uppercase tracking-widest mb-3">
            {member.country}
          </p>
        )}

        {/* Affiliation — full text visible */}
        <p className="text-charcoal/75 text-sm leading-relaxed flex-1">
          {member.affiliation}
        </p>

        {/* Email — shown as plain visible text */}
        {primaryEmail && (
          <a
            href={`mailto:${primaryEmail}`}
            className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs text-charcoal/60 hover:text-earth-green transition-colors break-all"
          >
            <Mail size={10} className="flex-shrink-0" />
            <span>{primaryEmail}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function CommitteesClient() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    fetch("/api/content/committees")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        if (jsonData.committees?.length > 0) {
          setActiveTab(jsonData.committees[0].label);
        }
      });
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-earth-green" size={40} />
        <p className="text-earth-green/60 text-sm font-medium tracking-widest uppercase">Loading committees…</p>
      </div>
    );

  const currentCommittee = data.committees.find((c: any) => c.label === activeTab);

  // Compute stats
  const allMembers = data.committees.flatMap((c: any) => c.members);
  const countries = new Set(allMembers.map((m: any) => m.country).filter(Boolean));
  const institutions = allMembers.length;

  return (
    <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[520px] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          {data.hero.backgroundImage && (
            <img
              src={data.hero.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-earth-green/95 via-earth-green/80 to-black/70" />
          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-rice-gold/20 border border-rice-gold/40 text-rice-gold text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
              5th International Conference · ORP-5
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
          >
            Scientific &{" "}
            <span className="text-rice-gold">Organizing</span>
            <br />
            Committees
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Guided by distinguished scientists, academics, and policy experts from leading institutions across the globe.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="inline-flex items-center gap-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-10 py-6"
          >
            <AnimatedNumber target={institutions} label="Experts" />
            <div className="w-px h-10 bg-white/20" />
            <AnimatedNumber target={countries.size} label="Countries" />
            <div className="w-px h-10 bg-white/20" />
            <AnimatedNumber target={data.committees.length} label="Committees" />
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FFFDF7" />
          </svg>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────── */}
      <section className="py-16 container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-earth-green/8 text-earth-green text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-earth-green/15">
            <Globe size={12} />
            International Scientific Community
          </div>
          <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
            {data.intro.description}
          </p>
        </motion.div>
      </section>

      {/* ── TAB NAV ─────────────────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-2 py-3">
            {data.committees.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.label)}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 border ${
                  activeTab === c.label
                    ? "bg-earth-green text-white border-earth-green shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-earth-green/50 hover:text-earth-green"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERS GRID ────────────────────────────────────── */}
      <section className="py-16 container mx-auto px-6 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab header */}
            <div className="flex items-center gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal">{activeTab}</h2>
                {currentCommittee?.members && (
                  <p className="text-gray-400 text-sm mt-1">
                    {currentCommittee.members.length} members from{" "}
                    {new Set(currentCommittee.members.map((m: any) => m.country).filter(Boolean)).size} countries
                  </p>
                )}
              </div>
            </div>

            {/* Country filter chips */}
            {currentCommittee?.members && currentCommittee.members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {[...new Set(currentCommittee.members.map((m: any) => m.country).filter(Boolean))].map(
                  (country: any) => (
                    <span
                      key={country}
                      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                    >
                      {countryFlag(country)} {country}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Grid */}
            {currentCommittee?.members && currentCommittee.members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCommittee.members.map((member: any, idx: number) => (
                  <MemberCard key={member.id} member={member} index={idx} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-rice-gold/40 bg-rice-gold/5 rounded-2xl p-20 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-rice-gold/80 mb-2">To Be Announced</h3>
                <p className="text-gray-400 text-sm">Committee members will be listed here soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── CONTACTS ────────────────────────────────────────── */}
      {data.contacts && data.contacts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-[#FFFDF7] to-gray-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-3">Committee Contacts</h2>
              <p className="text-gray-500">For inquiries, please reach out to the relevant contacts below.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.contacts.map((contact: any, idx: number) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-earth-green/30 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-earth-green/20 mb-4 group-hover:border-earth-green/50 transition-colors shadow-md">
                    {contact.imageUrl ? (
                      <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-earth-green/10 flex items-center justify-center text-earth-green/40">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-charcoal mb-1">{contact.name}</h4>
                  {contact.role && (
                    <p className="text-xs text-earth-green font-semibold uppercase tracking-wide mt-1">{contact.role}</p>
                  )}
                  {contact.phone && (
                    <p className="flex items-center gap-1.5 justify-center text-charcoal/60 text-xs mt-2">
                      <span className="text-earth-green font-bold">Tel:</span>
                      {contact.phone}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ADVISORY NOTE ───────────────────────────────────── */}
      <section className="py-16 container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-earth-green to-[#0D3020] rounded-3xl p-10 md:p-14 text-center overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sapling-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rice-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/20">
              <Globe size={12} />
              Scientific Oversight
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              International Scientific Committee &<br />Organizing Committees
            </h2>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
              ORP-5 is guided by an International Scientific Committee consisting of distinguished experts from India and
              abroad, along with Organizing and Local Committees responsible for conference coordination, academic
              quality, and logistical management, as detailed in the official conference brochure.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── CTA FOOTER ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-earth-green via-[#1e5c38] to-earth-green py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-emerald-200/60 text-xs font-bold uppercase tracking-[0.2em] mb-4">Explore ORP-5</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-10">
            Themes, Programme &amp; Registration
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/themes">
              <Button className="bg-rice-gold text-charcoal font-bold hover:bg-yellow-500 px-8 py-3 rounded-full shadow-lg">
                View Themes
              </Button>
            </Link>
            <Link href="/programme">
              <Button className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 font-bold px-8 py-3 rounded-full transition-all">
                See Programme
              </Button>
            </Link>
            <Link href="/registration">
              <Button className="bg-white text-earth-green font-bold hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg">
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
