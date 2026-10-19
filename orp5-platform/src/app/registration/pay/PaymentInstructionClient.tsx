"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import {
    CheckCircle2, Copy, Check, ExternalLink, Upload, AlertCircle,
    Loader2, ShieldCheck, Building2, Receipt, ChevronRight, X,
    FileCheck, Hash, Mail, Globe
} from "lucide-react";
import Link from "next/link";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "orp5ic@gmail.com";
export default function PaymentInstructionClient() {
    const searchParams = useSearchParams();
    const ticketId = searchParams?.get("id") || "";

    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "swift">("bank");
    const [copiedField, setCopiedField] = useState<string>("");
    const [claimStep, setClaimStep] = useState<"idle" | "form" | "uploading" | "otp" | "done">("idle");

    const [utrNumber, setUtrNumber] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofUrlState, setProofUrlState] = useState("");
    const [otp, setOtp] = useState("");
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimError, setClaimError] = useState("");

    useEffect(() => {
        if (!ticketId) { setLoading(false); return; }
        fetch(`/api/register/${ticketId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setRegistration(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [ticketId]);

    useEffect(() => {
        if (registration?.currency === "USD" || registration?.nationality === "foreign") {
            setPaymentMethod("swift");
        }
    }, [registration]);

    const copyTicketId = useCallback(() => {
        const text = ticketId;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }, [ticketId]);

    const copyField = useCallback((text: string, field: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedField(field);
                setTimeout(() => setCopiedField(""), 2000);
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(""), 2000);
        }
    }, []);

    const fallbackCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (e) {
            alert(`Copy this Ticket ID:\n\n${text}`);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    // Only UTR + proof required — no editable amount, no checkbox
    const canSubmitClaim = (
        utrNumber.trim().length >= 10 &&
        proofFile !== null
    );

    const handleRequestOtp = async () => {
        if (!canSubmitClaim) {
            setClaimError("Please fill all required fields and upload a payment screenshot.");
            return;
        }
        setClaimError("");
        setClaimLoading(true);

        try {
            // Step 1: Upload proof — required, blocks on failure
            let proofUrl = "";
            setClaimStep("uploading");
            const fd = new FormData();
            fd.append("file", proofFile!);
            const uploadRes = await fetch(`/api/register/${ticketId}/upload-proof`, {
                method: "POST",
                body: fd,
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                proofUrl = uploadData.url || "";
                setProofUrlState(proofUrl);
            } else {
                throw new Error("Screenshot upload failed. Please try again.");
            }

            if (!proofUrl) {
                throw new Error("Screenshot upload returned empty URL. Please try again.");
            }

            // Step 2: Send OTP
            const otpRes = await fetch(`/api/register/${ticketId}/send-otp`, { method: "POST" });
            const otpData = await otpRes.json();
            if (!otpRes.ok) throw new Error(otpData.error || "Failed to send verification code.");

            setClaimStep("otp");
            setClaimError("");
        } catch (err: any) {
            setClaimStep("form");
            setClaimError(err.message || "Something went wrong. Please try again or contact support.");
        } finally {
            setClaimLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setClaimError("Enter the 6-digit code sent to your email.");
            return;
        }
        setClaimError("");
        setClaimLoading(true);
        try {
            const claimRes = await fetch(`/api/register/${ticketId}/claim`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proof_url: proofUrlState,
                    utr_number: utrNumber.trim().toUpperCase(),
                    otp: otp.trim(),
                }),
            });

            const claimData = await claimRes.json();
            if (!claimRes.ok) throw new Error(claimData.error || "Claim failed. Please contact support.");
            setClaimStep("done");
        } catch (err: any) {
            setClaimError(err.message || "Invalid code or something went wrong.");
        } finally {
            setClaimLoading(false);
        }
    };

    const fee = registration?.fee_amount || registration?.feeAmount || 0;
    const currency = registration?.currency || "INR";
    const currencySymbol = currency === "USD" ? "$" : "₹";
    const name = registration?.full_name || registration?.fullName || "";

    // Guard: no ticketId in URL — must be after all hooks
    if (!ticketId) {
        return (
            <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="text-amber-500 w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold text-charcoal mb-2">No Ticket ID Found</h1>
                <p className="text-gray-600 max-w-md mb-8">
                    This page requires a valid Ticket ID. Please go back to the registration page and complete your registration first.
                </p>
                <Link href="/registration" className="px-6 py-2 bg-earth-green text-white rounded-lg hover:bg-earth-green/90 transition-colors font-bold">
                    Go to Registration
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
                <Loader2 className="animate-spin text-earth-green" size={40} />
            </div>
        );
    }

    if (!registration && ticketId) {
        return (
            <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold text-charcoal mb-2">Registration Not Found</h1>
                <p className="text-gray-600 text-center max-w-md">
                    We couldn't find a registration with this Ticket ID ({ticketId}). It may have been removed or the link might be invalid.
                </p>
                <Link href="/" className="mt-8 px-6 py-2 bg-earth-green text-white rounded-lg hover:bg-earth-green/90 transition-colors font-bold">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#123125] to-[#1e4d3b] pt-36 md:pt-40 pb-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-green-400/20 text-green-300 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-green-400/30">
                        <CheckCircle2 size={16} />
                        Registration Saved Successfully
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                        Complete Payment via Bank Transfer
                    </h1>
                    <p className="text-white/70 text-lg max-w-xl mx-auto">
                        Your spot is reserved. Follow the official bank details below to transfer your registration fee and confirm your ticket.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 mt-10">

                {/* ── Ticket ID Card ── */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-earth-green/20 p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Ticket ID</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-mono text-2xl md:text-3xl font-bold text-earth-green tracking-wider">
                                    {ticketId || "ORP5IC-IND-XXXXX"}
                                </span>
                                <button
                                    id="copy-ticket-id"
                                    onClick={copyTicketId}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${copied
                                        ? "bg-green-100 text-green-700 border border-green-300"
                                        : "bg-earth-green/10 text-earth-green hover:bg-earth-green/20 border border-earth-green/20"
                                        }`}
                                >
                                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>
                            {name && <p className="text-sm text-gray-500 mt-2">Registered for: <strong>{name}</strong></p>}
                        </div>
                        {fee > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center min-w-[140px]">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Amount Due</p>
                                <p className="text-3xl font-bold text-amber-700 font-mono">
                                    {currencySymbol}{fee.toLocaleString()}
                                </p>
                                <p className="text-xs text-amber-500 mt-1">{currency}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Official Bank Transfer Section ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-charcoal">Official Conference Bank Details</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Payment is accepted strictly via direct bank transfer</p>
                        </div>

                        {/* Toggle domestic / international */}
                        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("bank")}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    paymentMethod === "bank"
                                        ? "bg-earth-green text-white shadow-sm"
                                        : "text-gray-600 hover:text-charcoal"
                                }`}
                            >
                                <Building2 size={14} />
                                Domestic (NEFT / RTGS / IMPS)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("swift")}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    paymentMethod === "swift"
                                        ? "bg-earth-green text-white shadow-sm"
                                        : "text-gray-600 hover:text-charcoal"
                                }`}
                            >
                                <Globe size={14} />
                                International (SWIFT)
                            </button>
                        </div>
                    </div>

                    {/* METHOD 1: DOMESTIC BANK TRANSFER */}
                    {paymentMethod === "bank" && (
                        <div className="border border-earth-green/20 rounded-2xl p-6 bg-green-50/10 space-y-4">
                            <div className="flex items-center gap-2 text-earth-green font-bold text-sm">
                                <Building2 size={18} />
                                State Bank of India — Current Account Details
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 sm:col-span-2 shadow-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Beneficiary / Account Name</span>
                                    <span className="font-bold text-charcoal text-base">All India Agricultural Students Association</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 sm:col-span-2 shadow-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Bank Name & Branch</span>
                                    <span className="font-semibold text-charcoal text-sm">State Bank of India (SBI), NSC Beej Bhawan, Pusa Complex, New Delhi - 110012</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
                                    <div>
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Account Number</span>
                                        <span className="font-mono font-bold text-earth-green text-lg tracking-wide">44767771724</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyField("44767771724", "acc")}
                                        className="px-3 py-1.5 rounded-lg bg-earth-green text-white font-bold text-xs hover:bg-earth-green/90 transition flex items-center gap-1"
                                    >
                                        {copiedField === "acc" ? <Check size={13} /> : <Copy size={13} />}
                                        {copiedField === "acc" ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
                                    <div>
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">IFSC Code</span>
                                        <span className="font-mono font-bold text-earth-green text-lg tracking-wide">SBIN0005389</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyField("SBIN0005389", "ifsc")}
                                        className="px-3 py-1.5 rounded-lg bg-earth-green text-white font-bold text-xs hover:bg-earth-green/90 transition flex items-center gap-1"
                                    >
                                        {copiedField === "ifsc" ? <Check size={13} /> : <Copy size={13} />}
                                        {copiedField === "ifsc" ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Account Type</span>
                                    <span className="font-semibold text-charcoal text-sm">Current Account</span>
                                </div>

                                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Branch Code</span>
                                    <span className="font-semibold text-charcoal text-sm">005389</span>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 font-medium">
                                💬 <strong>Transfer Remarks:</strong> Please enter your Ticket ID <span className="font-mono font-bold">{ticketId}</span> in the payment description/remarks when transferring.
                            </div>
                        </div>
                    )}

                    {/* METHOD 2: INTERNATIONAL WIRE (SWIFT) */}
                    {paymentMethod === "swift" && (
                        <div className="border border-earth-green/20 rounded-2xl p-6 bg-white space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                <Globe size={18} />
                                International Wire / SWIFT Transfer Details (USD / EUR)
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 sm:col-span-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Beneficiary Name</span>
                                    <span className="font-bold text-charcoal text-base">All India Agricultural Students Association</span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Account Number</span>
                                        <span className="font-mono font-bold text-charcoal text-base">44767771724</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyField("44767771724", "acc")}
                                        className="px-3 py-1.5 rounded-lg bg-earth-green/10 text-earth-green font-bold text-xs hover:bg-earth-green/20 transition flex items-center gap-1"
                                    >
                                        {copiedField === "acc" ? <Check size={13} /> : <Copy size={13} />}
                                        {copiedField === "acc" ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">SWIFT / BIC Code</span>
                                        <span className="font-mono font-bold text-blue-700 text-base">SBININBB550</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyField("SBININBB550", "swift")}
                                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition flex items-center gap-1"
                                    >
                                        {copiedField === "swift" ? <Check size={13} /> : <Copy size={13} />}
                                        {copiedField === "swift" ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 sm:col-span-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Bank Name & Address</span>
                                    <span className="font-semibold text-charcoal text-xs">
                                        State Bank of India, NSC Beej Bhawan Branch, PUSA Complex, New Delhi - 110012, India
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step-by-Step Instructions */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-charcoal mb-3">How to Complete Verification</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-xs text-charcoal/80 leading-relaxed">
                            <li>Transfer <strong>{currencySymbol}{fee > 0 ? fee.toLocaleString() : "the due fee"}</strong> to the SBI account shown above using NEFT, RTGS, IMPS, or NetBanking.</li>
                            <li>Include your Ticket ID <strong>{ticketId}</strong> in the transfer remarks/description.</li>
                            <li>Save the transfer receipt / screenshot and copy your <strong>12-digit UTR / Transaction Reference Number</strong>.</li>
                            <li>Click the button below to submit your UTR and upload your payment proof for confirmation.</li>
                        </ol>
                    </div>
                </div>

                {/* ── CTA Action Bar ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {claimStep === "idle" && (
                            <button
                                id="i-have-paid"
                                onClick={() => setClaimStep("form")}
                                className="flex-1 flex items-center justify-center gap-3 bg-earth-green hover:bg-earth-green/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-base cursor-pointer"
                            >
                                <Receipt size={18} />
                                I have completed bank transfer → Submit UTR & Receipt
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                        Completed your bank transfer? Click above to enter your UTR and upload your receipt screenshot.
                    </p>
                </div>

                {/* ── Claim Form ── */}
                {claimStep === "form" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-green/30 p-6 mb-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-charcoal text-lg">Confirm Your Payment</h3>
                                <p className="text-xs text-gray-500 mt-0.5">All fields below are <strong className="text-red-500">required</strong> for verification</p>
                            </div>
                            <button onClick={() => { setClaimStep("idle"); setClaimError(""); }} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* UTR / Reference Number — the real gate */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Hash size={14} />
                                        UTR / Transaction Reference Number
                                        <span className="text-red-500 font-bold">*</span>
                                    </span>
                                </label>
                                <input
                                    id="utr-number"
                                    type="text"
                                    value={utrNumber}
                                    onChange={e => setUtrNumber(e.target.value)}
                                    placeholder="e.g. SBIN02261234567890"
                                    maxLength={40}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green outline-none font-mono uppercase tracking-wider text-sm ${utrNumber.length > 0 && utrNumber.trim().length < 10 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Found on your bank debit receipt, Net Banking confirmation, or bank SMS. Starts with bank code or digits (e.g. SBIN, HDFC, ICIC, UTR). Min 10 characters.
                                </p>
                                {utrNumber.length > 0 && utrNumber.trim().length < 10 && (
                                    <p className="text-xs text-red-500 mt-1 font-bold">⚠ Too short — Bank UTR / Transaction numbers are typically 12–22 characters.</p>
                                )}
                            </div>

                            {/* Fee display — readonly, from server */}
                            {fee > 0 && (
                                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                    <span className="text-sm font-bold text-gray-700">Amount to Verify</span>
                                    <span className="text-xl font-bold text-amber-700 font-mono">{currencySymbol}{fee.toLocaleString()} <span className="text-xs font-normal text-amber-500">{currency}</span></span>
                                </div>
                            )}

                            {/* Screenshot — REQUIRED */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <FileCheck size={14} />
                                        Payment Screenshot
                                        <span className="text-red-500 font-bold">*</span>
                                        <span className="text-gray-400 font-normal text-xs">(Cannot be skipped)</span>
                                    </span>
                                </label>
                                <label
                                    id="proof-upload"
                                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${proofFile ? 'border-earth-green bg-green-50/40' : 'border-gray-300 hover:border-earth-green/50 bg-gray-50 hover:bg-green-50/20'}`}
                                >
                                    {proofFile ? (
                                        <div className="text-center">
                                            <CheckCircle2 size={28} className="text-earth-green mx-auto mb-2" />
                                            <p className="font-bold text-earth-green text-sm">{proofFile.name}</p>
                                            <p className="text-xs text-gray-400">{(proofFile.size / 1024).toFixed(0)} KB · Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">Click to upload bank transfer receipt / debit slip</p>
                                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB · <strong className="text-red-500">Required</strong></p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={e => setProofFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                                {!proofFile && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">⚠ Upload your bank transfer payment confirmation screenshot to proceed.</p>
                                )}
                            </div>

                            {claimError && (
                                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {claimError}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                id="submit-claim"
                                onClick={handleRequestOtp}
                                disabled={claimLoading || !canSubmitClaim}
                                className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base ${canSubmitClaim && !claimLoading
                                    ? 'bg-earth-green hover:bg-earth-green/90 text-white shadow-md hover:shadow-lg cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {claimLoading
                                    ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
                                    : <>Submit Payment Claim <ChevronRight size={18} /></>
                                }
                            </button>

                            {!canSubmitClaim && (
                                <p className="text-xs text-center text-gray-400">
                                    {utrNumber.trim().length < 10 && 'Enter your UTR number · '}
                                    {!proofFile && 'Upload payment screenshot'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Uploading State ── */}
                {claimStep === "uploading" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
                        <Loader2 size={36} className="animate-spin text-earth-green mx-auto mb-3" />
                        <p className="font-bold text-charcoal">Uploading your payment proof...</p>
                        <p className="text-sm text-gray-400 mt-1">Please do not close this tab.</p>
                    </div>
                )}

                {/* ── OTP Step ── */}
                {claimStep === "otp" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-green/30 p-8 mb-6 animate-in slide-in-from-bottom-4 duration-300 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                            <Mail size={28} className="text-earth-green" />
                        </div>
                        <h3 className="font-bold text-xl text-charcoal mb-2">Check Your Email</h3>
                        <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
                            We've sent a 6-digit verification code to <strong>{registration?.email}</strong>. Enter it below to confirm this payment claim.
                        </p>

                        <div className="max-w-xs mx-auto">
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="------"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 border-2 border-gray-200 rounded-xl focus:border-earth-green focus:ring-4 focus:ring-earth-green/20 outline-none transition-all mb-4"
                            />

                            {claimError && (
                                <div className="text-sm text-red-500 font-bold mb-4">{claimError}</div>
                            )}

                            <button
                                onClick={handleVerifyOtp}
                                disabled={claimLoading || otp.length !== 6}
                                className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base ${otp.length === 6 && !claimLoading
                                    ? 'bg-earth-green hover:bg-earth-green/90 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {claimLoading
                                    ? <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                                    : <>Verify & Submit</>
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Claim Done ── */}
                {claimStep === "done" && (
                    <div className="bg-green-50 rounded-2xl shadow-sm border border-green-200 p-8 mb-6 text-center animate-in slide-in-from-bottom-4 duration-300">
                        <CheckCircle2 size={48} className="text-earth-green mx-auto mb-4" />
                        <h3 className="font-bold text-xl text-charcoal mb-2">Payment Claim Received!</h3>
                        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                            Our team has been notified and will verify your payment within <strong>24–48 hours</strong>. You'll receive a confirmation email once verified.
                        </p>
                        <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-600 mb-6 inline-block">
                            <span className="font-mono font-bold text-earth-green">{ticketId}</span> — Payment Claim Under Review
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={`/registration/success?id=${ticketId}`} className="px-6 py-3 bg-earth-green text-white rounded-xl font-bold hover:bg-earth-green/90 transition">
                                View Receipt
                            </Link>
                            <Link href="/" className="px-6 py-3 bg-white text-charcoal rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Need Help ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start">
                    <div className="text-amber-500 shrink-0 mt-0.5">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-charcoal text-sm mb-1">Need help with payment?</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            If you face issues making the bank transfer or need assistance, email us at{" "}
                            <a href="mailto:info@orp5ic.com" className="text-earth-green font-bold hover:underline">info@orp5ic.com</a>{" "}
                            with your Ticket ID: <span className="font-mono font-bold">{ticketId}</span>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
