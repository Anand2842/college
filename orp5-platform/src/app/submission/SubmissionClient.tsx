"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { Loader2, CheckCircle, Upload, FileText, Download, Printer, Mail, Copy, Check, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SubmissionPageData } from "@/types/pages";
import { fetchJSON } from "@/lib/fetchWrapper";
import Link from 'next/link';

export default function SubmissionClient() {
    const [data, setData] = useState<SubmissionPageData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formState, setFormState] = useState({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        category: "",
        theme: "",
        title: "",
        abstract: "",
        file: null as File | null
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [idCopied, setIdCopied] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadData() {
            const { data: jsonData, error: fetchError } = await fetchJSON<SubmissionPageData>("/api/content/submission");
            if (fetchError) {
                setError(fetchError);
            } else {
                setData(jsonData);
            }
        }
        loadData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormState({ ...formState, file: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!formState.abstract.trim() && !formState.file) {
            setError("Please provide either the abstract text or upload a document.");
            setSubmitting(false);
            return;
        }

        try {
            let fileUrl = null;

            // 1. Upload File if present
            if (formState.file) {
                const formData = new FormData();
                formData.append('file', formState.file);

                const uploadReq = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadReq.status === 413) {
                    throw new Error("File is too large. Please upload a file smaller than 10MB.");
                }

                if (!uploadReq.ok) {
                    let errorMessage = 'File upload failed';
                    try {
                        const err = await uploadReq.json();
                        errorMessage = err.error || errorMessage;
                    } catch (e) {
                        // Fallback if response is not JSON (e.g. 500 HTML page)
                        errorMessage = `Upload failed with status: ${uploadReq.status}`;
                    }
                    throw new Error(errorMessage);
                }

                const uploadRes = await uploadReq.json();
                fileUrl = uploadRes.url;
            }

            // 2. Submit Abstract Data
            const payload = {
                title: formState.title,
                abstract: formState.abstract,
                category: formState.category,
                theme: formState.theme,
                fileUrl: fileUrl,
                authorName: formState.fullName,
                email: formState.email,
                phone: formState.phone,
                institution: formState.institution,
            };

            const submitReq = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (submitReq.status === 413) {
                throw new Error("Request payload is too large.");
            }


            if (!submitReq.ok) {
                let errorMessage = 'Submission failed';
                try {
                    const err = await submitReq.json();
                    errorMessage = err.details || err.error || errorMessage;
                } catch (e) {
                    errorMessage = `Submission failed with status: ${submitReq.status}`;
                }
                throw new Error(errorMessage);
            }

            const submitRes = await submitReq.json();
            setSubmissionResult(submitRes.submission);
            setSubmitting(false);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred. Please try again.");
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrint = () => window.print();

    const handleCopyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
            setIdCopied(true);
            setTimeout(() => setIdCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    if (error) return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
            <div className="text-center max-w-md">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-earth-green hover:underline">
                    Try Again
                </button>
            </div>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    if (submitted) {
        const absId = submissionResult?.id
            ? `ORP5-ABS-2026-${String(submissionResult.id).slice(0, 8).toUpperCase()}`
            : `ORP5-ABS-2026-XXXX`;
        const submittedOn = submissionResult?.created_at
            ? new Date(submissionResult.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        const timelineSteps = [
            { label: 'Submitted', done: true },
            { label: 'Under Review', active: true },
            { label: 'Reviewer Assigned', done: false },
            { label: 'Decision Pending', done: false },
            { label: 'Accepted', done: false },
            { label: 'Camera Ready', done: false },
            { label: 'Registration Complete', done: false },
        ];

        return (
            <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
                <Navbar />

                {/* Print-only styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden !important; }
                        #receipt-area, #receipt-area * { visibility: visible !important; }
                        #receipt-area { position: absolute; left: 0; top: 0; width: 100%; padding: 32px; }
                        .no-print { display: none !important; }
                    }
                `}</style>

                <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">

                    {/* ── Hero Strip ───────────────────────────────── */}
                    <div className="text-center mb-10 no-print">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md animate-pulse">
                            <CheckCircle size={48} className="text-earth-green" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-earth-green mb-3">Abstract Submitted!</h1>
                        <p className="text-lg text-gray-600">Thank you, <strong>{formState.fullName}</strong>. Your research has been received and is now under review.</p>
                    </div>

                    {/* ── Receipt Card ─────────────────────────────── */}
                    <div id="receipt-area" ref={receiptRef} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6">

                        {/* Receipt Header */}
                        <div className="bg-gradient-to-r from-[#1a7a2a] to-[#24C535] px-8 py-5 flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-xs font-semibold tracking-widest uppercase mb-1">ORP-5 International Conference</p>
                                <p className="text-white text-xl font-bold">Submission Receipt</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-100 text-xs">Submitted On</p>
                                <p className="text-white font-semibold text-sm">{submittedOn}</p>
                            </div>
                        </div>

                        {/* Abstract ID + Copy */}
                        <div className="px-8 py-5 bg-green-50 border-b border-green-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Abstract Reference ID</p>
                                <p className="font-mono font-bold text-xl text-gray-900">{absId}</p>
                            </div>
                            <button
                                onClick={() => handleCopyId(absId)}
                                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm no-print"
                            >
                                {idCopied ? <><Check size={14} className="text-green-600" /> Copied!</> : <><Copy size={14} /> Copy ID</>}
                            </button>
                        </div>

                        {/* Submission Details Table */}
                        <div className="px-8 py-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Submission Details</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                                {[
                                    { label: 'Author Name', value: formState.fullName },
                                    { label: 'Affiliation', value: formState.institution },
                                    { label: 'Email Address', value: formState.email },
                                    { label: 'Phone', value: formState.phone },
                                    { label: 'Track / Theme', value: formState.theme },
                                    { label: 'Presentation Type', value: formState.category },
                                    { label: 'Submission Date', value: submittedOn },
                                    { label: 'Payment Status', value: 'Pending' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex flex-col">
                                        <span className="text-xs text-gray-400 mb-0.5">{label}</span>
                                        <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-5 border-t border-gray-100">
                                <span className="text-xs text-gray-400 mb-1 block">Abstract Title</span>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">"{formState.title}"</p>
                            </div>
                            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block"></span>
                                <span className="text-xs font-bold text-yellow-700">Status: Under Review</span>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Confirmation email sent to <strong>{formState.email}</strong>. Please save this receipt for your records.</p>
                        </div>
                    </div>

                    {/* ── Receipt Actions ───────────────────────────── */}
                    <div className="flex flex-wrap gap-3 justify-center mb-10 no-print">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                        >
                            <Download size={16} className="text-earth-green" /> Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                        >
                            <Printer size={16} className="text-earth-green" /> Print Receipt
                        </button>
                        <a
                            href={`mailto:${formState.email}?subject=ORP-5 Submission Receipt&body=Your Abstract ID: ${absId}`}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                        >
                            <Mail size={16} className="text-earth-green" /> Email Receipt
                        </a>
                    </div>

                    {/* ── Status Timeline ───────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6 no-print">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Submission Progress</p>
                        <div className="flex flex-col gap-3">
                            {timelineSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                                        ${step.done ? 'bg-earth-green text-white' : step.active ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {step.done ? '✓' : step.active ? '⏳' : '○'}
                                    </div>
                                    <span className={`text-sm ${step.done ? 'text-earth-green font-semibold' : step.active ? 'text-yellow-700 font-semibold' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── What Happens Next ─────────────────────────── */}
                    <div className="bg-[#E6F6EA] rounded-2xl p-6 md:p-8 mb-8 no-print">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">What Happens Next?</p>
                        <ul className="space-y-3">
                            {[
                                'Your abstract will undergo blind peer review by subject-matter experts.',
                                'Decision emails will be sent to all authors before August 25, 2026.',
                                'Track your submission status anytime at orp5ic.com/ticket-status — no account needed.',
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-earth-green text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── CTA Hierarchy ─────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 no-print">
                        <Link href={`/ticket-status?tab=abstract&email=${encodeURIComponent(formState.email)}`}>
                            <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                                <LayoutDashboard size={16} /> Track My Submission
                            </Button>
                        </Link>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                        >
                            Submit Another
                        </button>
                        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors self-center">
                            Return Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
            <Navbar />

            <PageHero
                headline={data.hero.headline || "Abstract Submissions"}
                subheadline="The deadline for abstract submissions was 25 August 2026. Submissions are now officially closed and undergoing double-blind peer review."
                backgroundImage={data.hero.backgroundImage}
                breadcrumb="Home / Abstract Submission"
                buttons={[
                    { label: "Track Review Status", link: "/ticket-status?tab=abstract", variant: "primary" },
                    { label: "Register for Conference", link: "/registration", variant: "secondary" }
                ]}
            />

            <div className="container mx-auto px-6 max-w-5xl pb-20">

                {/* Submissions Closed Notice Card */}
                <div className="mb-16 -mt-8 relative z-20">
                    <div className="bg-amber-50/90 backdrop-blur-md border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                                <FileText size={24} />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-200/50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                    Submissions Closed on 25 August 2026
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                                    Double-Blind Peer Review Underway
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                    Thank you to all researchers, scientists, and academicians who submitted abstracts. Authors can track real-time evaluation status and access official submission receipts.
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                            <Link href="/ticket-status?tab=abstract" className="block w-full">
                                <Button className="w-full bg-earth-green hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm">
                                    Track Review Status
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold text-center mb-12">Important Dates</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center relative gap-8">
                        {/* Line */}
                        <div className="hidden md:block absolute top-[11px] left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

                        {data.timeline.map((item: any, i: number) => {
                            const isClosed = item.label.toLowerCase().includes("deadline") || item.label.toLowerCase().includes("submission");
                            return (
                                <div key={i} className="flex flex-col items-center bg-[#FFFDF7] px-4 z-10">
                                    <div className={`w-6 h-6 rounded-full ${isClosed ? 'bg-amber-500' : 'bg-[#24C535]'} border-4 border-[#FDFCF8] shadow-sm mb-4`}></div>
                                    <h4 className="font-bold text-sm text-gray-900 mb-1">{item.label}</h4>
                                    <p className="text-xs text-gray-500">{item.date} {isClosed ? '(Closed)' : ''}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold text-center mb-12">Presentation Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.categories.map((cat: any, i: number) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
                                <h3 className="font-bold text-lg mb-3">{cat.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thematic Areas */}
                <div className="mb-24 bg-[#FFFDF7] rounded-2xl p-10">
                    <h2 className="text-2xl font-bold text-center mb-12">Thematic Areas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-3xl mx-auto">
                        {data.thematicAreas.map((area: string, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-[#24C535] rounded-full p-0.5"><CheckCircle size={12} className="text-white" /></div>
                                <span className="text-gray-700 text-sm font-medium">{area}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submission Closed Action Card (Replaces the Form) */}
                <div id="form" className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-14 max-w-4xl mx-auto mb-20 scroll-mt-24 text-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-earth-green/10 text-earth-green mx-auto flex items-center justify-center mb-6">
                        <FileText size={32} />
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        Submissions Closed
                    </span>

                    <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">
                        Abstract Submissions for ORP-5 Are Closed
                    </h2>
                    
                    <p className="text-gray-600 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                        The submission window for research abstracts concluded on <strong>25 August 2026</strong>. If you have already submitted your research abstract, you can verify your review status and access confirmation records below.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-10">
                        <Link href="/ticket-status?tab=abstract" className="w-full sm:w-auto">
                            <Button className="w-full bg-earth-green hover:bg-green-800 text-white font-bold h-12 px-8 text-sm">
                                Track Review Status
                            </Button>
                        </Link>
                        <Link href="/registration" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-12 px-8 text-sm font-bold text-earth-green border-earth-green/40 hover:bg-earth-green/5">
                                Register for Conference
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                        <span>Have questions about your submission?</span>
                        <Link href="/contact" className="font-bold text-earth-green hover:underline">
                            Contact Editorial Secretariat
                        </Link>
                        <span>·</span>
                        <Link href="/submission-guidelines" className="font-medium text-gray-600 hover:text-earth-green">
                            View Participation Guidelines
                        </Link>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{data.infoCards.review.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{data.infoCards.review.description}</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{data.infoCards.support.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{data.infoCards.support.description}</p>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="bg-[#E6F6EA] rounded-3xl py-16 text-center">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Join Us in New Delhi</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">Conference delegate registrations are currently open. Reserve your pass to attend keynotes, technical tracks, and exhibitions.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/registration">
                            <Button className="bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl border-none">
                                Register as Delegate
                            </Button>
                        </Link>
                        <Link href="/ticket-status">
                            <Button variant="outline" className="bg-white border border-[#24C535] text-[#1E992A] hover:bg-[#24C535]/10 px-8 py-3 rounded-xl font-bold">
                                Verify Registration
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
