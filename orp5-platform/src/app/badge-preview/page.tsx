"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AttendeeBadge, AttendeeBadgeData, BadgeSettings, DEFAULT_BADGE_SETTINGS } from "@/components/admin/AttendeeBadge";
import { BadgePrintSheet } from "@/components/admin/BadgePrintSheet";
import { Printer, RefreshCw, Sliders, CheckCircle2, ArrowLeft } from "lucide-react";

export default function BadgePreviewPage() {
    const [testName, setTestName] = useState("Muhammad Abdul Rahman Al-Hassan");
    const [testCategory, setTestCategory] = useState("RESEARCH SCHOLAR");
    const [testCountry, setTestCountry] = useState("INDIA");
    const [testId, setTestId] = useState("ORP5IC-IND-20548");
    const [settings, setSettings] = useState<BadgeSettings>({
        ...DEFAULT_BADGE_SETTINGS,
    });
    const [viewMode, setViewMode] = useState<"showcase" | "print">("showcase");

    const showcaseBadges: AttendeeBadgeData[] = [
        {
            id: "badge-aryan",
            name: "ARYAN GULERIA",
            ticketNumber: "ORP5IC-IND-49146",
            category: "RESEARCH SCHOLAR",
            country: "INDIA",
            institution: "Dr. Y.S. Parmar University of Horticulture & Forestry",
            group: "delegate",
        },
        {
            id: "badge-pappu",
            name: "PAPPU SAHA",
            ticketNumber: "ORP5IC-IND-20548",
            category: "STUDENT",
            country: "INDIA",
            institution: "Bidhan Chandra Krishi Viswavidyalaya",
            group: "delegate",
        },
        {
            id: "badge-raghavendra",
            name: "DR. B. RAGHAVENDRA",
            ticketNumber: "ORP5IC-IND-20549",
            category: "SCIENTIST",
            country: "INDIA",
            institution: "University of Agricultural Sciences, Raichur",
            group: "delegate",
        },
        {
            id: "badge-dodiya",
            name: "DR. RAVIKUMAR D. DODIYA",
            ticketNumber: "ORP5IC-IND-20550",
            category: "PROFESSIONAL",
            country: "INDIA",
            institution: "Junagadh Agricultural University",
            group: "delegate",
        },
        {
            id: "badge-olatilo",
            name: "OLATILO BENJAMIN OLANIRAN",
            ticketNumber: "ORP5IC-NGA-20551",
            category: "RESEARCH SCHOLAR",
            country: "NIGERIA",
            institution: "Federal University of Agriculture, Abeokuta",
            group: "delegate",
        },
        {
            id: "badge-bellon",
            name: "MR STEPHANE BELLON",
            ticketNumber: "ORP5IC-FRA-20552",
            category: "INNOVATIVE FARMER",
            country: "FRANCE",
            institution: "INRAE - French National Institute for Agriculture",
            group: "delegate",
        },
        {
            id: "badge-adeniyi",
            name: "DR. CHUKWUEMEKA OLUWASEUN ADENIYI-ADEBAYO",
            ticketNumber: "ORP5IC-NGA-20553",
            category: "SCIENTIST",
            country: "NIGERIA",
            institution: "African Agricultural Technology Foundation",
            group: "delegate",
        },
    ];

    const liveCustomBadge: AttendeeBadgeData = {
        id: "live-custom",
        name: testName.toUpperCase(),
        ticketNumber: testId,
        category: testCategory,
        country: testCountry,
        institution: "Custom Institution Test",
        group: "delegate",
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pb-16">
            {/* Top Bar */}
            <header className="no-print bg-[#0e3825] text-white border-b border-[#d99b26]/40 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/80 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                                ORP-5 Master Badge System
                                <span className="text-xs bg-[#d99b26] text-[#0e3825] px-2 py-0.5 rounded-full font-black uppercase">
                                    Official Template
                                </span>
                            </h1>
                            <p className="text-xs text-white/70">
                                Real-time dynamic name hierarchy &bull; Never shrinks badge &bull; 0 ellipsis &bull; 2-line max
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showSlotGuide: !s.showSlotGuide }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                                settings.showSlotGuide ? "bg-white/25 text-white" : "bg-white/10 text-white/50"
                            }`}
                            title="Toggle Lanyard Slot Punch Production Guide"
                        >
                            Slot Guide: {settings.showSlotGuide ? "ON" : "OFF"}
                        </button>
                        <button
                            onClick={() => setViewMode(viewMode === "showcase" ? "print" : "showcase")}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                            <Sliders size={14} />
                            {viewMode === "showcase" ? "View A4 Print Sheet" : "View Card Grid"}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-1.5 rounded-xl bg-[#d99b26] hover:bg-[#c4891e] text-[#0e3825] font-black text-xs transition flex items-center gap-1.5 shadow"
                        >
                            <Printer size={15} /> Print Badges (A4)
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Interactive Name-Box Test Lab */}
                <section className="no-print bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h2 className="text-base font-black text-[#0e3825] flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-[#d99b26]" />
                                Live Name Scaling & System Rules Tester
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Test any name length: Short (1-18 chars), Medium (19-28 chars), Long (29-40 chars), or 40+ chars. Complete name is always visible without ellipsis.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                                Length: {testName.trim().length} characters
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Delegate Full Name (Live Test)
                            </label>
                            <input
                                type="text"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="Type any name (e.g., Muhammad Abdul Rahman Al-Hassan)..."
                                className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3825]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Category
                            </label>
                            <select
                                value={testCategory}
                                onChange={(e) => setTestCategory(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3825] bg-white font-semibold"
                            >
                                <option value="RESEARCH SCHOLAR">RESEARCH SCHOLAR</option>
                                <option value="SCIENTIST">SCIENTIST</option>
                                <option value="PROFESSIONAL">PROFESSIONAL</option>
                                <option value="STUDENT">STUDENT</option>
                                <option value="INNOVATIVE FARMER">INNOVATIVE FARMER</option>
                                <option value="ORGANIZING COMMITTEE">ORGANIZING COMMITTEE</option>
                                <option value="INVITED SPEAKER">INVITED SPEAKER</option>
                                <option value="VOLUNTEER">VOLUNTEER</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                value={testCountry}
                                onChange={(e) => setTestCountry(e.target.value)}
                                placeholder="Country (e.g. INDIA, CHINA, JAPAN)"
                                className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3825]"
                            />
                        </div>
                    </div>

                    {/* Preset Name Quick Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-xs">
                        <span className="font-bold text-gray-500">Quick Test:</span>
                        <button
                            onClick={() => setTestName("DEVANSH DOGRA")}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                        >
                            Devansh Dogra (13 chars)
                        </button>
                        <button
                            onClick={() => setTestName("LI WEI")}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                        >
                            Li Wei (6 chars)
                        </button>
                        <button
                            onClick={() => setTestName("MUHAMMAD ABDUL RAHMAN")}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                        >
                            Muhammad Abdul Rahman (21 chars)
                        </button>
                        <button
                            onClick={() => setTestName("MUHAMMAD ABDUL RAHMAN AL-HASSAN")}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                        >
                            Muhammad Abdul Rahman Al-Hassan (31 chars)
                        </button>
                        <button
                            onClick={() => setTestName("DR. CHUKWUEMEKA OLUWASEUN ADENIYI-ADEBAYO")}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                        >
                            Dr. Chukwuemeka Oluwaseun Adeniyi-Adebayo (41 chars)
                        </button>
                    </div>
                </section>

                {/* View Mode: Print Sheet or Card Grid */}
                {viewMode === "print" ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="no-print mb-4 flex items-center justify-between text-xs text-gray-500 pb-3 border-b">
                            <span>A4 2x2 Print Grid (85mm x 135mm badges with cut marks)</span>
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-1 bg-[#0e3825] text-white rounded-lg font-bold"
                            >
                                Open Print Dialog
                            </button>
                        </div>
                        <BadgePrintSheet attendees={[liveCustomBadge, ...showcaseBadges]} layout="a4-grid" settings={settings} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Live Badge Result */}
                        <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200/80 flex flex-col items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-[#0e3825] mb-4 bg-emerald-200/60 px-3 py-1 rounded-full">
                                Real-Time Result for "{testName}"
                            </span>
                            <AttendeeBadge attendee={liveCustomBadge} settings={settings} />
                        </div>

                        {/* Showcase Gallery */}
                        <div>
                            <div className="no-print flex items-center justify-between mb-4 px-1">
                                <h3 className="font-black text-lg text-gray-800">
                                    Master Cohort Demonstrations (From "Li Wei" to 40+ chars)
                                </h3>
                                <span className="text-xs text-gray-500">
                                    Fixed badge dimensions &bull; No ellipsis &bull; Master Green/Gold
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                                {showcaseBadges.map((attendee) => (
                                    <div key={attendee.id} className="flex flex-col items-center space-y-2">
                                        <div className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                            {attendee.name.length <= 18
                                                ? `Short (${attendee.name.length} chars)`
                                                : attendee.name.length <= 28
                                                ? `Medium (${attendee.name.length} chars)`
                                                : `Long (${attendee.name.length} chars)`}
                                        </div>
                                        <AttendeeBadge attendee={attendee} settings={settings} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
