'use client';

import { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { PageHero } from '@/components/organisms/PageHero';
import {
    Loader2, Search, CheckCircle2, Clock, XCircle, AlertTriangle,
    Ticket, FileText, MailCheck, Send, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

type TabType = 'registration' | 'abstract';

type RegistrationResult = {
    type: 'registration';
    ticket_number: string;
    full_name: string;
    email_masked: string;
    category: string;
    mode: string;
    nationality: string;
    institution: string;
    fee_amount: number;
    currency: string;
    status: string;
    payment_status: string;
    registered_at: string;
};

type AbstractResult = {
    type: 'abstract';
    email_masked: string;
    submissions: {
        id: string;
        title: string;
        author_name: string;
        institution: string;
        category: string;
        topic: string;
        status: string;
        submitted_at: string;
    }[];
};

type LookupResult = RegistrationResult | AbstractResult;

function RegistrationStatusBadge({ status, paymentStatus }: { status: string; paymentStatus: string }) {
    if (status === 'approved' || paymentStatus === 'paid') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs">
                <CheckCircle2 size={13} className="text-earth-green" /> Confirmed & Paid
            </span>
        );
    }
    if (status === 'rejected') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full font-bold text-xs">
                <XCircle size={13} className="text-red-600" /> Not Approved
            </span>
        );
    }
    if (paymentStatus === 'payment_claimed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold text-xs">
                <Clock size={13} className="text-blue-600" /> Payment Under Verification
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-xs">
            <Clock size={13} className="text-amber-600" /> Pending Review
        </span>
    );
}

function AbstractStatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
        accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle2 size={13} className="text-earth-green" /> },
        rejected: { label: 'Not Accepted', cls: 'bg-red-50 text-red-800 border-red-200', icon: <XCircle size={13} className="text-red-600" /> },
        revision: { label: 'Revision Requested', cls: 'bg-blue-50 text-blue-800 border-blue-200', icon: <AlertTriangle size={13} className="text-blue-600" /> },
        under_review: { label: 'Under Review', cls: 'bg-purple-50 text-purple-800 border-purple-200', icon: <Clock size={13} className="text-purple-600" /> },
        pending: { label: 'Pending Review', cls: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Clock size={13} className="text-amber-600" /> },
    };
    const s = map[status] || map.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-bold text-xs border ${s.cls}`}>
            {s.icon} {s.label}
        </span>
    );
}

function ResendButton({ ticketId, email }: { ticketId: string; email: string }) {
    const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleResend = async () => {
        setState('loading');
        try {
            const res = await fetch('/api/resend-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticket_id: ticketId, email }),
            });
            const data = await res.json();
            if (res.ok) {
                setState('sent');
                setMsg(data.message || 'Email sent!');
            } else {
                setState('error');
                setMsg(data.error || 'Failed to resend. Please try again.');
            }
        } catch {
            setState('error');
            setMsg('Network error. Please try again.');
        }
    };

    if (state === 'sent') {
        return (
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                <MailCheck size={16} /> {msg}
            </div>
        );
    }
    if (state === 'error') {
        return (
            <div className="flex items-center gap-2 text-red-700 text-xs bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertTriangle size={16} /> {msg}
            </div>
        );
    }

    return (
        <Button
            onClick={handleResend}
            disabled={state === 'loading'}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider font-bold"
        >
            {state === 'loading'
                ? <><Loader2 size={13} className="animate-spin mr-1.5" /> Sending...</>
                : <><Send size={13} className="mr-1.5" /> Resend Ticket Confirmation</>
            }
        </Button>
    );
}

export default function TicketStatusPage() {
    const [activeTab, setActiveTab] = useState<TabType>('registration');

    // Registration form state
    const [ticketId, setTicketId] = useState('');
    const [regEmail, setRegEmail] = useState('');

    // Abstract form state
    const [absEmail, setAbsEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LookupResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setResult(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        const payload =
            activeTab === 'registration'
                ? { type: 'registration', ticket_id: ticketId, email: regEmail }
                : { type: 'abstract', email: absEmail };

        try {
            const res = await fetch('/api/ticket-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
            } else {
                setResult(data);
            }
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline="Check Registration & Abstract Status"
                subheadline="Instant verification of your conference delegate pass or research abstract review status."
                breadcrumb="Home / Ticket Status"
            />

            <div className="container mx-auto max-w-2xl px-6 relative z-20 mt-10 md:mt-12 pb-16">

                {/* Tab Switcher */}
                <div className="flex p-1.5 bg-white rounded-2xl border border-earth-green/15 shadow-lg mb-8">
                    <button
                        onClick={() => handleTabChange('registration')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'registration'
                            ? 'bg-earth-green text-rice-gold shadow-md'
                            : 'text-charcoal/60 hover:text-charcoal'
                            }`}
                    >
                        <Ticket size={16} /> Registration Ticket
                    </button>
                    <button
                        onClick={() => handleTabChange('abstract')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'abstract'
                            ? 'bg-earth-green text-rice-gold shadow-md'
                            : 'text-charcoal/60 hover:text-charcoal'
                            }`}
                    >
                        <FileText size={16} /> Abstract Status
                    </button>
                </div>

                {/* Search Form Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-earth-green/15 p-8 md:p-10 mb-8 luxury-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'registration' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2">
                                        Ticket / Reference ID *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. ORP5-2026-XXXX"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-charcoal focus:outline-none focus:border-earth-green transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2">
                                        Registered Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john.doe@university.edu"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-charcoal focus:outline-none focus:border-earth-green transition-colors"
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2">
                                    Author Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="author@institution.org"
                                    value={absEmail}
                                    onChange={(e) => setAbsEmail(e.target.value)}
                                    className="w-full bg-[#FAF9F5] border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-charcoal focus:outline-none focus:border-earth-green transition-colors"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-700 text-xs sm:text-sm font-medium rounded-2xl border border-red-200">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="premium"
                            size="lg"
                            disabled={isLoading}
                            className="w-full text-xs uppercase tracking-wider font-bold"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Records...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 justify-center">
                                    Look Up Status <ArrowRight size={15} />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Result Display */}
                {result && result.type === 'registration' && (
                    <div className="bg-white rounded-3xl shadow-xl border border-earth-green/15 p-8 md:p-10 luxury-card space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                                    Ticket Reference
                                </span>
                                <h3 className="font-mono font-bold text-xl text-earth-green">{result.ticket_number}</h3>
                            </div>
                            <RegistrationStatusBadge status={result.status} paymentStatus={result.payment_status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                            <div>
                                <span className="text-charcoal/50 block">Delegate Name</span>
                                <p className="font-bold text-charcoal">{result.full_name}</p>
                            </div>
                            <div>
                                <span className="text-charcoal/50 block">Masked Email</span>
                                <p className="font-medium text-charcoal">{result.email_masked}</p>
                            </div>
                            <div>
                                <span className="text-charcoal/50 block">Participation Category</span>
                                <p className="font-bold text-charcoal">{result.category}</p>
                            </div>
                            <div>
                                <span className="text-charcoal/50 block">Attendance Mode</span>
                                <p className="font-bold text-charcoal uppercase">{result.mode}</p>
                            </div>
                            <div>
                                <span className="text-charcoal/50 block">Institution</span>
                                <p className="font-medium text-charcoal">{result.institution}</p>
                            </div>
                            <div>
                                <span className="text-charcoal/50 block">Registration Fee</span>
                                <p className="font-bold text-earth-green">{result.currency} {result.fee_amount}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <ResendButton ticketId={result.ticket_number} email={regEmail} />
                        </div>
                    </div>
                )}

                {result && result.type === 'abstract' && (
                    <div className="bg-white rounded-3xl shadow-xl border border-earth-green/15 p-8 md:p-10 luxury-card space-y-6 animate-in fade-in duration-300">
                        <div className="pb-4 border-b border-gray-100">
                            <h3 className="font-serif font-bold text-xl text-charcoal mb-1">Submissions for {result.email_masked}</h3>
                            <p className="text-xs text-charcoal/60">Found {result.submissions.length} submission record(s)</p>
                        </div>

                        <div className="space-y-4">
                            {result.submissions.map((sub) => (
                                <div key={sub.id} className="p-6 rounded-2xl bg-[#FAF9F5] border border-gray-100 flex flex-col justify-between gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <h4 className="font-serif font-bold text-base text-charcoal">{sub.title}</h4>
                                        <AbstractStatusBadge status={sub.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/70">
                                        <p><span className="text-charcoal/50">Author:</span> {sub.author_name}</p>
                                        <p><span className="text-charcoal/50">Track:</span> {sub.topic || sub.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
