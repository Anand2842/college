"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import {
    CheckCircle2, Copy, Check, ExternalLink, Upload, AlertCircle,
    Loader2, ShieldCheck, Building2, Receipt, ChevronRight, X,
    FileCheck, Hash, Mail
} from "lucide-react";
import Link from "next/link";

const SBI_COLLECT_URL = "https://onlinesbi.sbi.bank.in/sbicollect/icollecthome.htm?corpID=6958659#";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "orp5ic@gmail.com";
export default function PaymentInstructionClient() {
    const searchParams = useSearchParams();
    const ticketId = searchParams?.get("id") || "";

    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
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
                        Complete Your Payment
                    </h1>
                    <p className="text-white/70 text-lg max-w-xl mx-auto">
                        Your spot is reserved. Follow the steps below to pay via SBI Collect and confirm your registration.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-4xl -mt-6 pb-20 relative z-10">

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

                {/* ── Step-by-Step Guide ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                    <h2 className="text-lg font-bold text-charcoal mb-6">How to Pay via SBI Collect</h2>
                    <div className="space-y-0">
                        {[
                            {
                                num: 1,
                                title: "Copy your Ticket ID",
                                desc: "Tap the Copy button above. Keep it ready to paste on the payment page.",
                            },
                            {
                                num: 2,
                                title: `Click "Pay Now via SBI Collect" below`,
                                desc: "Opens in a new tab. You stay on this page.",
                            },
                            {
                                num: 3,
                                title: "Fill the SBI form exactly like this",
                                desc: null,
                                table: [
                                    { field: "Ticket ID / Reference No.", value: ticketId, highlight: true },
                                    { field: "Mobile Number", value: "Same number you used in registration" },
                                    { field: "Remitter Name", value: "Same name you used in registration" },
                                    { field: "Amount", value: `${currencySymbol}${fee > 0 ? fee.toLocaleString() : "as shown on your fee table"}`, highlight: true },
                                ],
                            },
                            {
                                num: 4,
                                title: "Note your UTR / Reference number from the SBI receipt",
                                desc: "SBI generates a unique UTR after every successful payment (e.g. SBIN02261234567890). You will need this in the next step.",
                            },
                            {
                                num: 5,
                                title: `Click "I have paid" and submit your receipt`,
                                desc: "Upload your SBI Collect screenshot and enter the UTR number. Our team verifies within 24–48 hours.",
                            },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-earth-green text-white flex items-center justify-center font-bold text-sm shrink-0 z-10">
                                        {step.num}
                                    </div>
                                    {i < 4 && <div className="w-0.5 bg-earth-green/20 flex-1 my-1" />}
                                </div>
                                <div className="pb-8 flex-1">
                                    <p className="font-bold text-charcoal mb-1">{step.title}</p>
                                    {step.desc && <p className="text-sm text-gray-500">{step.desc}</p>}
                                    {(step as any).table && (
                                        <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                                                SBI Collect Form — Fill It Like This
                                            </div>
                                            {(step as any).table.map((row: any, j: number) => (
                                                <div key={j} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 px-4 py-3 text-sm border-b border-gray-100 last:border-none ${row.highlight ? "bg-green-50" : ""}`}>
                                                    <span className="text-gray-500 shrink-0 sm:w-40">{row.field}</span>
                                                    <span className={`font-bold sm:text-right ${row.highlight ? "text-earth-green font-mono break-all sm:break-normal" : "text-charcoal"}`}>{row.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA Buttons ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            id="pay-now-sbi"
                            href={SBI_COLLECT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-3 bg-earth-green hover:bg-earth-green/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-base"
                        >
                            Pay Now via SBI Collect
                            <ExternalLink size={18} />
                        </a>

                        {claimStep === "idle" && (
                            <button
                                id="i-have-paid"
                                onClick={() => setClaimStep("form")}
                                className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-charcoal font-bold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-earth-green/40 transition-all text-base"
                            >
                                I have paid →
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                        SBI Collect opens in a new tab — return here after completing payment to confirm.
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
                                    Found on your SBI Collect payment success page / receipt email. Starts with SBIN, HDFC, ICIC, etc. Min 10 characters.
                                </p>
                                {utrNumber.length > 0 && utrNumber.trim().length < 10 && (
                                    <p className="text-xs text-red-500 mt-1 font-bold">⚠ Too short — SBI UTR numbers are typically 16–22 characters.</p>
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
                                            <p className="text-sm text-gray-500 font-medium">Click to upload SBI receipt screenshot</p>
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
                                    <p className="text-xs text-red-500 mt-1 font-medium">⚠ Upload your SBI Collect payment confirmation screenshot to proceed.</p>
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
                            If you face issues on the SBI Collect page or need assistance, email us at{" "}
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
