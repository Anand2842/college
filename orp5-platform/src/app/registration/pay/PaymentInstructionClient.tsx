"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import {
    CheckCircle2, Copy, Check, ExternalLink, Upload, AlertCircle,
    Loader2, ShieldCheck, Building2, Receipt, ChevronRight, X, IndianRupee, DollarSign
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
    const [claimStep, setClaimStep] = useState<"idle" | "form" | "uploading" | "done">("idle");
    const [amountPaid, setAmountPaid] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
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
        // navigator.clipboard only works on localhost/HTTPS. Use fallback for IP/HTTP.
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
            // Last resort: show alert with the text
            alert(`Copy this Ticket ID:\n\n${text}`);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    const handleClaim = async () => {
        if (!amountPaid || isNaN(Number(amountPaid)) || Number(amountPaid) <= 0) {
            setClaimError("Please enter the amount you paid.");
            return;
        }
        setClaimError("");
        setClaimLoading(true);

        try {
            // Step 1: Upload proof if provided
            let proofUrl = "";
            if (proofFile) {
                setClaimStep("uploading");
                const fd = new FormData();
                fd.append("file", proofFile);
                const uploadRes = await fetch(`/api/register/${ticketId}/upload-proof`, {
                    method: "POST",
                    body: fd,
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    proofUrl = uploadData.url || "";
                }
            }

            // Step 2: Claim payment
            const claimRes = await fetch(`/api/register/${ticketId}/claim`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount_paid: Number(amountPaid),
                    proof_url: proofUrl,
                }),
            });

            if (!claimRes.ok) throw new Error("Claim failed");
            setClaimStep("done");
        } catch (err) {
            setClaimError("Something went wrong. Please try again or contact support.");
        } finally {
            setClaimLoading(false);
        }
    };

    const fee = registration?.fee_amount || registration?.feeAmount || 0;
    const currency = registration?.currency || "INR";
    const currencySymbol = currency === "USD" ? "$" : "₹";
    const name = registration?.full_name || registration?.fullName || "";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
                <Loader2 className="animate-spin text-earth-green" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#123125] to-[#1e4d3b] pt-28 pb-16 px-4">
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
                    <div className="mt-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>⚠️ Use this <strong>exact Ticket ID</strong> on the SBI Collect form. Mismatched IDs delay verification.</span>
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
                                done: true,
                            },
                            {
                                num: 2,
                                title: `Click "Pay Now via SBI Collect" below`,
                                desc: "Opens in a new tab. You stay on this page.",
                                done: false,
                            },
                            {
                                num: 3,
                                title: "Fill the SBI form exactly like this",
                                desc: null,
                                done: false,
                                table: [
                                    { field: "Ticket ID / Reference No.", value: ticketId, highlight: true },
                                    { field: "Mobile Number", value: "Same number you used in registration" },
                                    { field: "Remitter Name", value: "Same name you used in registration" },
                                    { field: "Amount", value: `${currencySymbol}${fee > 0 ? fee.toLocaleString() : "as shown on your fee table"}`, highlight: true },
                                    { field: "Email", value: "Your email (optional but recommended)" },
                                ],
                            },
                            {
                                num: 4,
                                title: `After payment, click "I have paid" below`,
                                desc: "This notifies our team immediately to start verification.",
                                done: false,
                            },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-9 h-9 rounded-full bg-earth-green text-white flex items-center justify-center font-bold text-sm shrink-0 z-10">
                                        {step.num}
                                    </div>
                                    {i < 3 && <div className="w-0.5 bg-earth-green/20 flex-1 my-1" />}
                                </div>
                                <div className="pb-8 flex-1">
                                    <p className="font-bold text-charcoal mb-1">{step.title}</p>
                                    {step.desc && <p className="text-sm text-gray-500">{step.desc}</p>}
                                    {step.table && (
                                        <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                                                SBI Collect Form — Fill It Like This
                                            </div>
                                            {step.table.map((row, j) => (
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

                {/* ── Trust Badges ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {[
                        { icon: <ShieldCheck size={20} />, label: "Safe Payment", sub: "via SBI Collect" },
                        { icon: <Building2 size={20} />, label: "Govt. Authorized", sub: "PSU banking system" },
                        { icon: <Receipt size={20} />, label: "Receipt Generated", sub: "after verification" },
                    ].map((badge, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                            <div className="text-earth-green flex justify-center mb-2">{badge.icon}</div>
                            <p className="font-bold text-xs text-charcoal">{badge.label}</p>
                            <p className="text-xs text-gray-400">{badge.sub}</p>
                        </div>
                    ))}
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
                        SBI Collect link opens in a new tab — you can return here to click "I have paid" after completing payment.
                    </p>
                </div>

                {/* ── "I Have Paid" Claim Form ── */}
                {claimStep === "form" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-earth-green/30 p-6 mb-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-charcoal text-lg">Confirm Your Payment</h3>
                            <button onClick={() => { setClaimStep("idle"); setClaimError(""); }} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Amount Paid */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">
                                    Amount You Paid <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        {currency === "USD" ? <DollarSign size={16} /> : <IndianRupee size={16} />}
                                    </span>
                                    <input
                                        id="amount-paid"
                                        type="number"
                                        value={amountPaid}
                                        onChange={e => setAmountPaid(e.target.value)}
                                        placeholder={fee > 0 ? String(fee) : "Enter amount"}
                                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:border-earth-green outline-none font-mono"
                                    />
                                </div>
                                {fee > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Expected amount: <strong>{currencySymbol}{fee.toLocaleString()}</strong>. If different, our team will contact you.
                                    </p>
                                )}
                                {fee > 0 && amountPaid && Number(amountPaid) !== fee && (
                                    <div className="mt-2 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs font-bold">
                                        <AlertCircle size={14} />
                                        Amount mismatch! Expected {currencySymbol}{fee}. Please verify before submitting.
                                    </div>
                                )}
                            </div>

                            {/* Proof Upload */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">
                                    Upload Payment Screenshot <span className="text-gray-400 font-normal">(optional — speeds up verification)</span>
                                </label>
                                <label
                                    id="proof-upload"
                                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-earth-green/40 rounded-xl p-6 cursor-pointer transition-colors bg-gray-50 hover:bg-green-50/30"
                                >
                                    {proofFile ? (
                                        <div className="text-center">
                                            <CheckCircle2 size={28} className="text-earth-green mx-auto mb-2" />
                                            <p className="font-bold text-earth-green text-sm">{proofFile.name}</p>
                                            <p className="text-xs text-gray-400">{(proofFile.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload screenshot</p>
                                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={e => setProofFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {claimError && (
                                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                                    <AlertCircle size={16} />
                                    {claimError}
                                </div>
                            )}

                            <button
                                id="submit-claim"
                                onClick={handleClaim}
                                disabled={claimLoading}
                                className="w-full bg-earth-green hover:bg-earth-green/90 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {claimLoading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                                ) : (
                                    <>Confirm Payment <ChevronRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Uploading State ── */}
                {claimStep === "uploading" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
                        <Loader2 size={32} className="animate-spin text-earth-green mx-auto mb-3" />
                        <p className="font-bold text-charcoal">Uploading your payment proof...</p>
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
                            <span className="font-mono font-bold text-earth-green">{ticketId}</span> — Payment Claimed
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={`/registration/success?id=${ticketId}`}
                                className="px-6 py-3 bg-earth-green text-white rounded-xl font-bold hover:bg-earth-green/90 transition"
                            >
                                View Receipt
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-white text-charcoal rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition"
                            >
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
                            If you face any issues on the SBI Collect page or have already paid but can't see the claim option, email us at{" "}
                            <a href="mailto:info@orp5ic.com" className="text-earth-green font-bold hover:underline">
                                info@orp5ic.com
                            </a>{" "}
                            with your Ticket ID: <span className="font-mono font-bold">{ticketId}</span>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
