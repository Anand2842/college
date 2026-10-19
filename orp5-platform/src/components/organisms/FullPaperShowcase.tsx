"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  BookOpen,
  Globe,
  Award,
  ArrowRight,
  ExternalLink,
  Mail,
  CheckCircle2,
  Clock,
  Euro
} from "lucide-react";

export function FullPaperShowcase() {
  return (
    <section className="relative py-12 md:py-16 bg-[#FAF9F5] overflow-hidden border-b border-earth-green/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rice-gold/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-earth-green/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="bg-gradient-to-br from-[#123125] via-[#1a4334] to-[#123125] text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl border border-rice-gold/25 relative overflow-hidden">
          {/* Subtle watermark badge */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-rice-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill / Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-rice-gold/40 backdrop-blur-md text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-rice-gold-light">
              <Sparkles size={14} className="text-rice-gold animate-pulse" />
              SCOPUS Indexed Proceedings • Bio Web of Conferences
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
              <Clock size={14} className="text-amber-300 shrink-0" />
              <span>Submission Deadline: <strong>31 October 2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading and Description */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Invitation to Submit Full-Length Articles
              </h2>

              <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed">
                The ORP-5 Organizers have partnered with France-based{" "}
                <strong className="text-white font-semibold">EDP Sciences – Web of Conferences</strong>{" "}
                to publish selected research and review papers presented at the conference in{" "}
                <strong className="text-rice-gold-light font-semibold">Bio Web of Conferences</strong>{" "}
                (Peer-Reviewed & SCOPUS-Indexed).
              </p>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <CheckCircle2 size={16} className="text-rice-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Selected 50 Articles</span>
                    <span className="text-white/70">Processed by International Editorial Board</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Euro size={16} className="text-rice-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Zero Upfront Submission Fee</span>
                    <span className="text-white/70">Contributory fee (~€50 / ₹6,000) payable strictly upon acceptance</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <BookOpen size={16} className="text-rice-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Review & Research Formats</span>
                    <span className="text-white/70">Complete technical layout guidelines available</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Globe size={16} className="text-rice-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Global SCOPUS Indexing</span>
                    <span className="text-white/70">Indexed in Scopus & global academic repositories</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Action Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-rice-gold font-bold block mb-1">
                  Official Circular • F.No. 3-1/ORP-5/2025
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2">
                  Paper Submission & Guidelines
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Submit full-length manuscripts (up to 25 MB). Submissions are evaluated by the International Editorial Board before acceptance.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <Link href="/guidelines/submit" className="block w-full">
                  <Button
                    variant="premium"
                    size="lg"
                    className="w-full text-xs uppercase tracking-wider font-bold py-3.5 flex items-center justify-center gap-2 shadow-xl bg-rice-gold hover:bg-rice-gold-light text-charcoal"
                  >
                    <Sparkles size={16} />
                    Submit Paper for Peer Review
                    <ArrowRight size={15} />
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link href="/guidelines?tab=overview" className="block w-full">
                    <Button
                      variant="glass"
                      size="default"
                      className="w-full text-[11px] uppercase tracking-wider font-bold py-2.5 flex items-center justify-center gap-1.5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <FileText size={14} />
                      Guidelines
                    </Button>
                  </Link>

                  <a
                    href="/documents/ORP5_Full_Length_Paper_Guidelines.pdf"
                    download="Guidelines_4_full_length_paper_ORP_5.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      variant="glass"
                      size="default"
                      className="w-full text-[11px] uppercase tracking-wider font-bold py-2.5 flex items-center justify-center gap-1.5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <Download size={14} />
                      PDF Circular
                    </Button>
                  </a>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-[11px] text-white/60 flex items-center justify-between">
                <span>Editors: India • Italy • Japan</span>
                <span className="text-rice-gold-light font-medium">Final Deadline: 31 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
