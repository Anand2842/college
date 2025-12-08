"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import {
    Users, Calendar, FileText, CreditCard, QrCode, Store, Folder, ShieldCheck,
    AlertTriangle, CheckCircle, Clock, Cloud
} from 'lucide-react';
import { Button } from "@/components/atoms/Button";
// Reconstructed Admin Data (previously in JSON)
const adminData = {
    hero: {
        title: "Admin Control Center",
        description: "Manage conference content, registrations, and system settings from one central hub."
    },
    verification: {
        center: "Security Status",
        description: "Current session and access level verification.",
        details: {
            loggedInAs: "Administrator",
            roleLevel: "Level 5 access",
            lastLogin: "Active Session",
            securityBadge: "SECURE"
        }
    },
    mainGrid: [
        { title: "Manage Pages", description: "Edit homepage, about, and content pages.", icon: "FileText", link: "/admin/pages/home" },
        { title: "Speakers", description: "Update keynote and invited speakers.", icon: "Users", link: "/admin/speakers" },
        { title: "Registrations", description: "View and manage attendee tickets.", icon: "CreditCard", link: "/admin/registrations" },
        { title: "Schedule", description: "Manage programme and sessions.", icon: "Calendar", link: "/admin/schedule" },
        { title: "Sponsors", description: "Manage partners and exhibition details.", icon: "Store", link: "/admin/sponsors" },
        { title: "QR Check-in", description: "Verify attendee tickets.", icon: "QrCode", link: "/admin/checkin" },
        { title: "Media Library", description: "Manage uploads and gallery.", icon: "Folder", link: "/admin/media" },
        { title: "Settings", description: "System configuration.", icon: "ShieldCheck", link: "/admin/settings" }
    ],
    analytics: [
        { value: "1,240", label: "Registrations" },
        { value: "$45k", label: "Revenue" },
        { value: "85", label: "Abstracts" },
        { value: "12", label: "Sponsors" }
    ],
    alerts: [
        { type: "info", message: "System backup completed successfully." },
        { type: "warning", message: "3 pending abstract reviews." }
    ],
    communication: {
        title: "Communications",
        description: "Send announcements to registered attendees.",
        buttonLabel: "Send Broadcast"
    },
    security: {
        title: "Security Protocols",
        items: ["SSL Encryption Active", "Database Backups Enabled", "Admin Activity Logged"]
    }
};

export default function Dashboard() {
    const { hero, verification, mainGrid, communication, security } = adminData;
    const [stats, setStats] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        // Fetch Stats
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to load stats", err));

        // Fetch Current User Profile
        const fetchProfile = async () => {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                setUserProfile({
                    email: user.email,
                    role: profile?.role || "user",
                    lastLogin: new Date().toLocaleString() // Client-side approximation
                });
            }
        };
        fetchProfile();
    }, []);

    const analytics = stats?.analytics || adminData.analytics;
    const alerts = stats?.alerts || adminData.alerts;

    const getIcon = (name: string) => {
        switch (name) {
            case "Users": return <Users size={24} />;
            case "Calendar": return <Calendar size={24} />;
            case "FileText": return <FileText size={24} />;
            case "CreditCard": return <CreditCard size={24} />;
            case "QrCode": return <QrCode size={24} />;
            case "Store": return <Store size={24} />;
            case "Folder": return <Folder size={24} />;
            case "ShieldCheck": return <ShieldCheck size={24} />;
            default: return <FileText size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal pb-32">

            {/* Dark Hero Section */}
            <div className="bg-[#123125] p-10 md:p-16 rounded-b-[3rem] text-white relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 p-40 bg-[#DFC074]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10 max-w-4xl">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Home / Admin</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{hero.title}</h1>
                    <p className="text-gray-300 text-lg">{hero.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl -mt-24 relative z-20">

                {/* Info Card Row */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    {/* Left: Verification Text */}
                    <div className="bg-[#FBF9F4] rounded-2xl p-8 border-l-4 border-[#DFC074] shadow-sm flex-1">
                        <h2 className="font-serif font-bold text-xl text-charcoal mb-4">{verification.center}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{verification.description}</p>
                    </div>

                    {/* Right: Verification Details Table */}
                    <div className="bg-[#FBF9F4] rounded-2xl p-8 border border-[#EBE5D5] shadow-sm md:w-1/3">
                        <h3 className="font-serif font-bold text-charcoal mb-4 border-b border-gray-200 pb-2">Admin Login Verification</h3>
                        <div className="grid grid-cols-2 gap-y-4 text-xs">
                            <div>
                                <p className="text-gray-500">Logged in as</p>
                                <p className="font-bold text-charcoal truncate" title={userProfile?.email}>{userProfile?.email || "Loading..."}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Role Level</p>
                                <p className="font-bold text-charcoal capitalize">{userProfile?.role || "..."}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Last Login Time</p>
                                <p className="font-bold text-charcoal">{userProfile?.lastLogin || "Just now"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Security Badge</p>
                                <span className="bg-[#123125] text-white px-2 py-0.5 rounded text-[10px] font-bold">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="mb-12">
                    <h2 className="font-serif font-bold text-2xl text-charcoal mb-6">Main Admin Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mainGrid.map((item, index) => (
                            <Link key={index} href={item.link}>
                                <div className="bg-[#FFFDF7] p-6 rounded-xl border border-gray-200 hover:border-[#DFC074] hover:shadow-md transition-all group h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-[#DFC074] group-hover:text-[#B89C50] transition-colors bg-[#FFF8E1] p-2 rounded-lg">
                                            {getIcon(item.icon)}
                                        </div>
                                        <h3 className="font-bold text-charcoal leading-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Analytics Overview */}
                <div className="mb-12">
                    <h2 className="font-serif font-bold text-2xl text-charcoal mb-6">Analytics Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {analytics.map((stat: any, index: number) => (
                            <div key={index} className="bg-[#FFFDF7] p-4 rounded-xl border border-gray-200 text-center animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                                <p className="text-2xl font-bold text-[#D9A648] mb-1">{stat.value}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-semibold leading-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Split Panel: Alerts & Communication */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Alerts Panel */}
                    <div className="bg-[#FFFDF7] rounded-xl p-8 border border-gray-200">
                        <h3 className="font-serif font-bold text-lg text-charcoal mb-6">System Alerts</h3>
                        <div className="space-y-4">
                            {alerts.map((alert: any, i: number) => (
                                <div key={i} className="flex gap-3 items-start text-sm text-gray-700 animate-in slide-in-from-left-2 duration-300">
                                    {alert.type === 'warning' && <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />}
                                    {alert.type === 'success' && <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />}
                                    {alert.type === 'info' && <Clock size={16} className="text-[#D9A648] shrink-0 mt-0.5" />}
                                    <p>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Communication Log */}
                    <div className="bg-[#FBF9F4] rounded-xl p-8 border border-[#EBE5D5]">
                        <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{communication.title}</h3>
                        <p className="text-gray-500 text-sm mb-6">{communication.description}</p>
                        <Button className="w-full bg-[#123125] text-white hover:bg-[#0A1F16]">{communication.buttonLabel}</Button>
                    </div>
                </div>

                {/* Bottom Row: File Upload & Security */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* File Upload Section */}
                    <div className="bg-[#FBF9F4] rounded-xl p-8 border border-[#EBE5D5]">
                        <h3 className="font-serif font-bold text-lg text-charcoal mb-6">File Upload Section</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:bg-gray-50 cursor-pointer transition-colors relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload file" />
                            <Cloud size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="font-bold text-sm text-gray-700">Click to upload <span className="font-normal text-gray-500">or drag and drop</span></p>
                            <p className="text-[10px] text-gray-400 mt-1">PDF, DOCX, JPG, PNG (MAX. 10MB)</p>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-[#FBF9F4] rounded-xl p-8 border border-[#EBE5D5]">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={20} className="text-[#D9A648]" />
                            <h3 className="font-serif font-bold text-lg text-charcoal">{security.title}</h3>
                        </div>
                        <ul className="space-y-3 pl-2">
                            {security.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>


        </div>
    );
}
