'use client';

import { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import {
    Loader2, Search, CheckCircle2, Clock, XCircle, AlertTriangle,
    Ticket, FileText, MailCheck, Send
} from 'lucide-react';
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-xs">
                <CheckCircle2 size={13} /> Confirmed & Paid
            </span>
        );
    }
    if (status === 'rejected') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-xs">
                <XCircle size={13} /> Not Approved
            </span>
        );
    }
    if (paymentStatus === 'payment_claimed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">
                <Clock size={13} /> Payment Under Verification
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-xs">
            <Clock size={13} /> Pending Review
        </span>
    );
}

function AbstractStatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
        accepted: { label: 'Accepted', cls: 'bg-green-100 text-green-800', icon: <CheckCircle2 size={13} /> },
        rejected: { label: 'Not Accepted', cls: 'bg-red-100 text-red-800', icon: <XCircle size={13} /> },
        revision: { label: 'Revision Requested', cls: 'bg-blue-100 text-blue-800', icon: <AlertTriangle size={13} /> },
        under_review: { label: 'Under Review', cls: 'bg-purple-100 text-purple-800', icon: <Clock size={13} /> },
        pending: { label: 'Pending Review', cls: 'bg-yellow-100 text-yellow-800', icon: <Clock size={13} /> },
    };
    const s = map[status] || map.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${s.cls}`}>
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
            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <MailCheck size={16} /> {msg}
            </div>
        );
    }
    if (state === 'error') {
        return (
            <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle size={16} /> {msg}
            </div>
        );
    }

    return (
        <button
            onClick={handleResend}
            disabled={state === 'loading'}
            className="flex items-center gap-2 text-sm font-bold text-[#123125] border border-[#123125] px-4 py-2.5 rounded-xl hover:bg-[#123125] hover:text-white transition-all disabled:opacity-60"
        >
            {state === 'loading'
                ? <><Loader2 size={15} className="animate-spin" /> Sending...</>
                : <><Send size={15} /> Resend Ticket Email</>
            }
        </button>
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

    const accentColor = (result as RegistrationResult)?.status === 'approved' || (result as RegistrationResult)?.payment_status === 'paid'
        ? 'bg-green-500'
        : (result as RegistrationResult)?.status === 'rejected'
            ? 'bg-red-500'
            : 'bg-yellow-400';

    return (
        <main className="min-h-screen bg-[#F7F9F7] font-sans">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-[#123125] to-[#1a5c26] pt-36 md:pt-40 pb-14 px-6">
                <div className="container mx-auto max-w-2xl text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-green-200 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                        <Search size={12} />
                        ORP-5 Status Portal
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                        Track Your Status
                    </h1>
                    <p className="text-green-200 text-sm md:text-base max-w-md mx-auto">
                        Look up your conference registration or abstract submission status — no login required.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-xl px-6 py-12">

                {/* Tab Switcher */}
                <div className="flex p-1 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
                    <button
                        onClick={() => handleTabChange('registration')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'registration'
                            ? 'bg-[#123125] text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <Ticket size={15} /> Registration
                    </button>
                    <button
                        onClick={() => handleTabChange('abstract')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'abstract'
                            ? 'bg-[#123125] text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <FileText size={15} /> Abstract Submission
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {activeTab === 'registration' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Ticket ID
                                        <span className="ml-1 text-xs font-normal text-gray-400">(e.g. ORP5IC-IND-75230)</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={ticketId}
                                        onChange={e => setTicketId(e.target.value.toUpperCase())}
                                        placeholder="ORP5IC-IND-00000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#123125] focus:border-[#123125] transition-all font-mono uppercase placeholder:normal-case placeholder:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Registered Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={regEmail}
                                        onChange={e => setRegEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#123125] focus:border-[#123125] transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Email Used During Submission
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={absEmail}
                                        onChange={e => setAbsEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#123125] focus:border-[#123125] transition-all placeholder:text-gray-300"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">We'll show all abstracts submitted under this email.</p>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#123125] hover:bg-[#0f2a1f] text-white font-bold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-60"
                        >
                            {isLoading
                                ? <><Loader2 size={18} className="animate-spin" /> Checking...</>
                                : <><Search size={18} /> Check Status</>
                            }
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        🔒 Both fields are required for your privacy and security.
                    </p>
                </div>

                {/* Result Card */}
                {result && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className={`h-1.5 w-full ${accentColor}`} />

                        <div className="p-8">
                            {result.type === 'registration' && (() => {
                                const r = result as RegistrationResult;
                                const sym = r.currency === 'USD' ? '$' : '₹';
                                return (
                                    <>
                                        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                                            <RegistrationStatusBadge status={r.status} paymentStatus={r.payment_status} />
                                            <span className="font-mono text-sm font-bold bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-[#123125]">
                                                {r.ticket_number}
                                            </span>
                                        </div>

                                        <div className="space-y-2.5 text-sm mb-6">
                                            {[
                                                { label: 'Name', value: r.full_name },
                                                { label: 'Email', value: r.email_masked },
                                                { label: 'Institution', value: r.institution },
                                                { label: 'Category', value: r.category },
                                                { label: 'Mode', value: r.mode === 'physical' ? 'Physical (In-Person)' : 'Virtual' },
                                                { label: 'Fee', value: `${sym}${r.fee_amount?.toLocaleString()}` },
                                                {
                                                    label: 'Payment', value: ({
                                                        paid: '✅ Paid',
                                                        payment_claimed: '⏳ Under Verification',
                                                        awaiting_payment: '⚠️ Payment Pending',
                                                    } as Record<string, string>)[r.payment_status] || r.payment_status
                                                },
                                                {
                                                    label: 'Registered', value: new Date(r.registered_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })
                                                },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between gap-4 pb-2.5 border-b border-gray-50 last:border-0">
                                                    <span className="text-gray-500 shrink-0">{label}</span>
                                                    <span className="text-gray-900 font-semibold text-right capitalize">{value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <ResendButton ticketId={r.ticket_number} email={regEmail} />
                                            {r.payment_status === 'awaiting_payment' && (
                                                <Link
                                                    href={`/registration/pay?id=${r.ticket_number}`}
                                                    className="flex items-center justify-center gap-2 text-sm font-bold bg-[#123125] text-white px-4 py-2.5 rounded-xl hover:bg-[#0f2a1f] transition-colors"
                                                >
                                                    Complete Payment →
                                                </Link>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}

                            {result.type === 'abstract' && (() => {
                                const a = result as AbstractResult;
                                return (
                                    <>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Showing <span className="font-bold text-gray-800">{a.submissions.length}</span> submission{a.submissions.length !== 1 ? 's' : ''} for <span className="font-mono">{a.email_masked}</span>
                                        </p>

                                        <div className="space-y-4">
                                            {a.submissions.map((sub, i) => (
                                                <div key={sub.id} className="border border-gray-100 rounded-xl p-4">
                                                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                                                        <span className="text-xs font-semibold text-gray-400">#{i + 1}</span>
                                                        <AbstractStatusBadge status={sub.status} />
                                                    </div>
                                                    <p className="font-bold text-gray-900 text-sm leading-snug mb-3">{sub.title}</p>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                                                        <span>Abstract ID: <span className="text-gray-700 font-bold font-mono">ORP5-ABS-2026-{sub.id.substring(0, 8).toUpperCase()}</span></span>
                                                        <span>Category: <span className="text-gray-700 font-medium">{sub.category}</span></span>
                                                        <span>Theme: <span className="text-gray-700 font-medium">{sub.topic}</span></span>
                                                        <span>Author: <span className="text-gray-700 font-medium">{sub.author_name}</span></span>
                                                        <span>Submitted: <span className="text-gray-700 font-medium">{new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                                                    </div>
                                                    {sub.status === 'revision' && (
                                                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1.5">
                                                            <p className="font-bold">✏️ Revision Requested</p>
                                                            <p>The review committee has sent comments to your registered email. To view them and resubmit, you need a portal account.</p>
                                                            <div className="flex gap-3 mt-2 flex-wrap">
                                                                <Link href={`/login?mode=signup&email=${encodeURIComponent(absEmail)}`} className="font-bold underline">Create free account</Link>
                                                                <span className="text-blue-400">or</span>
                                                                <Link href="/login" className="font-bold underline">Log in</Link>
                                                            </div>
                                                            <p className="text-blue-600">Use the <strong>same email</strong> you submitted with — your submission links automatically.</p>
                                                        </div>
                                                    )}
                                                    {sub.status === 'accepted' && (
                                                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                                                            🎉 Accepted! Further details will be emailed to you.
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-gray-400 mt-6">
                    Can't find your details?{' '}
                    <a href="mailto:info@orp5ic.com" className="text-[#123125] font-semibold hover:underline">
                        Contact us
                    </a>
                </p>
            </div>

            <Footer />
        </main>
    );
}
