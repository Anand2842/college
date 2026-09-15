"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    AlertTriangle,
    QrCode,
    ShieldCheck,
    CreditCard,
    Building,
    FileText,
    Sparkles,
    ArrowLeft,
    Check,
    X
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { getCategoryBandStyle, getCountryFlag } from '@/components/admin/AttendeeBadge';

export default function PublicScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualId, setManualId] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [registrant, setRegistrant] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleScan = (result: any) => {
        if (result && result[0] && result[0].rawValue) {
            if (verificationStatus === 'idle' && !scanResult) {
                const code = result[0].rawValue;
                setScanResult(code);
                verifyTicket(code);
            }
        }
    };

    const handleError = (error: any) => {
        setErrorMsg("Camera error: " + (error?.message || "Please grant camera access."));
        setVerificationStatus('error');
    };

    const verifyTicket = async (ticketId: string) => {
        setVerificationStatus('loading');
        setErrorMsg(null);

        try {
            const res = await fetch('/api/admin/verify-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setRegistrant(data.registrant);
                setVerificationStatus('success');
            } else {
                setVerificationStatus('error');
                setErrorMsg(data.message || 'Ticket not found in conference database.');
            }
        } catch (e) {
            setVerificationStatus('error');
            setErrorMsg('Network error. Please verify connection.');
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setRegistrant(null);
        setVerificationStatus('idle');
        setErrorMsg(null);
        setManualId("");
    };

    const bandStyle = registrant ? getCategoryBandStyle(registrant.category) : null;
    const countryFlag = registrant ? getCountryFlag(registrant.country) : "🇮🇳";

    return (
        <div className="min-h-screen bg-[#063F2B] text-gray-900 flex flex-col justify-between selection:bg-[#d99b26]/30">
            {/* Top Bar */}
            <header className="bg-[#0C513A] text-white px-4 py-3.5 border-b border-[#d99b26]/30 shadow-md sticky top-0 z-30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                        <img src="/orp5-logo.png" alt="ORP-5" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tight leading-none text-white flex items-center gap-1.5">
                            <span>ORP-</span><span className="text-[#d99b26]">5</span>
                            <span className="text-gray-300 font-normal text-xs">&bull; Badge Scanner</span>
                        </h1>
                        <p className="text-[10px] text-gray-300 font-medium leading-none mt-0.5">
                            Official Delegate Verification Portal
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={resetScan}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        title="Reset Scanner"
                    >
                        <RefreshCw size={15} />
                    </button>
                    <Link
                        href="/"
                        className="text-[11px] font-bold text-[#d99b26] hover:text-white px-2 py-1 rounded-md bg-white/5 border border-[#d99b26]/30"
                    >
                        Home
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-lg mx-auto">
                <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                    
                    {/* Viewfinder Section */}
                    {verificationStatus === 'idle' && (
                        <div className="flex flex-col">
                            <div className="relative bg-black min-h-[320px] flex items-center justify-center overflow-hidden">
                                <Scanner
                                    onScan={handleScan}
                                    onError={handleError}
                                    styles={{ container: { width: '100%', height: '320px' } }}
                                    components={{ finder: true }}
                                />
                                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Camera
                                </div>
                                <div className="absolute bottom-3 text-center left-0 right-0 pointer-events-none">
                                    <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
                                        Point camera at Attendee QR Code
                                    </span>
                                </div>
                            </div>

                            {/* Manual ID Input Drawer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
                                    Or Enter ID Manually
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. ORP5IC-IND-38762"
                                        value={manualId}
                                        onChange={(e) => setManualId(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && manualId && verifyTicket(manualId)}
                                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#123125]"
                                    />
                                    <button
                                        onClick={() => verifyTicket(manualId)}
                                        disabled={!manualId}
                                        className="bg-[#123125] text-white hover:bg-[#1a4534] disabled:opacity-50 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {verificationStatus === 'loading' && (
                        <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-3">
                            <Loader2 className="animate-spin text-[#123125]" size={48} />
                            <h3 className="text-base font-bold text-gray-900">Verifying Delegate Records...</h3>
                            <p className="text-xs text-gray-500 font-mono">{scanResult || manualId}</p>
                        </div>
                    )}

                    {/* Verified Delegate Profile Card */}
                    {verificationStatus === 'success' && registrant && (() => {
                        const isPaidConfirmed = registrant.isPaid || 
                                               registrant.paymentStatus?.toLowerCase().includes('paid') || 
                                               registrant.paymentStatus?.toLowerCase().includes('confirmed') || 
                                               registrant.paymentStatus?.toLowerCase().includes('official') || 
                                               registrant.paymentStatus?.toLowerCase().includes('exempt');

                        return (
                            <div className="flex flex-col">
                                {/* Verification Banner */}
                                <div className={`p-4 text-center border-b flex flex-col items-center justify-center ${
                                    isPaidConfirmed
                                        ? "bg-emerald-50 text-emerald-950 border-emerald-100"
                                        : "bg-amber-50 text-amber-950 border-amber-200"
                                }`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${
                                        isPaidConfirmed
                                            ? "bg-emerald-600 text-white"
                                            : "bg-amber-500 text-white"
                                    }`}>
                                        {isPaidConfirmed ? <CheckCircle2 size={30} /> : <AlertTriangle size={28} />}
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        {isPaidConfirmed ? "VERIFIED • ACCESS GRANTED" : "PAYMENT PENDING / UNPAID"}
                                    </h2>
                                    <p className="text-xs font-semibold mt-0.5 opacity-90">
                                        {isPaidConfirmed
                                            ? "Official Conference Credentials Confirmed"
                                            : "⚠️ Direct Attendee to Registration Desk for Payment"}
                                    </p>
                                </div>

                                {/* Attendee Info Body */}
                                <div className="p-5 space-y-4">
                                    {/* Name, Designation & Category */}
                                    <div className="flex items-start justify-between gap-3 border-b pb-4">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                                Attendee Name
                                            </span>
                                            <h3 className="text-2xl font-black text-[#123125] leading-tight uppercase">
                                                {registrant.name}
                                            </h3>
                                            {registrant.designation && (
                                                <p className="text-xs text-gray-600 font-semibold mt-0.5">
                                                    {registrant.designation}
                                                </p>
                                            )}
                                            {registrant.institution && (
                                                <p className="text-xs text-gray-500 font-medium mt-1 leading-snug">
                                                    {registrant.institution}
                                                </p>
                                            )}
                                        </div>

                                        {/* Role Pill */}
                                        <div
                                            className="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider text-white shadow-xs shrink-0 text-center"
                                            style={{ backgroundColor: bandStyle?.bg || '#0C513A' }}
                                        >
                                            {registrant.category}
                                        </div>
                                    </div>

                                    {/* 4 Key Metadata Tiles */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* Ticket ID */}
                                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Ticket ID
                                            </span>
                                            <p className="font-mono font-bold text-xs text-gray-800 mt-0.5 truncate">
                                                {registrant.ticketId}
                                            </p>
                                        </div>

                                        {/* Country */}
                                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Country
                                            </span>
                                            <p className="font-bold text-xs text-gray-800 mt-0.5 flex items-center gap-1">
                                                <span>{countryFlag}</span>
                                                <span>{registrant.country || "INDIA"}</span>
                                            </p>
                                        </div>

                                        {/* Attendance Mode */}
                                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Attendance Mode
                                            </span>
                                            <p className="font-bold text-xs text-gray-900 mt-0.5">
                                                {registrant.mode}
                                            </p>
                                        </div>

                                        {/* Payment Status */}
                                        <div className={`p-3 rounded-2xl border ${
                                            isPaidConfirmed ? "bg-emerald-50/60 border-emerald-200" : "bg-amber-50/70 border-amber-200"
                                        }`}>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Payment Status
                                            </span>
                                            <p className={`font-black text-xs mt-0.5 ${
                                                isPaidConfirmed ? "text-emerald-700" : "text-amber-800"
                                            }`}>
                                                {registrant.paymentStatus || (isPaidConfirmed ? "Paid & Confirmed" : "Awaiting Payment (Unpaid)")}
                                            </p>
                                            {registrant.feeAmount && !isPaidConfirmed && (
                                                <p className="text-[10px] font-bold text-amber-900 mt-0.5">
                                                    Due: {registrant.currency === 'USD' ? '$' : '₹'}{Number(registrant.feeAmount).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Abstract Details if submitted */}
                                    {registrant.hasAbstract && (
                                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="font-bold text-purple-950 uppercase text-[10px] tracking-wider">
                                                    Research Abstract
                                                </span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                    registrant.abstractStatus === 'accepted' ? 'bg-purple-800 text-white' : 'bg-purple-200 text-purple-900'
                                                }`}>
                                                    {registrant.abstractStatus === 'accepted' ? '★ Accepted Presenter' : '📝 Submitted'}
                                                </span>
                                            </div>
                                            {registrant.abstractTitle && (
                                                <p className="font-medium text-purple-950 text-xs line-clamp-2 italic">
                                                    &ldquo;{registrant.abstractTitle}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Conference Entry Checkpoints & Privileges */}
                                    <div className={`p-3 rounded-2xl border text-xs space-y-2 ${
                                        isPaidConfirmed ? "bg-gray-50 border-gray-100" : "bg-amber-50/40 border-amber-200/60"
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Delegate Privileges & Access
                                            </span>
                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                                isPaidConfirmed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                                            }`}>
                                                {isPaidConfirmed ? "ALL PRIVILEGES ACTIVE" : "PAYMENT REQUIRED"}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                                            {isPaidConfirmed ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-emerald-800">
                                                        <Check size={13} className="text-emerald-600 shrink-0" /> Badge Issued
                                                    </div>
                                                    <div className="flex items-center gap-1 text-emerald-800">
                                                        <Check size={13} className="text-emerald-600 shrink-0" /> Kit Eligible
                                                    </div>
                                                    <div className="flex items-center gap-1 text-emerald-800">
                                                        <Check size={13} className="text-emerald-600 shrink-0" /> Lunch Pass
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-1 text-amber-800">
                                                        <AlertTriangle size={12} className="text-amber-600 shrink-0" /> Badge On-Hold
                                                    </div>
                                                    <div className="flex items-center gap-1 text-amber-800">
                                                        <AlertTriangle size={12} className="text-amber-600 shrink-0" /> Kit Ineligible
                                                    </div>
                                                    <div className="flex items-center gap-1 text-amber-800">
                                                        <AlertTriangle size={12} className="text-amber-600 shrink-0" /> Lunch Inactive
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        {!isPaidConfirmed && (
                                            <p className="text-[10px] text-amber-800/90 font-semibold bg-amber-100/60 p-1.5 rounded-lg">
                                                Collect fee at registration counter to authorize credentials & conference kit.
                                            </p>
                                        )}
                                    </div>

                                    {/* Single Next Scan Action Button */}
                                    <button
                                        onClick={resetScan}
                                        className="w-full py-3.5 px-4 bg-[#123125] text-white rounded-2xl font-black text-sm tracking-wide hover:bg-[#1a4534] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                                    >
                                        <RefreshCw size={16} /> Scan Next Badge
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Invalid / Not Found State */}
                    {verificationStatus === 'error' && (
                        <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <XCircle size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-red-700 uppercase tracking-tight">Invalid Credential</h3>
                                <p className="text-xs text-gray-600 mt-1 max-w-xs">{errorMsg}</p>
                            </div>
                            <div className="w-full pt-2">
                                <button
                                    onClick={resetScan}
                                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition cursor-pointer"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-3 text-xs text-gray-300/80 font-medium">
                ORP-5 International Conference &bull; NASC Complex, New Delhi, India
            </footer>
        </div>
    );
}
