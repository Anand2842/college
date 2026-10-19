"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Globe,
  Loader2,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  BookOpen,
  FileCheck,
  X,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Search
} from "lucide-react";
import { Button } from "@/components/atoms/Button";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const CONFERENCE_THEMES = [
  "Track 1: Barriers & Constraints Limiting System Expansion",
  "Track 2: Policy, Certification & Market Ecosystems",
  "Track 3: Climate Change Adaptation & Carbon-Neutrality",
  "Track 4: Soil Health, Bio-inputs & Nutrient Dynamics",
  "Track 5: Pest, Disease & Weed Management in Natural Rice",
  "Track 6: Post-Harvest Processing, Value Addition & Economics"
];

interface UploadedDoc {
  file: File;
  url: string;
  size: number;
}

export function FullPaperSubmissionForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    articleType: "Original Research Paper",
    paperTitle: "",
    theme: CONFERENCE_THEMES[0],
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    designation: "",
    department: "",
    country: "India",
    nationality: "indian",
    coAuthors: "",
    abstract: "",
    keywords: "",
  });

  // Declarations
  const [declarations, setDeclarations] = useState({
    originality: false,
    feeAgreement: false,
    coAuthorConsent: false,
  });

  // Files State
  const [manuscriptDoc, setManuscriptDoc] = useState<UploadedDoc | null>(null);
  const [plagiarismDoc, setPlagiarismDoc] = useState<UploadedDoc | null>(null);
  const [supplementaryDoc, setSupplementaryDoc] = useState<UploadedDoc | null>(null);

  // Upload Progress
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Copy helper
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  const feeAmount = formData.nationality === "indian" ? 6000 : 50;
  const currency = formData.nationality === "indian" ? "INR" : "EUR";
  const currencySymbol = formData.nationality === "indian" ? "₹" : "€";

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "nationality") {
        next.country = value === "indian" ? "India" : prev.country === "India" ? "" : prev.country;
      }
      return next;
    });
  };

  // Upload handler with strict 25 MB max size check
  const handleFileUpload = async (file: File, fieldType: "manuscript" | "plagiarism" | "supplementary") => {
    setUploadError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed limit is strictly 25 MB.`);
      return;
    }

    setUploadingField(fieldType);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      const uploaded: UploadedDoc = {
        file,
        url: data.url,
        size: file.size,
      };

      if (fieldType === "manuscript") setManuscriptDoc(uploaded);
      if (fieldType === "plagiarism") setPlagiarismDoc(uploaded);
      if (fieldType === "supplementary") setSupplementaryDoc(uploaded);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file. Please check your connection and retry.");
    } finally {
      setUploadingField(null);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.paperTitle.trim()) return "Please enter the Paper Title.";
    if (!formData.fullName.trim()) return "Please enter the Corresponding Author's Full Name.";
    if (!formData.email.trim() || !formData.email.includes("@")) return "Please enter a valid Email Address.";
    if (!formData.phone.trim() || formData.phone.length < 7) return "Please enter a valid Phone Number.";
    if (!formData.institution.trim()) return "Please enter your Institution or University.";
    if (!formData.country.trim()) return "Please enter your Country.";
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!manuscriptDoc) return "Please upload your Full-Length Manuscript (.doc, .docx, or .pdf up to 25 MB).";
    if (!plagiarismDoc) return "Please upload your Plagiarism / Similarity Certificate (.pdf).";
    return null;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!declarations.originality) return "Please agree to the originality declaration.";
    if (!declarations.feeAgreement) return "Please acknowledge the publication fee agreement upon acceptance.";
    if (!declarations.coAuthorConsent) return "Please confirm that all co-authors have consented to this submission.";
    return null;
  };

  const handleNextStep = () => {
    setSubmitError(null);
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) { setSubmitError(err); return; }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) { setSubmitError(err); return; }
      setCurrentStep(3);
    }
  };

  const handleSubmitFinal = async () => {
    setSubmitError(null);
    const err = validateStep3();
    if (err) { setSubmitError(err); return; }

    setIsSubmitting(true);

    try {
      const payload = {
        paperTitle: formData.paperTitle,
        articleType: formData.articleType,
        theme: formData.theme,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        designation: formData.designation,
        department: formData.department,
        country: formData.country,
        nationality: formData.nationality,
        coAuthors: formData.coAuthors,
        abstract: formData.abstract,
        keywords: formData.keywords,
        manuscriptUrl: manuscriptDoc?.url,
        plagiarismReportUrl: plagiarismDoc?.url,
        supplementaryUrl: supplementaryDoc?.url || null,
        feeAmount: feeAmount,
        currency: currency,
      };

      const res = await fetch("/api/full-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Submission failed. Please try again.");
      }

      setSubmissionResult(resData);
      setCurrentStep(4);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    document.body.classList.add('printing-slip-only');
    const cleanup = () => {
      document.body.classList.remove('printing-slip-only');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
      {/* ── Top Header / Stepper Bar ── */}
      <div className="bg-[#0F2D21] p-6 sm:p-8 text-white relative border-b border-[#DFC074]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DFC074] border border-[#DFC074]/40 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              Bio Web of Conferences • EDP Sciences (SCOPUS Indexed)
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Full-Length Manuscript Submission
            </h2>
            <p className="text-xs sm:text-sm text-white/75 mt-0.5">
              Submit your manuscript for editorial evaluation and peer review (Max 25 MB per file).
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-white/60 block font-semibold">Publication Fee (Upon Acceptance)</span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#DFC074]">
              {currencySymbol}{feeAmount.toLocaleString()} <span className="text-xs font-normal text-white/80">{currency} / paper</span>
            </span>
            <span className="text-[10px] text-emerald-300 block font-medium">No upfront submission charge</span>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 pt-5 border-t border-white/10">
          {[
            { step: 1, title: "1. Manuscript & Author" },
            { step: 2, title: "2. Document Uploads" },
            { step: 3, title: "3. Review & Submit" },
          ].map((s) => (
            <div
              key={s.step}
              className={`text-center py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                currentStep === s.step
                  ? "bg-[#DFC074] text-[#0F2D21] shadow"
                  : currentStep > s.step
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/40"
              }`}
            >
              {s.title}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="p-6 sm:p-8 md:p-10">
        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please check the form:</p>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 1: METADATA & AUTHOR
        ══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-[#FAF9F5] border border-[#E5E0D4] rounded-2xl p-4 flex items-start gap-3">
              <Info size={18} className="text-[#0F2D21] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>Publication Process:</strong> There is <strong>no upfront submission fee</strong>. All papers undergo single peer review by the International Editorial Board. Only papers formally accepted for the 50-article proceedings volume will be invited to pay the contributory publication fee ({currencySymbol}{feeAmount.toLocaleString()}) via Bank Transfer.
              </div>
            </div>

            {/* Article Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Article Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    type: "Original Research Paper",
                    desc: "6–8 printed pages • 3,000–4,000 words • Novel empirical research in organic/natural rice",
                  },
                  {
                    type: "Review Article",
                    desc: "8–10 printed pages • 4,000–5,000 words • Comprehensive state-of-the-art critical synthesis",
                  },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, articleType: item.type })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.articleType === item.type
                        ? "border-[#0F2D21] bg-emerald-50/40 ring-1 ring-[#0F2D21]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base text-gray-900">{item.type}</span>
                      {formData.articleType === item.type && (
                        <CheckCircle2 size={18} className="text-[#0F2D21]" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Full Paper Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="paperTitle"
                value={formData.paperTitle}
                onChange={handleInputChange}
                placeholder="e.g., Evaluation of Natural Bio-Formulations on Rice Grain Yield and Soil Microbiome in Sub-Humid Ecosystems"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
              />
            </div>

            {/* Conference Theme */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Conference Sub-theme / Track <span className="text-red-500">*</span>
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm bg-white"
              >
                {CONFERENCE_THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Nationality & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Author Nationality <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, nationality: "indian", country: "India" });
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      formData.nationality === "indian"
                        ? "bg-white text-[#0F2D21] shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    🇮🇳 Indian Author (₹6,000 upon acceptance)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, nationality: "foreign", country: "" });
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      formData.nationality === "foreign"
                        ? "bg-white text-[#0F2D21] shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    🌐 Foreign Author (€50 upon acceptance)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., India, Italy, Japan, Philippines..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                />
              </div>
            </div>

            {/* Corresponding Author Contact Details */}
            <div className="pt-2 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Corresponding Author Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Prof. / Dr. / Mr. / Ms."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="author@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Institution / University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g., ICAR-IARI, New Delhi"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Principal Scientist / Professor"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Department / Faculty
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Division of Agronomy"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Co-Authors (Names & Affiliations)
                </label>
                <input
                  type="text"
                  name="coAuthors"
                  value={formData.coAuthors}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. A. Sharma (ICAR), Dr. Marco Rossi (Univ. of Milan), Dr. K. Tanaka (Tokyo Univ.)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                />
              </div>
            </div>

            {/* Abstract & Keywords */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Structured Abstract (200–300 words)
                </label>
                <textarea
                  name="abstract"
                  rows={4}
                  value={formData.abstract}
                  onChange={handleInputChange}
                  placeholder="Provide Background, Objectives, Methodology, Key Results, and Scientific Conclusion..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Keywords (4–6 comma-separated terms)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Rice, Soil Microbiome, Natural Farming, Carbon Sequestration, Yield Gap"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F2D21]/20 focus:border-[#0F2D21] text-sm"
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex justify-end">
              <Button
                variant="default"
                size="lg"
                onClick={handleNextStep}
                className="text-xs uppercase tracking-wider font-bold py-3.5 px-8 flex items-center gap-2 bg-[#0F2D21] hover:bg-[#174232] text-white shadow-md cursor-pointer"
              >
                Proceed to Document Uploads
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 2: DOCUMENT UPLOADS (MAX 25 MB)
        ══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-[#FAF9F5] border border-[#E5E0D4] rounded-2xl p-4 flex items-start gap-3">
              <Upload size={18} className="text-[#0F2D21] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>Upload Guidelines:</strong> Please ensure your documents conform to the official EDP Sciences template. Each file can be up to <strong>25 MB</strong> in size.
              </div>
            </div>

            {uploadError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload 1: Manuscript File */}
            <div className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-[#0F2D21]" />
                    Full-Length Manuscript Document <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    MS Word (.doc, .docx) or PDF formatted according to EDP Sciences guidelines. Max 25 MB.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Required
                </span>
              </div>

              {manuscriptDoc ? (
                <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold mt-3">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{manuscriptDoc.file.name}</span>
                    <span className="text-gray-500 text-[11px]">({(manuscriptDoc.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setManuscriptDoc(null)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0F2D21] cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-all">
                  {uploadingField === "manuscript" ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2D21]">
                      <Loader2 size={18} className="animate-spin" />
                      Uploading manuscript to cloud storage...
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-700">Click to upload manuscript or drag & drop</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">DOC, DOCX, or PDF (Strict maximum: 25 MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "manuscript");
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Upload 2: Plagiarism Report */}
            <div className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#0F2D21]" />
                    Plagiarism / Similarity Report <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Similarity report from Turnitin, Urkund/Ouriginal, or iThenticate. Max 25 MB.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Required
                </span>
              </div>

              {plagiarismDoc ? (
                <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold mt-3">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{plagiarismDoc.file.name}</span>
                    <span className="text-gray-500 text-[11px]">({(plagiarismDoc.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlagiarismDoc(null)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0F2D21] cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-all">
                  {uploadingField === "plagiarism" ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2D21]">
                      <Loader2 size={18} className="animate-spin" />
                      Uploading similarity report...
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-700">Click to upload similarity certificate</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">PDF format preferred (Max: 25 MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "plagiarism");
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Upload 3: Supplementary Material (Optional) */}
            <div className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <FileCheck size={16} className="text-gray-500" />
                    Supplementary Material / High-Resolution Figures (Optional)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Additional datasets, high-res photos, or questionnaires. Max 25 MB.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  Optional
                </span>
              </div>

              {supplementaryDoc ? (
                <div className="flex items-center justify-between bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-xs font-semibold mt-3">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{supplementaryDoc.file.name}</span>
                    <span className="text-gray-500 text-[11px]">({(supplementaryDoc.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupplementaryDoc(null)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer bg-gray-50/30 hover:bg-gray-50 transition-all">
                  {uploadingField === "supplementary" ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                      <Loader2 size={18} className="animate-spin" />
                      Uploading supplementary file...
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-600">Click to upload supplementary files (optional)</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">ZIP, PDF, DOCX (Max: 25 MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".zip,.rar,.pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "supplementary");
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                Back to Details
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={handleNextStep}
                className="text-xs uppercase tracking-wider font-bold py-3.5 px-8 flex items-center gap-2 bg-[#0F2D21] hover:bg-[#174232] text-white shadow-md cursor-pointer"
              >
                Proceed to Review & Declarations
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 3: REVIEW & ACADEMIC DECLARATION
        ══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Review Card */}
            <div className="bg-[#FAF9F5] border border-[#E5E0D4] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F2D21]">
                  Manuscript Submission Summary
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready for Editorial Review
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Title:</span>
                  <span className="font-bold text-gray-900">{formData.paperTitle}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Category:</span>
                  <span className="font-bold text-gray-900">{formData.articleType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Conference Track:</span>
                  <span className="font-medium text-gray-800">{formData.theme}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Corresponding Author:</span>
                  <span className="font-bold text-gray-900">{formData.fullName} ({formData.institution})</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Contact:</span>
                  <span className="font-medium text-gray-800">{formData.email} • {formData.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Nationality & Applicable Fee:</span>
                  <span className="font-bold text-[#0F2D21]">
                    {formData.nationality === "indian" ? "Indian Author" : "Foreign Author"} — {currencySymbol}{feeAmount.toLocaleString()} {currency} (Upon Acceptance)
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Uploaded Manuscript:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={13} /> {manuscriptDoc?.file.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Plagiarism Report:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={13} /> {plagiarismDoc?.file.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Transparent Process Notice */}
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#0F2D21] flex items-center gap-2">
                <Info size={16} />
                Editorial Review & Payment Protocol
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                1. <strong>No payment is taken at this stage.</strong> Your manuscript is submitted directly to the International Editorial Board for technical evaluation.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                2. <strong>Moderator Review:</strong> The editors evaluate originality, relevance, scientific quality, and EDP Sciences formatting compliance.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                3. <strong>Acceptance Notification:</strong> Once your paper is selected, you will receive an official Acceptance Letter with bank transfer instructions to remit the publication fee ({currencySymbol}{feeAmount.toLocaleString()}) to State Bank of India.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                4. <strong>Confirmation:</strong> Upon payment verification and final camera-ready formatting, your paper will be published open-access in Bio Web of Conferences (SCOPUS Indexed).
              </p>
            </div>

            {/* Author Declarations */}
            <div className="border border-gray-200 rounded-2xl p-5 space-y-3 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
                Author Academic Declarations <span className="text-red-500">*</span>
              </h4>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={declarations.originality}
                  onChange={(e) => setDeclarations({ ...declarations, originality: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0F2D21] focus:ring-[#0F2D21]"
                />
                <span>
                  I declare that this manuscript represents original research/synthesis, is free of copyright violations, and has not been submitted or published in any other journal or conference proceedings.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={declarations.feeAgreement}
                  onChange={(e) => setDeclarations({ ...declarations, feeAgreement: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0F2D21] focus:ring-[#0F2D21]"
                />
                <span>
                  I understand that if my manuscript is selected and accepted by the Editorial Board, I agree to remit the subsidized publication charge of <strong>{currencySymbol}{feeAmount.toLocaleString()} {currency}</strong> via Direct Bank Transfer to State Bank of India to confirm publication.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={declarations.coAuthorConsent}
                  onChange={(e) => setDeclarations({ ...declarations, coAuthorConsent: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0F2D21] focus:ring-[#0F2D21]"
                />
                <span>
                  I confirm that all listed co-authors have approved this manuscript and consented to its submission for ORP-5 Bio Web proceedings.
                </span>
              </label>
            </div>

            {/* Navigation & Submit Final */}
            <div className="pt-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                Back to Documents
              </Button>

              <Button
                variant="default"
                size="lg"
                disabled={isSubmitting}
                onClick={handleSubmitFinal}
                className="text-xs uppercase tracking-wider font-bold py-4 px-8 flex items-center gap-2 shadow-lg bg-[#0F2D21] hover:bg-[#174232] text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting Manuscript for Review...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Submit Manuscript for Editorial Review
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 4: SUBMISSION CONFIRMATION & TRACKING PASS
        ══════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && submissionResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Success Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                Manuscript Received for Editorial Review
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your full-length manuscript has been successfully queued for peer review by the International Editorial Board for <strong>Bio Web of Conferences (EDP Sciences, SCOPUS Indexed)</strong>.
              </p>
            </div>

            {/* Process Milestones Tracker */}
            <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-4 text-center">
                Publication Journey Milestones
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow-sm">
                    ✓
                  </div>
                  <span className="font-bold text-emerald-800 text-[11px]">1. Submitted</span>
                  <span className="text-[10px] text-gray-400">Completed</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#0F2D21] text-[#DFC074] flex items-center justify-center font-bold mb-1 shadow-sm ring-2 ring-[#DFC074]/50 animate-pulse">
                    2
                  </div>
                  <span className="font-bold text-[#0F2D21] text-[11px]">2. Peer Review</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Active Now</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-1">
                    3
                  </div>
                  <span className="font-medium text-gray-600 text-[11px]">3. Acceptance & Bank Pay</span>
                  <span className="text-[10px] text-gray-400">Next Step</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-1">
                    4
                  </div>
                  <span className="font-medium text-gray-600 text-[11px]">4. Bio Web Published</span>
                  <span className="text-[10px] text-gray-400">Final (SCOPUS)</span>
                </div>
              </div>
            </div>

            {/* Printable Receipt Card */}
            <div
              id="full-paper-slip-print"
              ref={receiptRef}
              className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-md"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    ORP-5 Bio Web Proceedings
                  </span>
                  <h4 className="text-lg font-serif font-bold text-gray-900">
                    Submission Acknowledgement Slip
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Date:</span>
                  <span className="text-xs font-bold text-gray-900 block">
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Reference ID Banner */}
              <div className="my-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                    Paper Tracking ID
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F2D21] tracking-wider">
                    {submissionResult.ticketId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(submissionResult.ticketId, "ticket")}
                  className="no-print px-4 py-2 rounded-xl bg-white border border-emerald-300 text-[#0F2D21] text-xs font-bold hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {copiedField === "ticket" ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === "ticket" ? "Copied ID" : "Copy Tracking ID"}
                </button>
              </div>

              {/* Summary Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Paper Title:</span>
                  <span className="font-bold text-gray-900 max-w-[340px] text-right">{formData.paperTitle}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Article Category:</span>
                  <span className="font-bold text-gray-900">{formData.articleType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Sub-theme:</span>
                  <span className="font-medium text-gray-800 max-w-[300px] text-right">{formData.theme}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Corresponding Author:</span>
                  <span className="font-bold text-gray-900">{formData.fullName} ({formData.institution})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-800">{formData.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Review Status:</span>
                  <span className="font-semibold text-emerald-700">Under Peer Review & Editorial Evaluation</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Publication Fee:</span>
                  <span className="font-bold text-[#0F2D21] text-sm">
                    {currencySymbol}{feeAmount.toLocaleString()} {currency} (Payable upon formal acceptance)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>International Editorial Board (India • Italy • Japan)</span>
                <span>Bio Web (EDP Sciences)</span>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">What happens next?</h4>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
                <li>
                  An official acknowledgement email has been dispatched to <strong>{formData.email}</strong>.
                </li>
                <li>
                  The Editorial Board will assess your paper against SCOPUS indexing criteria and conference themes.
                </li>
                <li>
                  If your article is selected, you will receive an <strong>Acceptance Notice</strong> with official Bank Transfer details to complete the contributory publication charge.
                </li>
                <li>
                  You can track your manuscript's progress anytime using your Tracking ID on the portal.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="default"
                onClick={handlePrint}
                className="text-xs font-bold flex items-center gap-2"
              >
                <Printer size={15} />
                Print / Save PDF Slip
              </Button>

              <Link href="/ticket-status">
                <Button
                  variant="default"
                  size="default"
                  className="text-xs font-bold flex items-center gap-2 bg-[#0F2D21] hover:bg-[#174232] text-white"
                >
                  <Search size={15} />
                  Track Status on Portal
                </Button>
              </Link>

              <Button
                variant="glass"
                size="default"
                onClick={() => {
                  setCurrentStep(1);
                  setSubmissionResult(null);
                  setManuscriptDoc(null);
                  setPlagiarismDoc(null);
                  setSupplementaryDoc(null);
                  setDeclarations({
                    originality: false,
                    feeAgreement: false,
                    coAuthorConsent: false,
                  });
                  setFormData({
                    ...formData,
                    paperTitle: "",
                    abstract: "",
                    keywords: "",
                  });
                }}
                className="text-xs font-semibold text-gray-700"
              >
                Submit Another Manuscript
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
