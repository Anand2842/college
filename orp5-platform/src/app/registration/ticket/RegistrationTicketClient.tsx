"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import QRCode from "react-qr-code";
import {
    DoorOpen, Briefcase, MonitorPlay, Megaphone, Store, Tractor,
    FileDown, Wallet, Printer, ShieldAlert, BadgeCheck, Camera, CreditCard, HelpCircle
} from "lucide-react";

export default function RegistrationTicketClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [pageData, setPageData] = useState<any>(null);
    const [registration, setRegistration] = useState<any>(null);

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
        return <div className="min-h-screen flex items-center justify-center">Loading Ticket...</div>;
    }

    const { hero, intro, ticket, checkpoints, actions, notes } = pageData;

    // Use registration data if available, otherwise fallback to static mock data
    const displayTicket = {
        name: registration ? (registration.fullName || registration.full_name) : ticket.registrantName,
        id: registration ? (registration.ticket_number || registration.id) : ticket.registrationId,
        category: registration ? registration.category : ticket.category,
        validity: ticket.validity // Validity usually static for valid tickets
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "DoorOpen": return <DoorOpen size={20} />;
            case "Briefcase": return <Briefcase size={20} />;
            case "MonitorPlay": return <MonitorPlay size={20} />;
            case "Megaphone": return <Megaphone size={20} />;
            case "Store": return <Store size={20} />;
            case "Tractor": return <Tractor size={20} />;
            case "FileDown": return <FileDown size={18} />;
            case "Wallet": return <Wallet size={18} />;
            case "Printer": return <Printer size={18} />;
            default: return <BadgeCheck size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
            <Navbar />

            {/* Dark Hero Section */}
            <section className="bg-[#123125] pt-32 pb-20 px-6 rounded-b-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-40 bg-[#DFC074]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{hero.title}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl">{hero.description}</p>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-5xl -mt-8 relative z-20 pb-32">
                {/* Breadcrumb */}
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8 pl-2">
                    Home / Registration / <span className="text-earth-green">QR Ticket</span>
                </div>

                {/* Intro Alert */}
                <div className="bg-[#FFFDF7] border-l-4 border-[#DFC074] p-8 rounded-tr-xl rounded-br-xl shadow-sm mb-12">
                    <h2 className="font-serif font-bold text-xl text-charcoal mb-2">{intro.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{intro.description}</p>
                </div>

                {/* The Ticket Widget */}
                <div className="bg-white border border-[#EBE5D5] rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden mb-16">
                    {/* Decorative gold line at top */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#123125] via-[#DFC074] to-[#123125]"></div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        {/* Ticket Details */}
                        <div className="space-y-6 w-full md:w-1/2">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Registrant Name</p>
                                <h3 className="text-2xl font-serif font-bold text-charcoal">{displayTicket.name}</h3>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Registration ID</p>
                                <p className="font-mono font-bold text-earth-green text-lg">{displayTicket.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Category</p>
                                <p className="font-bold text-charcoal">{displayTicket.category}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Validity</p>
                                <p className="font-bold text-charcoal">{displayTicket.validity}</p>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-[#FFF8E1] p-8 rounded-xl border border-[#F3EACB] text-center w-full md:w-auto">
                            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 inline-block w-40 h-40">
                                <QRCode
                                    value={displayTicket.id}
                                    size={128}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                            <p className="text-xs text-[#B89C50] font-bold">Scan at checkpoints</p>
                        </div>
                    </div>
                </div>

                {/* Checkpoints */}
                <div className="mb-16">
                    <h3 className="text-center font-serif font-bold text-xl text-charcoal mb-8">Scan Checkpoints</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {checkpoints.map((pt: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-700">
                                <span className="text-[#DFC074]">{getIcon(pt.icon)}</span>
                                <span className="font-medium">{pt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download Actions */}
                <div className="bg-[#FAF9F5] rounded-xl p-8 text-center mb-16 border border-[#EBE5D5]">
                    <h3 className="font-serif font-bold text-lg text-charcoal mb-6">Download & Print Options</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {actions.map((action: any, i: number) => (
                            <Button key={i} variant="outline" className="bg-[#EBE5D5]/30 border-[#D1CAB0] text-charcoal hover:bg-[#EBE5D5] gap-2">
                                {getIcon(action.icon)} {action.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="space-y-4 mb-20 max-w-3xl mx-auto">
                    <h3 className="font-serif font-bold text-lg text-charcoal mb-4">Important Notes</h3>
                    {notes.map((note: string, i: number) => (
                        <div key={i} className="flex gap-3 text-sm text-gray-600">
                            <ShieldAlert size={16} className="text-[#DFC074] shrink-0 mt-0.5" />
                            <p>{note}</p>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="bg-[#FFFDF7] p-6 rounded-xl border border-gray-100 flex gap-4 items-start max-w-3xl mx-auto">
                    <div className="bg-[#FBEBB5] p-2 rounded-full text-[#B88A38]">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal text-sm mb-1">Lost or Not Received Your QR Ticket?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            If you haven't received your QR ticket or have misplaced it, please email our support team with your registration ID.
                            We will re-issue your ticket promptly. <a href="mailto:support@orp5ic.com" className="text-[#DFC074] hover:underline">support@orp5ic.com</a>
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#123125] text-white p-4 z-50 shadow-xl border-t border-[#1E4D3B]">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="font-bold text-sm">Your QR Ticket is your all-access pass — keep it ready throughout ORP-5.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/programme"><Button className="bg-[#DFC074] text-[#123125] hover:bg-[#C9AB63] text-xs font-bold">View Programme</Button></Link>
                        <Link href="/venue"><Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs">Directions to Venue</Button></Link>
                        <Button variant="outline" onClick={() => window.print()} className="border-white/20 text-white hover:bg-white/10 text-xs">Download Receipt</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
