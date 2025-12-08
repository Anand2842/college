"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, CheckCircle, Download, CreditCard, Mail, Phone, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from 'next/link';

export default function RegistrationSuccessClient() {
    const searchParams = useSearchParams();
    const registrationId = searchParams.get('id');

    const [data, setData] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch page content (layout/labels)
        fetch("/api/content/receipt")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));

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
        } else {
            setLoading(false);
        }
    }, [registrationId]);

    if (loading || !data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    // Use real registration data if available, otherwise show placeholder
    const displayUser = registration ? {
        name: registration.fullName || 'N/A',
        email: registration.email || 'N/A',
        mobile: registration.phone || 'N/A',
        institution: registration.affiliation || 'N/A',
        country: registration.country || 'N/A',
        registrationId: registration.id || 'N/A',
        category: registration.category || 'General Delegate',
        mode: 'Online',
        submittedOn: registration.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'N/A',
        fees: data.mockUser?.fees || { registration: 'Pending', tax: 'N/A', total: 'Pending' },
        payment: data.mockUser?.payment || { mode: 'Bank Transfer (Pending)' }
    } : data.mockUser;

    return (
        <main className="min-h-screen bg-[#F9F9F7] font-sans text-charcoal flex flex-col">
            <Navbar />

            {/* Header Section with Pattern */}
            <div className="bg-[#FFFDF7] pt-28 pb-12 relative overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#243e36 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                    <h5 className="text-gray-400 text-sm uppercase tracking-wide mb-2 font-bold">Home / Registration / Receipt</h5>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-green/10 uppercase mb-4 tracking-widest">{data.hero.title}</h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">{data.hero.title}</h1>
                    </div>
                    <p className="text-orange-800/80 max-w-xl mx-auto mt-8 font-medium">
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
                                            <span className="text-gray-500">GST / Taxes (18%)</span>
                                            <span className="font-bold text-gray-900">{displayUser.fees.tax}</span>
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
                                <button className="w-full flex items-center justify-between bg-[#C1A87D] hover:bg-[#b0966a] text-white p-4 rounded-lg transition-colors font-bold text-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} />
                                        <div className="text-left">
                                            <div className="leading-none">Download Receipt</div>
                                            <div className="text-[10px] opacity-80 mt-1">(PDF)</div>
                                        </div>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between bg-[#E8E8E8] hover:bg-gray-200 text-charcoal p-4 rounded-lg transition-colors font-bold text-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-gray-600" />
                                        <div className="text-left">
                                            <div className="leading-none">Download Invoice</div>
                                            <div className="text-[10px] text-gray-500 mt-1">(PDF)</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* QR Ticket */}
                        <div className="bg-[#243E36] rounded-xl p-8 text-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-[#C1A87D] font-bold text-lg mb-6">Your QR Ticket</h3>
                                <div className="bg-white p-3 rounded-xl w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                                    {/* Placeholder QR */}
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-xs text-gray-400 font-mono">QR CODE</span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-lg">{displayUser.name}</h4>
                                <p className="text-gray-400 text-xs mb-1">ID: {displayUser.registrationId}</p>
                                <p className="text-gray-300 text-sm mb-6">{displayUser.category}</p>

                                <button className="w-full flex items-center justify-center gap-2 border border-[#C1A87D] text-[#C1A87D] hover:bg-[#C1A87D] hover:text-white py-3 rounded-lg transition-colors font-bold text-sm">
                                    Download QR Ticket <ChevronRight size={14} />
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
        </main >
    );
}
