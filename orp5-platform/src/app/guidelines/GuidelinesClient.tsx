"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Button } from "@/components/atoms/Button";
import { FullPaperSubmissionForm } from "@/components/organisms/FullPaperSubmissionForm";
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
  Euro,
  AlertTriangle,
  Layers,
  FileCheck,
  ShieldAlert,
  Info,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GuidelinesClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"submit" | "overview" | "review" | "research" | "links">("submit");

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "overview" || tabParam === "review" || tabParam === "research" || tabParam === "links" || tabParam === "submit") {
      setActiveTab(tabParam as any);
    } else if (typeof window !== "undefined" && window.location.hash === "#guidelines") {
      setActiveTab("overview");
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
      <Navbar />

      <PageHero
        headline="Full-Length Paper Guidelines"
        subheadline="Official instructions for submission of selected full-length research and review articles for publication in Bio Web of Conferences (EDP Sciences, SCOPUS Indexed)."
        breadcrumb="Home / Publications / Paper Guidelines"
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-20 mt-8 md:mt-10 pb-24">
        {/* Top Executive Summary & Action Banner */}
        <div className="bg-[#0F2D21] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-[#DFC074]/30 mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-[#DFC074] border border-[#DFC074]/40 text-xs font-bold uppercase tracking-wider">
                  Bio Web of Conferences • EDP Sciences
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 text-xs font-medium">
                  SCOPUS Indexed Proceedings
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
                  Deadline: 31 October 2026
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                Publication of Selected Full-Length Articles
              </h2>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-light">
                The ORP-5 Organizers have partnered with France-based{" "}
                <strong className="text-white font-semibold">EDP Sciences – Web of Conferences</strong>{" "}
                to publish <strong>50 selected peer-reviewed articles</strong> in a dedicated open-access volume. Submissions undergo rigorous peer review by an international editorial team from India, Italy, and Japan.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs text-white/70">
                <span>Official Ref: <strong>F.No. 3-1/ORP-5/2025</strong></span>
                <span>•</span>
                <span>Dated: <strong>01 October 2026</strong></span>
                <span>•</span>
                <span>Managing Secretary: <strong>Prof. Y.V. Singh</strong></span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <Button
                variant="premium"
                size="lg"
                onClick={() => {
                  setActiveTab("submit");
                  document.getElementById("paper-form-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-xs uppercase tracking-wider font-bold py-3.5 px-6 flex items-center justify-center gap-2 shadow-lg whitespace-nowrap bg-[#DFC074] hover:bg-[#ebd290] text-[#123125] cursor-pointer"
              >
                <Sparkles size={16} />
                Submit Manuscript for Review
              </Button>

              <a
                href="/documents/ORP5_Full_Length_Paper_Guidelines.pdf"
                download="Guidelines_4_full_length_paper_ORP_5.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full text-xs uppercase tracking-wider font-bold py-3.5 px-6 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
                >
                  <Download size={16} />
                  Download Guidelines PDF
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Cohesive Academic Facts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Clock size={18} />
            </div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block">Submission Deadline</span>
            <span className="text-lg font-serif font-bold text-gray-900 mt-0.5 block">31 October 2026</span>
            <span className="text-xs text-gray-500 mt-1 block">Strict cutoff for peer review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Layers size={18} />
            </div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block">Proceedings Volume</span>
            <span className="text-lg font-serif font-bold text-gray-900 mt-0.5 block">Selected 50 Articles</span>
            <span className="text-xs text-gray-500 mt-1 block">Review & original research</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Euro size={18} />
            </div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block">Contributory Charge</span>
            <span className="text-lg font-serif font-bold text-gray-900 mt-0.5 block">€50 / ₹6,000</span>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">Payable only if accepted</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Globe size={18} />
            </div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block">Indexation</span>
            <span className="text-lg font-serif font-bold text-gray-900 mt-0.5 block">SCOPUS Indexed</span>
            <span className="text-xs text-gray-500 mt-1 block">EDP Sciences / Open Access</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div id="paper-form-section" className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab("submit")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2",
              activeTab === "submit"
                ? "border-[#0F2D21] text-[#0F2D21] bg-white rounded-t-xl shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <Sparkles size={15} className="text-[#DFC074]" />
            Submit Manuscript (Peer Review)
            <span className="px-2 py-0.5 rounded-full bg-[#0F2D21] text-white text-[10px] font-semibold">Max 25 MB</span>
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer",
              activeTab === "overview"
                ? "border-[#0F2D21] text-[#0F2D21] font-bold bg-white rounded-t-xl shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            Overview & Editorial Board
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer",
              activeTab === "review"
                ? "border-[#0F2D21] text-[#0F2D21] font-bold bg-white rounded-t-xl shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            A. Review Articles Format
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer",
              activeTab === "research"
                ? "border-[#0F2D21] text-[#0F2D21] font-bold bg-white rounded-t-xl shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            B. Research Papers Format
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={cn(
              "px-5 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer",
              activeTab === "links"
                ? "border-[#0F2D21] text-[#0F2D21] font-bold bg-white rounded-t-xl shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            Publisher Forms & Links
          </button>
        </div>

        {/* TAB 0: SUBMIT PAPER (FOR REVIEW) */}
        {activeTab === "submit" && (
          <div className="mb-12 animate-in fade-in duration-300">
            <FullPaperSubmissionForm />
          </div>
        )}


        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Editorial Board Card */}
            <div className="bg-white rounded-3xl p-8 border border-earth-green/15 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-charcoal mb-4 flex items-center gap-2.5">
                <Globe className="text-earth-green" size={22} />
                International Editorial Board
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed mb-6">
                The submissions will be evaluated, peer-reviewed, and edited by a distinguished team of international editors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">
                {[
                  { name: "Prof. Hari S. Gaur", role: "Editor", country: "India" },
                  { name: "Prof. Y.V. Singh", role: "Organizing Secretary & Editor", country: "India" },
                  { name: "Prof. Y.S. Shivay", role: "Editor", country: "India" },
                  { name: "Prof. Stefano Bocchi", role: "Editor", country: "Italy" },
                  { name: "Prof. Masakazu Komatsuzaki", role: "Editor", country: "Japan" },
                ].map((ed, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-earth-green/10">
                    <div className="w-10 h-10 mx-auto rounded-full bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs mb-2">
                      {ed.country === "Italy" ? "🇮🇹" : ed.country === "Japan" ? "🇯🇵" : "🇮🇳"}
                    </div>
                    <h4 className="font-bold text-sm text-charcoal">{ed.name}</h4>
                    <p className="text-xs text-charcoal/60 mt-0.5">{ed.role}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold text-rice-gold-dark bg-rice-gold/10 px-2 py-0.5 rounded-full">
                      {ed.country}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Submissions Requirements */}
            <div className="bg-white rounded-3xl p-8 border border-earth-green/15 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2.5">
                <FileCheck className="text-earth-green" size={22} />
                Mandatory Submission Requirements
              </h3>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-amber-950 mb-2">
                    <AlertTriangle size={18} className="text-amber-600" />
                    Plagiarism Check Report
                  </div>
                  <p className="text-amber-900/80 leading-relaxed">
                    Authors must conduct a certified Plagiarism Check prior to submission. Manuscripts exceeding acceptable similarity thresholds will be disqualified.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 mb-2">
                    <UserCheck size={18} className="text-earth-green" />
                    Prior Domain Peer Review
                  </div>
                  <p className="text-emerald-900/80 leading-relaxed">
                    Get your paper peer-reviewed by at least one independent expert in the same field who is not a co-author before transmitting to the Editors.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-red-950 mb-2">
                    <ShieldAlert size={18} className="text-red-600" />
                    Generative AI Policy
                  </div>
                  <p className="text-red-900/80 leading-relaxed">
                    Generative AI should not be used to create manuscripts. Any specific exploratory usage must be rigorously examined and explicitly disclosed in the declarations.
                  </p>
                </div>
              </div>

              {/* Publisher Compilation Timeline */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-gray-200">
                <h4 className="font-bold text-charcoal text-sm mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-earth-green" />
                  Publication Schedule & Deadlines
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-earth-green shrink-0">•</span>
                    <span><strong>31 October 2026:</strong> Hard deadline for authors to submit full camera-ready papers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-earth-green shrink-0">•</span>
                    <span><strong>November 2026:</strong> Editorial team peer review cycle (approx. 6 weeks).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-earth-green shrink-0">•</span>
                    <span><strong>15 December 2026:</strong> Final camera-ready compilation submission to EDP Sciences.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Submissions Contact Card */}
            <div className="bg-earth-green-deep text-white rounded-3xl p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-rice-gold font-bold block mb-1">
                  Ready to Submit?
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                  Transmit Your Camera-Ready Manuscript
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  Send your Word document (.doc/.docx), Plagiarism report, and Signed Publication Right Form to:
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs sm:text-sm">
                  <a href="mailto:organizingsecretary@orp5ic.com" className="text-rice-gold underline hover:text-white font-medium">
                    organizingsecretary@orp5ic.com
                  </a>
                  <span className="text-white/40">•</span>
                  <a href="mailto:info@orp5ic.com" className="text-rice-gold underline hover:text-white font-medium">
                    info@orp5ic.com
                  </a>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href="mailto:organizingsecretary@orp5ic.com?subject=ORP5%20Full%20Length%20Paper%20Submission"
                  className="inline-block"
                >
                  <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                    <Mail size={16} className="mr-2" />
                    Submit via Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEW ARTICLES FORMAT */}
        {activeTab === "review" && (
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-earth-green/15 shadow-sm space-y-8 animate-in fade-in duration-300">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-earth-green/10 text-earth-green text-xs font-bold uppercase tracking-wider mb-2">
                Format Section A
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                Review Articles — Technical Specifications
              </h3>
              <p className="text-sm text-charcoal/70 mt-1">
                Detailed requirements for systematic reviews, meta-analyses, and literature syntheses.
              </p>
            </div>

            {/* Layout Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Typography</span>
                <p className="font-bold text-charcoal text-sm">Times New Roman 11pt or 12pt</p>
                <p className="text-xs text-charcoal/60 mt-1">Standard font throughout</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Spacing & Margins</span>
                <p className="font-bold text-charcoal text-sm">1.5 Line Spacing</p>
                <p className="text-xs text-charcoal/60 mt-1">1-inch (2.54 cm) margins on A4</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Length Limits</span>
                <p className="font-bold text-charcoal text-sm">5,000 – 8,000 Words</p>
                <p className="text-xs text-charcoal/60 mt-1">Min 7 to Max 15 pages</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Line Numbers</span>
                <p className="font-bold text-earth-green text-sm">Mandatory Continuous</p>
                <p className="text-xs text-charcoal/60 mt-1">Turn on line numbering in MS Word</p>
              </div>
            </div>

            {/* Article Structure */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b pb-2">
                Standard Structure of a Review Article
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-charcoal/80">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">1. Title & Author Metadata:</strong>
                  Concise title stating the nature of the paper. Author names, institutional affiliations, ORCID IDs, and a clearly marked corresponding author (*) with contact email.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">2. Abstract & Keywords:</strong>
                  150 to 250 words in a single continuous paragraph summarizing scope, main themes analyzed, and major gaps identified. 4 to 6 keywords for search optimization.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">3. Introduction:</strong>
                  Background, relevance to organic rice systems, historical context, and explicit objective/scope of this review.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">4. Methodology (Preferred):</strong>
                  For systematic reviews, detail databases searched, inclusion/exclusion criteria, and date boundaries.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">5. Main Body (Thematic Subheadings):</strong>
                  Replaces standard methods/results. Organized by decimal subheadings (e.g., <em>2. Core Mechanisms</em>, <em>2.1 Sub-mechanism A</em>, up to 3 levels max). Synthesizes conflicting viewpoints and paradigm shifts.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">6. Current Challenges & Future Perspectives:</strong>
                  Critical section highlighting current bottlenecks, unresolved controversies, and future directions.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">7. Declarations & Acknowledgements:</strong>
                  Statements regarding Funding, Conflict of Interest / Competing Interests, and Author Contributions. Duly acknowledge any assistance received.
                </div>

                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100">
                  <strong className="text-red-900 block mb-0.5">8. Visuals & Reference Formatting:</strong>
                  Vector files (EPS) or high-quality halftones (TIFF, min 300 dpi). If reusing figures, copyright permission is required. References must strictly follow Bio Web of Conferences guidelines.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESEARCH PAPERS FORMAT */}
        {activeTab === "research" && (
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-earth-green/15 shadow-sm space-y-8 animate-in fade-in duration-300">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                Format Section B
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                Research Papers — Technical Specifications
              </h3>
              <p className="text-sm text-charcoal/70 mt-1">
                Detailed manuscript guidelines for original empirical research, trials, and experimental studies.
              </p>
            </div>

            {/* Layout Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Typography</span>
                <p className="font-bold text-charcoal text-sm">Times New Roman or Arial</p>
                <p className="text-xs text-charcoal/60 mt-1">10pt to 12pt for main body text</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Spacing & Margins</span>
                <p className="font-bold text-charcoal text-sm">1.5 Line Spacing</p>
                <p className="text-xs text-charcoal/60 mt-1">Standard 1-inch margins on A4</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Page Numbers</span>
                <p className="font-bold text-charcoal text-sm">5 to 10 Pages</p>
                <p className="text-xs text-charcoal/60 mt-1">Consecutive numbering throughout</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-xs text-charcoal/60 uppercase font-bold block mb-1">Line Numbers</span>
                <p className="font-bold text-earth-green text-sm">Highly Recommended</p>
                <p className="text-xs text-charcoal/60 mt-1">Mandatory for review process</p>
              </div>
            </div>

            {/* Standard Structure */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b pb-2">
                Structure of Original Research Papers
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-charcoal/80">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Title Page:</strong>
                  Concise title without abbreviations. Author name(s): First name, middle initial(s) in <em>Italics</em> and last name in Roman font. Affiliations (Department, institution, city, country). Corresponding author indicated with an asterisk (*) and email.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Abstract & Keywords:</strong>
                  Single paragraph of 150 to 250 words summarizing objectives, methods, main results, and conclusions (no citations or undefined abbreviations). 4 to 6 specific keywords.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Introduction:</strong>
                  Context, problem statement, focused literature review, and clear research objectives.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Materials & Methods:</strong>
                  Detailed experimental design, agronomic treatments, soil/crop parameters, laboratory protocols, and statistical tests so the study can be independently replicated.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Results & Discussion:</strong>
                  Clear presentation of findings supported by statistical significance. Deep interpretation comparing findings with existing international literature, practical implications, and study limitations.
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Tables & Figures:</strong>
                  Captions placed <strong>below</strong> figures. Titles placed <strong>above</strong> tables. Tables must be built using Word table tools (no screenshots, no vertical grid lines).
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-charcoal block mb-0.5">Declarations:</strong>
                  Mandatory statements on: (1) Funding sources, (2) Conflict of interest / competing interests, (3) Data availability statement, and (4) Generative AI declaration.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PUBLISHER FORMS & EXTERNAL LINKS */}
        {activeTab === "links" && (
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-earth-green/15 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rice-gold/15 text-rice-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
                Official Publisher Resources
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                EDP Sciences – Bio Web of Conferences
              </h3>
              <p className="text-sm text-charcoal/70 mt-1">
                Direct official links to the publisher&apos;s guidelines, author formatting templates, and legal forms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <a
                href="https://www.bio-conferences.org/doc_journal/woc/pdf_guidelines.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-earth-green/15 hover:border-earth-green hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-base text-charcoal group-hover:text-earth-green transition-colors">
                    How to Prepare Your Article (PDF Guidelines)
                  </h4>
                  <p className="text-xs text-charcoal/65 mt-1">
                    Official layout, fonts, references, equations, and section headings specification.
                  </p>
                </div>
                <ExternalLink size={18} className="text-charcoal/40 group-hover:text-earth-green shrink-0 mt-1" />
              </a>

              <a
                href="https://www.bio-conferences.org/doc_journal/woc/How_to_write_title_and_abstract.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-earth-green/15 hover:border-earth-green hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-base text-charcoal group-hover:text-earth-green transition-colors">
                    How to Write Title and Abstract
                  </h4>
                  <p className="text-xs text-charcoal/65 mt-1">
                    Guidelines for crafting indexable abstracts and concise research titles.
                  </p>
                </div>
                <ExternalLink size={18} className="text-charcoal/40 group-hover:text-earth-green shrink-0 mt-1" />
              </a>

              <a
                href="https://www.bio-conferences.org/doc_journal/woc/publication_right_form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-earth-green/15 hover:border-earth-green hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-base text-charcoal group-hover:text-earth-green transition-colors">
                    Publication Right Form (Mandatory)
                  </h4>
                  <p className="text-xs text-charcoal/65 mt-1">
                    Must be signed by at least one author and submitted alongside the final camera-ready manuscript.
                  </p>
                </div>
                <ExternalLink size={18} className="text-charcoal/40 group-hover:text-earth-green shrink-0 mt-1" />
              </a>

              <a
                href="https://www.bio-conferences.org/about-the-journal/publishing-policies-ethics"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-earth-green/15 hover:border-earth-green hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <h4 className="font-bold text-base text-charcoal group-hover:text-earth-green transition-colors">
                    Publishing Policies & Ethics
                  </h4>
                  <p className="text-xs text-charcoal/65 mt-1">
                    COPE compliance, copyright permissions, research integrity, and ethical standards.
                  </p>
                </div>
                <ExternalLink size={18} className="text-charcoal/40 group-hover:text-earth-green shrink-0 mt-1" />
              </a>
            </div>
          </div>
        )}

        {/* Bottom Download Card */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-charcoal">Official Guidelines PDF (F.No. 3-1/ORP-5/2025)</h4>
              <p className="text-xs text-charcoal/60">3 pages • Signed circular by Organizing Secretary, ORP-5</p>
            </div>
          </div>

          <a
            href="/documents/ORP5_Full_Length_Paper_Guidelines.pdf"
            download="Guidelines_4_full_length_paper_ORP_5.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="premium" size="default" className="text-xs uppercase tracking-wider font-bold">
              <Download size={14} className="mr-2" />
              Download PDF (500 KB)
            </Button>
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
