'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { PageHero } from '@/components/organisms/PageHero';
import {
    Loader2, Search, CheckCircle2, Clock, XCircle, AlertTriangle,
    FileText, ArrowRight, Sparkles, Copy, Check, Printer,
    CreditCard, ExternalLink, ShieldCheck, Landmark
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

type FullPaperResult = {
    type: 'full_paper';
    ticket_number: string;
    full_name: string;
    email_masked: string;
    category: string;
    nationality: string;
    country: string;
    institution: string;
    fee_amount: number;
    currency: string;
    status: string;
    payment_status: string;
    review_status: string;
    review_notes?: string;
    registered_at: string;
    paper_title: string;
    article_type: string;
    theme: string;
    co_authors?: string;
    manuscript_url?: string | null;
    plagiarism_report_url?: string | null;
    supplementary_url?: string | null;
    utr_number?: string | null;
};

function StatusPill({ reviewStatus, paymentStatus }: { reviewStatus: string; paymentStatus: string }) {
    if (paymentStatus === 'paid' || paymentStatus === 'verified') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-700" /> Confirmed & Published in Bio Web
            </span>
        );
    }

    if (paymentStatus === 'payment_claimed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold text-xs">
                <Clock size={14} className="text-blue-600" /> Bank Transfer Under Verification
            </span>
        );
    }

    if (reviewStatus === 'accepted') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-full font-bold text-xs shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-600" /> Manuscript Accepted — Awaiting Bank Payment
            </span>
        );
    }

    if (reviewStatus === 'revision') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-bold text-xs">
                <AlertTriangle size={14} className="text-amber-600" /> Revision Requested by Editorial Board
            </span>
        );
    }

    if (reviewStatus === 'rejected') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full font-bold text-xs">
                <XCircle size={14} className="text-red-600" /> Not Accepted
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-full font-bold text-xs">
            <Clock size={14} className="text-purple-600 animate-pulse" /> Under Peer Review & Editorial Evaluation
        </span>
    );
}

function TrackPaperContent() {
    const searchParams = useSearchParams();
    const [ticketId, setTicketId] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FullPaperResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Auto-fetch if params are present in URL
    useEffect(() => {
        const paramId = searchParams.get('id') || searchParams.get('ticket');
        const paramEmail = searchParams.get('email');
        if (paramId) setTicketId(paramId);
        if (paramEmail) setEmail(paramEmail);

        if (paramId || paramEmail) {
            handleLookup(paramId || '', paramEmail || '');
        }
    }, [searchParams]);

    const handleLookup = async (idToUse?: string, emailToUse?: string) => {
        const id = (idToUse !== undefined ? idToUse : ticketId).trim();
        const mail = (emailToUse !== undefined ? emailToUse : email).trim();

        if (!id && !mail) {
            setError('Please enter your Manuscript Tracking ID or registered email.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/ticket-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticket_id: id, email: mail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'No manuscript found matching the provided details.');
            } else {
                setResult(data);
            }
        } catch {
            setError('Network error. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLookup();
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const currencySymbol = result?.currency === 'EUR' ? '€' : result?.currency === 'USD' ? '$' : '₹';

    return (
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 relative z-20 mt-8 md:mt-10 pb-20">
            {/* Search Form Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#0F2D21]/15 p-6 sm:p-10 mb-8">
                <div className="flex items-center gap-2 mb-2 text-[#0F2D21] font-bold text-xs uppercase tracking-wider">
                    <Sparkles size={15} className="text-[#DFC074]" />
                    <span>Bio Web of Conferences (SCOPUS Indexed)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-1">
                    Track Manuscript & Review Progress
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-6">
                    Enter your manuscript Tracking ID (e.g. <code>ORP5-FP-2026-XXXX</code>) or registered email address.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                Manuscript Tracking ID
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. ORP5-FP-2026-XXXX"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:border-[#0F2D21] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                Corresponding Author Email
                            </label>
                            <input
                                type="email"
                                placeholder="author@institution.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0F2D21] transition-colors"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 text-xs sm:text-sm font-medium rounded-xl border border-red-200 flex items-start gap-2.5">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        disabled={isLoading}
                        className="w-full text-xs uppercase tracking-wider font-bold py-3.5 bg-[#0F2D21] hover:bg-[#174232] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Records...
                            </>
                        ) : (
                            <>
                                <Search size={15} /> Track Manuscript Status <ArrowRight size={15} />
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Results Display */}
            {result && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Process Milestones Tracker */}
                    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-3 text-center">
                            Publication Journey Milestones
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow-sm text-xs">
                                    ✓
                                </div>
                                <span className="font-bold text-emerald-800 text-[11px]">1. Submitted</span>
                                <span className="text-[10px] text-gray-400">Completed</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm text-xs ${
                                    result.review_status === 'accepted'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#0F2D21] text-[#DFC074] ring-2 ring-[#DFC074]/50 animate-pulse'
                                }`}>
                                    {result.review_status === 'accepted' ? '✓' : '2'}
                                </div>
                                <span className="font-bold text-[#0F2D21] text-[11px]">2. Peer Review</span>
                                <span className="text-[10px] text-emerald-700 font-semibold">
                                    {result.review_status === 'accepted' ? 'Passed' : 'Active'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 text-xs ${
                                    result.payment_status === 'paid' || result.payment_status === 'verified'
                                        ? 'bg-emerald-600 text-white'
                                        : result.review_status === 'accepted'
                                        ? 'bg-[#DFC074] text-[#0F2D21] font-bold ring-2 ring-[#0F2D21]'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {result.payment_status === 'paid' || result.payment_status === 'verified' ? '✓' : '3'}
                                </div>
                                <span className="font-medium text-gray-800 text-[11px]">3. Bank Transfer</span>
                                <span className="text-[10px] text-gray-500">
                                    {result.payment_status === 'paid' ? 'Verified' : result.review_status === 'accepted' ? 'Payable Now' : 'Pending Review'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 text-xs ${
                                    result.payment_status === 'paid' || result.payment_status === 'verified'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    4
                                </div>
                                <span className="font-medium text-gray-800 text-[11px]">4. Bio Web Index</span>
                                <span className="text-[10px] text-gray-400">SCOPUS</span>
                            </div>
                        </div>
                    </div>

                    {/* Acceptance & Bank Payment Callout (If Accepted) */}
                    {result.review_status === 'accepted' && result.payment_status !== 'paid' && result.payment_status !== 'verified' && (
                        <div className="bg-gradient-to-br from-[#0F2D21] to-[#164E38] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#DFC074]/30 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-[#DFC074] text-[#0F2D21] text-xs font-bold uppercase tracking-wider">
                                    Official Acceptance Notice
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                                Congratulations! Your Manuscript has been Selected
                            </h3>
                            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                                The International Editorial Board has approved <strong>"{result.paper_title}"</strong> for publication in <strong>Bio Web of Conferences (EDP Sciences, SCOPUS Indexed)</strong>.
                            </p>
                            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                                Please finalize your contributory publication fee of <strong className="text-[#DFC074]">{currencySymbol}{result.fee_amount.toLocaleString()} {result.currency}</strong> via Direct Bank Transfer to State Bank of India (SBI).
                            </p>

                            {/* Bank Details Table */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-xs space-y-2">
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-white/70">Beneficiary Name:</span>
                                    <span className="font-bold text-white">All India Agricultural Students Association</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-white/70">Bank & Branch:</span>
                                    <span className="font-medium text-white">State Bank of India (SBI), NSC Beej Bhawan, New Delhi</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-white/70">Account Number:</span>
                                    <span className="font-mono font-bold text-[#DFC074] text-sm">44767771724</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-white/70">IFSC Code (Domestic):</span>
                                    <span className="font-mono font-bold text-white">SBIN0005389</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-white/70">SWIFT Code (International):</span>
                                    <span className="font-mono font-bold text-white">SBININBB550</span>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                                <Link
                                    href={`/registration/pay?id=${encodeURIComponent(result.ticket_number)}`}
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full text-xs font-bold uppercase tracking-wider bg-[#DFC074] hover:bg-[#ebd48e] text-[#0F2D21] py-3.5 px-6 flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Landmark size={16} />
                                        Submit UTR & Upload Bank Transfer Receipt →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════════
                        OFFICIAL PRINTABLE SUBMISSION SLIP CARD
                        Targeted exclusively by @media print via #full-paper-slip-print
                    ══════════════════════════════════════════════════════════ */}
                    <div
                        id="full-paper-slip-print"
                        className="bg-white rounded-3xl shadow-xl border-2 border-gray-200/90 p-6 sm:p-8 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 block">
                                    ORP-5 Bio Web Proceedings • EDP Sciences (SCOPUS)
                                </span>
                                <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                                    Manuscript Submission & Tracking Record
                                </h3>
                                <span className="text-xs text-gray-500 block mt-0.5">
                                    Submission Date: {new Date(result.registered_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="no-print">
                                <StatusPill reviewStatus={result.review_status} paymentStatus={result.payment_status} />
                            </div>
                        </div>

                        {/* Tracking ID Strip */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                                    Paper Tracking ID
                                </span>
                                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F2D21] tracking-wider">
                                    {result.ticket_number}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleCopy(result.ticket_number)}
                                className="no-print px-4 py-2 rounded-xl bg-white border border-emerald-300 text-[#0F2D21] text-xs font-bold hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "Copied Tracking ID" : "Copy Tracking ID"}
                            </button>
                        </div>

                        {/* Manuscript Details */}
                        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F2D21] block">
                                Manuscript Title
                            </span>
                            <h4 className="font-serif font-bold text-base sm:text-lg text-gray-900 leading-snug">
                                "{result.paper_title}"
                            </h4>
                            <div className="text-xs text-gray-600 pt-1 flex flex-wrap gap-2">
                                <span className="px-2.5 py-0.5 bg-white rounded-md border border-gray-200 font-medium">
                                    Category: <strong>{result.article_type}</strong>
                                </span>
                                <span className="px-2.5 py-0.5 bg-white rounded-md border border-gray-200 font-medium">
                                    Track: <strong>{result.theme}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Key Attributes Table */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 block text-[11px]">Corresponding Author</span>
                                <p className="font-bold text-gray-900 text-sm mt-0.5">{result.full_name}</p>
                                <p className="text-gray-600">{result.institution}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 block text-[11px]">Contact Email</span>
                                <p className="font-medium text-gray-900 text-sm mt-0.5">{result.email_masked}</p>
                                <p className="text-gray-600">Country: {result.country || result.nationality}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 block text-[11px]">Editorial Review Status</span>
                                <p className="font-bold text-emerald-800 capitalize mt-0.5">
                                    {result.review_status.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 block text-[11px]">Publication Charge</span>
                                <p className="font-bold text-[#0F2D21] text-sm mt-0.5">
                                    {currencySymbol}{result.fee_amount.toLocaleString()} {result.currency}
                                </p>
                                <span className="text-[10px] text-gray-500">
                                    {result.payment_status === 'paid' ? 'Paid & Confirmed' : 'Payable upon formal acceptance'}
                                </span>
                            </div>
                        </div>

                        {/* Co-authors if any */}
                        {result.co_authors && (
                            <div className="text-xs pt-2 border-t border-gray-100">
                                <span className="text-gray-500 font-semibold">Co-Authors: </span>
                                <span className="text-gray-800">{result.co_authors}</span>
                            </div>
                        )}

                        {/* UTR if submitted */}
                        {result.utr_number && (
                            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                                <span className="text-blue-800 font-bold block text-[11px] uppercase tracking-wider">
                                    Bank Transfer Reference (UTR)
                                </span>
                                <span className="font-mono font-bold text-sm text-blue-900">{result.utr_number}</span>
                            </div>
                        )}

                        {/* Reviewer / Editorial Notes if present */}
                        {result.review_notes && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <span className="font-bold uppercase tracking-wider text-[11px] block">
                                    Editorial Board Notes:
                                </span>
                                <p className="whitespace-pre-wrap">{result.review_notes}</p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
                            <span>5th International Conference on Outreach of Rural Programmes (ORP-5)</span>
                            <span>Editorial Secretariat • info@orp5ic.com</span>
                        </div>
                    </div>

                    {/* Action Buttons (Excluded from Print) */}
                    <div className="no-print flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={handlePrint}
                            className="text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-gray-100"
                        >
                            <Printer size={15} />
                            Print / Save PDF Slip
                        </Button>

                        {result.review_status === 'accepted' && result.payment_status !== 'paid' && result.payment_status !== 'verified' && (
                            <Link href={`/registration/pay?id=${encodeURIComponent(result.ticket_number)}`}>
                                <Button
                                    variant="default"
                                    size="default"
                                    className="text-xs font-bold flex items-center gap-2 bg-[#0F2D21] hover:bg-[#174232] text-white shadow-md"
                                >
                                    <CreditCard size={15} />
                                    Proceed to Bank Payment
                                </Button>
                            </Link>
                        )}

                        <Link href="/guidelines/submit">
                            <Button
                                variant="glass"
                                size="default"
                                className="text-xs font-semibold text-gray-700"
                            >
                                Submit Another Paper
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TicketStatusPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline="Track Full-Length Manuscript Status"
                subheadline="Real-time peer review tracking, editorial decisions, and publication milestones for Bio Web of Conferences (SCOPUS Indexed)."
                breadcrumb="Home / Track Paper"
            />

            <Suspense fallback={
                <div className="container mx-auto max-w-3xl px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0F2D21]" />
                </div>
            }>
                <TrackPaperContent />
            </Suspense>

            <Footer />
        </main>
    );
}
