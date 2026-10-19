import { Metadata } from "next";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { FullPaperSubmissionForm } from "@/components/organisms/FullPaperSubmissionForm";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Submit Full-Length Paper for Review | ORP-5 Bio Web of Conferences",
  description:
    "Official manuscript submission portal for peer review and publication in Bio Web of Conferences (EDP Sciences, SCOPUS Indexed). Max file size 25 MB.",
};

export default function GuidelinesSubmitPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
      <Navbar />

      <PageHero
        headline="Submit Full-Length Manuscript"
        subheadline="Submit your manuscript and plagiarism certificate for editorial review by the International Editorial Board (Bio Web of Conferences, EDP Sciences, SCOPUS Indexed)."
        breadcrumb="Home / Publications / Submit Manuscript"
      />

      <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-10 md:mt-12 pb-24">
        {/* Navigation Breadcrumb / Helper bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/guidelines"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-earth-green hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Formatting Guidelines & Editorial Board
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="/documents/ORP5_Full_Length_Paper_Guidelines.pdf"
              download="Guidelines_4_full_length_paper_ORP_5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-charcoal bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm"
            >
              <Download size={14} />
              Official Circular PDF
            </a>
          </div>
        </div>

        {/* Embedded Form Component */}
        <FullPaperSubmissionForm />
      </div>

      <Footer />
    </main>
  );
}
