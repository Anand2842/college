"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import QRCode from "react-qr-code";
import { AttendeeBadge, AttendeeBadgeData } from "@/components/admin/AttendeeBadge";
import {
    DoorOpen, Briefcase, MonitorPlay, Megaphone, Store, Tractor,
    FileDown, Printer, ShieldAlert, BadgeCheck, HelpCircle,
    Calendar, MapPin, CheckCircle2, Building, UserCheck, QrCode as QrCodeIcon,
    CreditCard
} from "lucide-react";

export default function RegistrationTicketClient() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id');
    const tabParam = searchParams?.get('tab');
    const printParam = searchParams?.get('print');

    const [pageData, setPageData] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"badge" | "ticket">(tabParam === "ticket" ? "ticket" : "badge");

    useEffect(() => {
        if (tabParam === 'ticket') {
            setActiveTab('ticket');
        } else if (tabParam === 'badge') {
            setActiveTab('badge');
        }
    }, [tabParam]);

    useEffect(() => {
        if (printParam === '1' && registration) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [printParam, registration]);

    useEffect(() => {
        // Fetch static page content
        fetch('/api/content/ticket')
            .then(res => res.json())
            .then(data => setPageData(data))
            .catch(err => console.error("Failed to load ticket data", err));

        // Fetch registration data if ID is present
        if (id) {
            fetch(`/api/register/${id}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("Registration not found");
                })
                .then(data => setRegistration(data))
                .catch(err => console.error("Failed to load registration", err));
        }
    }, [id]);

    if (!pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#123125] border-t-[#DFC074] rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm font-semibold text-[#123125]">Loading Delegate Credentials...</p>
                </div>
            </div>
        );
    }

    const { hero, intro, ticket, checkpoints, notes } = pageData;

    // Use registration data if available, otherwise fallback to static mock data
    const displayTicket = {
        name: registration ? (registration.fullName || registration.full_name) : ticket.registrantName,
        id: registration ? (registration.ticket_number || registration.ticket_id || registration.ticketId || registration.id) : ticket.registrationId,
        category: registration ? registration.category : ticket.category,
        mode: registration?.mode ? (registration.mode.toLowerCase() === 'physical' ? 'In-Person (Physical)' : 'Virtual') : 'In-Person',
        institution: registration?.institution || registration?.organization || "",
        country: registration?.country || 'India',
        validity: "21–25 September 2026",
    };

    // Badge data for the official ID card
    const badgeData: AttendeeBadgeData = {
        id: registration?.id || displayTicket.id,
        name: displayTicket.name,
        ticketNumber: displayTicket.id,
        category: displayTicket.category,
        country: displayTicket.country,
        institution: displayTicket.institution,
        affiliation: displayTicket.institution,
        designation: registration?.designation || "",
        mode: displayTicket.mode,
        photoUrl: registration?.photo_url || registration?.photoUrl || "",
        paymentStatus: registration?.payment_status || "paid",
        group: "delegate",
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "DoorOpen": return <DoorOpen size={18} />;
            case "Briefcase": return <Briefcase size={18} />;
            case "MonitorPlay": return <MonitorPlay size={18} />;
            case "Megaphone": return <Megaphone size={18} />;
            case "Store": return <Store size={18} />;
            case "Tractor": return <Tractor size={18} />;
            default: return <BadgeCheck size={18} />;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const prevTitle = document.title;
        const prefix = activeTab === "badge" ? "ORP5-ID-Badge" : "ORP5-Ticket";
        document.title = `${prefix}-${displayTicket.id}`;
        window.print();
        setTimeout(() => {
            document.title = prevTitle;
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-[#DFC074]/30">
            <div className="no-print">
                <Navbar />
            </div>

            {/* Dark Hero Section (Hidden on Print) */}
            <section className="no-print bg-[#123125] pt-32 pb-16 px-6 rounded-b-[2.5rem] text-white relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-40 bg-[#DFC074]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-semibold text-[#DFC074] uppercase tracking-wider mb-4">
                        <CheckCircle2 size={13} className="text-[#DFC074]" /> Official Delegate Credentials
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 tracking-tight">Conference Pass &amp; ID Card</h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
                        Access your official conference credentials. Present this ID badge and QR ticket at the venue registration desk and all conference checkpoints.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-5xl relative z-20 mt-8 pb-32 print:p-0 print:m-0 print:max-w-none print:pb-0">
                {/* Breadcrumb & Action Toolbar Header */}
                <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Home / Registration / <span className="text-earth-green">{activeTab === "badge" ? "Official ID Card" : "Entry Ticket Pass"}</span>
                    </div>

                    {/* Prominent Download & Print Toolbar */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleDownloadPdf}
                            className="bg-[#123125] hover:bg-[#1B4332] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                            <FileDown size={15} className="text-[#DFC074]" />
                            <span>Download PDF</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="bg-white border-[#D1CAB0] hover:bg-[#F5F2E9] text-[#123125] text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                            <Printer size={15} />
                            <span>Print</span>
                        </Button>
                    </div>
                </div>

                {/* Tab Switcher: ID Card vs Ticket Pass */}
                <div className="no-print flex items-center justify-center gap-2 mb-8 p-1.5 bg-[#EBE5D5]/50 rounded-2xl max-w-md mx-auto border border-[#D1CAB0]/70">
                    <button
                        onClick={() => setActiveTab("badge")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "badge"
                                ? "bg-[#123125] text-white shadow-md"
                                : "text-gray-700 hover:text-black hover:bg-white/60"
                        }`}
                    >
                        <CreditCard size={15} className={activeTab === "badge" ? "text-[#DFC074]" : "text-gray-500"} />
                        <span>Official ID Card (Badge)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("ticket")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "ticket"
                                ? "bg-[#123125] text-white shadow-md"
                                : "text-gray-700 hover:text-black hover:bg-white/60"
                        }`}
                    >
                        <QrCodeIcon size={15} className={activeTab === "ticket" ? "text-[#DFC074]" : "text-gray-500"} />
                        <span>Entry Ticket Pass</span>
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 🪪 VIEW 1: THE OFFICIAL ATTENDEE ID CARD / BADGE                */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className={`${activeTab === "badge" ? "block print:block" : "hidden print:hidden"}`}>
                    <div id="printable-badge" className="flex flex-col items-center justify-center mb-12 print:mb-0 print:p-0">
                        {/* Interactive Badge Preview with soft gold ambient glow */}
                        <div className="relative p-2 sm:p-4 rounded-[36px] bg-gradient-to-b from-[#DFC074]/20 via-transparent to-transparent print:p-0 print:bg-none print:shadow-none">
                            <AttendeeBadge
                                attendee={badgeData}
                                settings={{
                                    showPhoto: false,
                                    showCountry: true,
                                    showInstitution: true,
                                    showOrganizers: true,
                                    showSlotGuide: true,
                                    qrSize: 100,
                                }}
                                className="shadow-2xl border-2 border-[#123125]/20 print:shadow-none"
                            />
                        </div>

                        <p className="no-print text-xs text-gray-500 font-medium text-center mt-4">
                            Official 90mm × 135mm delegate credential badge with lanyard slot punch guide and verification QR code.
                        </p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 🎟️ VIEW 2: THE REFINED HORIZONTAL TICKET PASS                   */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className={`${activeTab === "ticket" ? "block print:block" : "hidden print:hidden"}`}>
                    <div
                        id="printable-ticket"
                        className="bg-white border-2 border-[#123125]/15 rounded-2xl md:rounded-3xl shadow-lg relative overflow-hidden mb-12"
                    >
                        {/* Top Gold Foil Accent Bar */}
                        <div className="h-2 bg-gradient-to-r from-[#123125] via-[#DFC074] to-[#123125]"></div>

                        {/* Conference Credential Header */}
                        <div className="bg-[#123125] text-white px-6 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E4D3B]">
                            <div>
                                <div className="flex items-center gap-2 text-[#DFC074] text-[11px] font-bold uppercase tracking-widest mb-1">
                                    <BadgeCheck size={14} />
                                    <span>5th International Conference • ORP-5</span>
                                </div>
                                <h3 className="font-serif font-bold text-base md:text-xl text-white tracking-wide">
                                    Organic &amp; Natural Rice Production Systems
                                </h3>
                                <p className="text-xs text-gray-300 mt-0.5">
                                    21 – 25 September 2026 • NASC Complex, Pusa, New Delhi, India
                                </p>
                            </div>
                            <div className="self-start md:self-auto flex items-center gap-1.5 bg-[#DFC074]/15 border border-[#DFC074]/40 px-3 py-1 rounded-full text-[#DFC074] text-xs font-bold uppercase tracking-wider shrink-0">
                                <UserCheck size={13} />
                                <span>Verified Delegate</span>
                            </div>
                        </div>

                        {/* Pass Body Content */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-stretch gap-6 md:gap-8">
                            {/* Left Side: Delegate Details */}
                            <div className="w-full md:flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                                        Registrant Name
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-serif font-bold text-charcoal leading-tight">
                                        {displayTicket.name}
                                    </h2>
                                    {displayTicket.institution && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                                            <Building size={13} className="text-gray-400 shrink-0" />
                                            <span>{displayTicket.institution}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Ticket ID & Category Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="bg-[#F0FDF4] p-3 rounded-xl border border-green-200">
                                        <span className="text-[10px] font-bold text-green-800 uppercase tracking-wider block mb-0.5">
                                            Registration ID
                                        </span>
                                        <p className="font-mono font-bold text-base text-[#123125] tracking-tight">
                                            {displayTicket.id}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                                            Participant Category
                                        </span>
                                        <p className="font-semibold text-xs md:text-sm text-charcoal leading-snug break-words">
                                            {displayTicket.category}
                                        </p>
                                    </div>
                                </div>

                                {/* Mode & Validity Info */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-gray-400">Mode:</span>
                                        <span className="font-medium text-charcoal">{displayTicket.mode}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#DFC074]" />
                                        <span className="font-medium text-charcoal">{displayTicket.validity}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 w-full">
                                        <MapPin size={13} className="text-red-500 shrink-0" />
                                        <span>NASC Complex, Dev Prakash Shastri Marg, Pusa, New Delhi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Vertical Divider (No awkward floating circles) */}
                            <div className="hidden md:block w-px self-stretch border-r border-dashed border-gray-200 my-1"></div>

                            {/* Right Side: QR Code Pass */}
                            <div className="w-full md:w-auto flex flex-col items-center justify-center text-center shrink-0">
                                <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#DFC074]/40 shadow-sm flex flex-col items-center">
                                    <div id="ticket-qr-container" className="bg-white p-2.5 rounded-xl shadow-inner border border-gray-100 mb-2.5">
                                        <QRCode
                                            value={displayTicket.id}
                                            size={135}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <span className="inline-block px-2.5 py-0.5 bg-[#123125] text-[#DFC074] rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                                        Entry Scan Pass
                                    </span>
                                    <p className="text-[10px] text-gray-500 font-medium">Present at Registration Desk</p>
                                </div>
                            </div>
                        </div>

                        {/* Pass Footer Banner */}
                        <div className="bg-gray-50 px-6 md:px-8 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                            <p className="text-center sm:text-left">
                                Organized by <strong>AIASA</strong>, <strong>UAS Raichur</strong> &amp; <strong>IPB University</strong>
                            </p>
                            <p className="text-center sm:text-right text-[11px] text-gray-400">
                                Support: <a href="mailto:info@orp5ic.com" className="text-[#123125] hover:underline font-medium">info@orp5ic.com</a> • www.orp5ic.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Secondary Action Bar directly underneath */}
                <div className="no-print flex flex-wrap items-center justify-center gap-4 mb-16">
                    <Button
                        onClick={handleDownloadPdf}
                        className="bg-[#123125] hover:bg-[#1B4332] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                        <FileDown size={17} className="text-[#DFC074]" />
                        <span>Download PDF ({activeTab === "badge" ? "Official ID Badge" : "Ticket Pass"})</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="bg-white border-[#D1CAB0] hover:bg-[#F5F2E9] text-[#123125] text-sm font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                        <Printer size={17} />
                        <span>Print Physical Copy</span>
                    </Button>
                </div>

                {/* Scan Checkpoints */}
                <div className="no-print mb-16">
                    <h3 className="text-center font-serif font-bold text-xl text-charcoal mb-8">Official Checkpoints for this Credential</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {checkpoints?.map((pt: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700 hover:border-[#DFC074] transition-colors">
                                <span className="text-[#123125] bg-[#FFF8E1] p-2 rounded-lg">{getIcon(pt.icon)}</span>
                                <span className="font-semibold text-xs text-charcoal">{pt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="no-print space-y-4 mb-16 max-w-3xl mx-auto">
                    <h3 className="font-serif font-bold text-lg text-charcoal mb-4">Important Delegate Guidelines</h3>
                    {notes?.map((note: string, i: number) => (
                        <div key={i} className="flex gap-3 text-xs md:text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <ShieldAlert size={16} className="text-[#DFC074] shrink-0 mt-0.5" />
                            <p className="leading-relaxed">{note}</p>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="no-print bg-white p-6 rounded-xl border border-gray-200 flex gap-4 items-start max-w-3xl mx-auto shadow-sm">
                    <div className="bg-[#FFF8E1] p-2.5 rounded-full text-[#123125]">
                        <HelpCircle size={22} />
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal text-sm mb-1">Lost Your Pass or Need Assistance?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Visit the Help Desk at the registration hall on 21 September 2026, or contact the Secretariat directly at <a href="mailto:info@orp5ic.com" className="text-[#123125] font-semibold hover:underline">info@orp5ic.com</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Bar (Hidden on Print) */}
            <div className="no-print fixed bottom-0 left-0 right-0 bg-[#123125] text-white p-3.5 z-40 shadow-2xl border-t border-[#1E4D3B]/50">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="text-center md:text-left">
                        <p className="font-semibold text-xs md:text-sm text-gray-200">
                            Ticket ID: <span className="font-mono font-bold text-[#DFC074]">{displayTicket.id}</span> • Carry this pass with photo ID for event entry.
                        </p>
                    </div>
                    <div className="flex gap-2.5">
                        <Link href="/programme">
                            <Button className="bg-[#DFC074] text-[#123125] hover:bg-[#C9AB63] text-xs font-bold px-3 py-1.5">Programme</Button>
                        </Link>
                        <Link href="/venue">
                            <Button variant="outline" className="border-white/25 text-white hover:bg-white/10 text-xs px-3 py-1.5">Venue Map</Button>
                        </Link>
                        <Link href={`/registration/success?id=${displayTicket.id}`}>
                            <Button variant="outline" className="border-white/25 text-white hover:bg-white/10 text-xs px-3 py-1.5">Receipt</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Print Stylesheet */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm 0mm;
                    }
                    nav, footer, .no-print, header, section, .fixed, .badge-help, .guidelines {
                        display: none !important;
                    }
                    body, html, main {
                        background: white !important;
                        color: black !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    #printable-badge {
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    #printable-ticket {
                        display: block !important;
                        border: 2px solid #123125 !important;
                        box-shadow: none !important;
                        margin: 0 auto !important;
                        max-width: 700px !important;
                        border-radius: 16px !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
            `}</style>

            <div className="no-print">
                <Footer />
            </div>
        </div>
    );
}
