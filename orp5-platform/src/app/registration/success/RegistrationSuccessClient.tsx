"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, CheckCircle, Download, CreditCard, Mail, Phone, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';
import QRCode from "react-qr-code";

export default function RegistrationSuccessClient() {
    const searchParams = useSearchParams();
    const registrationId = searchParams?.get('id');

    const [data, setData] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [printMode, setPrintMode] = useState<'receipt' | 'invoice' | null>(null);

    const handlePrint = (mode: 'receipt' | 'invoice') => {
        setPrintMode(mode);
        // Wait for state to render, then print
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintMode(null), 1000);
        }, 100);
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById("qr-ticket-svg");
        if (!svg) return;
        
        // Serialize SVG
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width + 40; // Add padding
            canvas.height = img.height + 40;
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 20, 20); // Draw with 20px padding
            }
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `ORP5_Ticket_${displayUser.registrationId || 'Pending'}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    useEffect(() => {
        // Fetch page content (layout/labels)
        fetch("/api/content/receipt")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                // If no registration ID, we are done loading once content is here
                if (!registrationId) setLoading(false);
            });

        // Fetch actual registration data if ID provided
        if (registrationId) {
            fetch(`/api/register/${registrationId}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Registration not found');
                    return res.json();
                })
                .then((regData) => {
                    setRegistration(regData);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [registrationId]);

    if (loading || !data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Use real registration data if available, otherwise show placeholder
    const displayUser = registration ? {
        name: registration.fullName || registration.full_name || 'N/A',
        email: registration.email || 'N/A',
        mobile: registration.phone || 'N/A',
        institution: registration.institution || registration.affiliation || 'N/A',
        country: registration.country || 'N/A',
        registrationId: registration.ticket_number || registration.id || 'N/A',
        category: registration.category || 'General Delegate',
        mode: registration.mode || 'Physical',
        submittedOn: registration.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'N/A',
        fees: {
            registration: `${registration.currency === 'USD' ? '$' : '₹'}${registration.fee_amount || registration.feeAmount || 0}`,
            total: `${registration.currency === 'USD' ? '$' : '₹'}${registration.fee_amount || registration.feeAmount || 0}`
        },
        payment: { mode: registration.payment_status === 'paid' ? 'Confirmed' : 'Bank Transfer (Pending Verification)' }
    } : data.mockUser;

    return (
        <main className="min-h-screen bg-[#F9F9F7] font-sans text-charcoal flex flex-col print:bg-white">
            <div className="print:hidden flex flex-col min-h-screen">
                <Navbar />

            {/* Header Section */}
            <div className="bg-[#FFFDF7] pt-28 pb-12 relative overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#243e36 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-4 font-medium">Home / Registration / Receipt</p>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">{data.hero.title}</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        {data.hero.message}
                    </p>
                </div>
            </div>

            <div className="flex-1 container mx-auto px-6 max-w-5xl -mt-6 relative z-20 pb-20">

                {/* Success Banner */}
                <div className="bg-[#FFF8F0] border border-[#EAD6C0] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start mb-8 shadow-sm">
                    <div className="bg-[#C1A87D] text-white p-2 rounded-full shrink-0 mt-1">
                        <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#204E40] mb-2">{data.successBanner.title}</h2>
                        <p className="text-[#5B5B5B] leading-relaxed">{data.successBanner.message}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Column: Receipt Summary */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-xl font-bold text-[#204E40] mb-6 pb-4 border-b border-gray-100">Receipt Summary</h3>

                            <div className="space-y-8">
                                {/* Registrant Details */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Registrant Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Name</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.name}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Email</span>
                                            <span className="col-span-2 font-bold text-gray-900 truncate" title={displayUser.email}>{displayUser.email}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Mobile</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.mobile}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Institution</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.institution}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Country</span>
                                            <span className="col-span-2 font-bold text-[#3E3E3E] bg-[#F5F2EA] px-2 rounded w-fit">{displayUser.country}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Details */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Registration Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Registration ID</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.registrationId}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Category</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.category}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Mode</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.mode}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-gray-500">Submitted On</span>
                                            <span className="col-span-2 font-bold text-gray-900">{displayUser.submittedOn}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="bg-[#F9F9F7] p-6 rounded-lg">
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Payment Summary</h4>
                                    <div className="space-y-3 text-sm mb-4 pb-4 border-b border-gray-200 border-dashed">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Registration Fee</span>
                                            <span className="font-bold text-gray-900">{displayUser.fees.registration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Payment Mode</span>
                                            <span className="font-bold text-gray-900">{displayUser.payment.mode}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900 text-lg">Total Paid</span>
                                        <span className="font-bold text-2xl text-[#204E40]">{displayUser.fees.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Important Notes</h3>
                            <ul className="space-y-3">
                                {data.importantNotes.map((note: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                                        <ChevronRight size={16} className="text-[#C1A87D] shrink-0 mt-0.5" />
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Download Documents */}
                        <div className="bg-[#FFFDF7] rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Download Your Documents</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handlePrint('receipt')}
                                    className="w-full flex items-center justify-between bg-[#C1A87D] hover:bg-[#b0966a] text-white p-4 rounded-lg transition-colors font-bold text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} />
                                        <div className="text-left">
                                            <div className="leading-none">Download Receipt</div>
                                            <div className="text-[10px] opacity-80 mt-1">(PDF)</div>
                                        </div>
                                    </div>
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() => handlePrint('invoice')}
                                    className="w-full flex items-center justify-between bg-[#E8E8E8] hover:bg-gray-200 text-charcoal p-4 rounded-lg transition-colors font-bold text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-gray-600" />
                                        <div className="text-left">
                                            <div className="leading-none">Download Invoice</div>
                                            <div className="text-[10px] text-gray-500 mt-1">(PDF)</div>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* QR Ticket */}
                        <div className="bg-[#243E36] rounded-xl p-8 text-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-[#C1A87D] font-bold text-lg mb-6">Your QR Ticket</h3>
                                <div className="bg-white p-3 rounded-xl w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <QRCode
                                            id="qr-ticket-svg"
                                            value={displayUser.registrationId || "PENDING"}
                                            size={128}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-lg">{displayUser.name}</h4>
                                <p className="text-gray-400 text-xs mb-1">ID: {displayUser.registrationId}</p>
                                <p className="text-gray-300 text-sm mb-6">{displayUser.category}</p>

                                <button 
                                    onClick={handleDownloadQR}
                                    className="w-full flex items-center justify-center gap-2 border border-[#C1A87D] text-[#C1A87D] hover:bg-[#C1A87D] hover:text-white py-3 rounded-lg transition-colors font-bold text-sm"
                                >
                                    Download QR Ticket <Download size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-[#FFF8F0] rounded-xl border border-[#EAD6C0] p-6">
                            <h3 className="font-bold text-gray-900 mb-2">{data.helpInfo.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">{data.helpInfo.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-[#C1A87D]" />
                                    <span className="text-gray-700">{data.helpInfo.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-[#C1A87D]" />
                                    <span className="text-gray-700">{data.helpInfo.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#2D4A3E] py-20 text-center relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{data.nextSteps.title}</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">{data.nextSteps.description}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.nextSteps.buttons.map((btn: any, i: number) => (
                            <Link key={i} href={btn.link}>
                                <Button
                                    variant={btn.variant === "primary" ? "default" : "outline"}
                                    className={btn.variant === "primary" ? "bg-[#C1A87D] hover:bg-[#b0966a] text-white border-none font-bold px-8" : "border-[#C1A87D] text-[#C1A87D] hover:bg-[#C1A87D] hover:text-white font-bold px-8"}
                                >
                                    {btn.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

                <Footer />
            </div>

            {/* ── Print-only receipt/invoice overlay ── */}
            {printMode && (
                <div
                    id="print-document"
                    className="hidden print:block"
                    style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        padding: '30px',
                        maxWidth: '800px',
                        margin: '0 auto',
                        color: '#1a1a1a',
                        position: 'relative'
                    }}
                >
                    <style>{`
                        @page { margin: 10mm; }
                        #print-document {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    `}</style>

                    {/* Watermark */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        opacity: 0.03, pointerEvents: 'none', zIndex: 0
                    }}>
                        <img src="/orp5-logo.png" alt="" style={{ width: '500px' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <img src="/orp5-logo.png" alt="ORP-5 Logo" style={{ width: '100px', height: 'auto' }} />
                                <div>
                                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#204E40', letterSpacing: '-0.5px', maxWidth: '400px', lineHeight: '1.3' }}>
                                        5th International Conference on Organic and Natural Rice Production Systems
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '32px', fontWeight: '900', color: '#C1A87D', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    {printMode === 'receipt' ? 'RECEIPT' : 'INVOICE'}
                                </div>
                                <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '12px' }}>
                                    <strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                                    <strong>No:</strong> ORP5-{Math.floor(Math.random() * 10000)}
                                </div>
                            </div>
                        </div>

                        {/* ID Banner & QR */}
                        <div style={{ display: 'flex', gap: '30px', marginBottom: '32px' }}>
                            <div style={{ flex: 1, background: '#204E40', color: 'white', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', color: '#a7f3d0', marginBottom: '8px' }}>Registration Ticket ID</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '30px', letterSpacing: '2px', color: '#ffffff' }}>{displayUser.registrationId}</span>
                            </div>
                            <div style={{ flexShrink: 0, border: '2px solid #f3f4f6', borderRadius: '12px', padding: '12px', background: 'white' }}>
                                <QRCode
                                    value={displayUser.registrationId || "PENDING"}
                                    size={96}
                                    style={{ height: "96px", width: "96px" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
                            {/* Left Column: Registrant */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#C1A87D', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>Delegate Details</div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <tbody>
                                        {[
                                            ['Name', displayUser.name],
                                            ['Email', displayUser.email],
                                            ['Mobile', displayUser.mobile],
                                            ['Institution', displayUser.institution],
                                            ['Country', displayUser.country],
                                        ].map(([label, value]) => (
                                            <tr key={label}>
                                                <td style={{ padding: '12px 0', color: '#6b7280', width: '35%', verticalAlign: 'top', borderBottom: '1px solid #f9fafb' }}>{label}</td>
                                                <td style={{ padding: '12px 0', fontWeight: '600', color: '#111827', verticalAlign: 'top', borderBottom: '1px solid #f9fafb' }}>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Right Column: Registration */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#C1A87D', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>Event Registration</div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <tbody>
                                        {[
                                            ['Category', displayUser.category],
                                            ['Mode', displayUser.mode],
                                            ['Submitted On', displayUser.submittedOn],
                                            ['Payment Status', displayUser.payment.mode],
                                        ].map(([label, value]) => (
                                            <tr key={label}>
                                                <td style={{ padding: '12px 0', color: '#6b7280', width: '40%', verticalAlign: 'top', borderBottom: '1px solid #f9fafb' }}>{label}</td>
                                                <td style={{ padding: '12px 0', fontWeight: 'bold', color: label === 'Payment Status' && value.includes('Pending') ? '#B45309' : '#111827', verticalAlign: 'top', borderBottom: '1px solid #f9fafb' }}>
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Fee Breakdown */}
                        <div style={{ marginBottom: '24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '12px 12px', textAlign: 'left', color: '#4b5563', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Description</th>
                                        <th style={{ padding: '12px 12px', textAlign: 'right', color: '#4b5563', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '16px 12px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontSize: '16px' }}>Conference Registration Fee ({displayUser.category})</td>
                                        <td style={{ padding: '16px 12px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontWeight: '600', color: '#111827', fontSize: '16px' }}>{displayUser.fees.registration}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <div style={{ width: '320px', background: '#F8F5F0', padding: '20px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                        <span>Subtotal</span>
                                        <span>{displayUser.fees.registration}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
                                        <span>Taxes</span>
                                        <span>Included</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #EAD6C0', paddingTop: '16px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#204E40' }}>Total {printMode === 'invoice' ? 'Payable' : 'Paid'}</span>
                                        <span style={{ fontSize: '24px', fontWeight: '900', color: '#C1A87D' }}>{displayUser.fees.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signatures & Footer */}
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                                    <strong>Organizing Committee, ORP-5</strong><br />
                                    info@orp5ic.com | www.orp5ic.com<br />
                                    This document is computer-generated and does not require a physical signature.
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                {printMode === 'receipt' && displayUser.payment.mode.includes('Confirmed') ? (
                                    <div style={{ border: '3px solid #059669', color: '#059669', padding: '8px 24px', borderRadius: '4px', fontWeight: '900', fontSize: '20px', letterSpacing: '4px', transform: 'rotate(-5deg)', opacity: 0.8 }}>
                                        PAID IN FULL
                                    </div>
                                ) : (
                                    <div style={{ border: '3px solid #C1A87D', color: '#C1A87D', padding: '8px 24px', borderRadius: '4px', fontWeight: '900', fontSize: '18px', letterSpacing: '2px', opacity: 0.8 }}>
                                        AUTHORIZED
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
