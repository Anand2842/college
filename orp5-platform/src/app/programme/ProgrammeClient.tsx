"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { PageHero } from "@/components/organisms/PageHero";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import {
    Calendar,
    Clock,
    MapPin,
    Download,
    FileText,
    Search,
    ChevronDown,
    ChevronUp,
    Sparkles,
    UserCheck,
    Mic,
    BookOpen,
    Users,
    Layers,
    Award,
    ArrowRight,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export default function ProgrammeClient() {
    const [data, setData] = useState<any>(null);
    const [activeDay, setActiveDay] = useState("Day 1");
    const [searchQuery, setSearchQuery] = useState("");
    const [sessionFilter, setSessionFilter] = useState("all");
    const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetch("/api/content/programme")
            .then((res) => res.json())
            .then((jsonData) => {
                if (jsonData && Object.keys(jsonData).length > 0) {
                    setData(jsonData);
                }
            })
            .catch((err) => console.error("Error loading programme:", err));
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedSessions((prev) => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id],
        }));
    };

    const isExpanded = (id: string) => {
        // default to true
        return expandedSessions[id] !== false;
    };

    // Filter sessions based on search & filter
    const currentSessions = useMemo(() => {
        if (!data?.schedule || !data.schedule[activeDay]) return [];
        const list = data.schedule[activeDay];

        if (!searchQuery.trim() && sessionFilter === "all") return list;

        const q = searchQuery.toLowerCase().trim();

        return list.filter((s: any) => {
            // Type filter
            if (sessionFilter === "oral" && !s.oralPresentations?.length) return false;
            if (sessionFilter === "poster" && !s.posterPresentations?.length) return false;
            if (sessionFilter === "plenary" && s.sessionType !== "Plenary" && s.sessionType !== "Inaugural" && s.sessionType !== "Valedictory") return false;

            if (!q) return true;

            // Search matches
            const titleMatch = (s.title || "").toLowerCase().includes(q);
            const themeMatch = (s.themeName || "").toLowerCase().includes(q);
            const chairMatch = (s.chair || "").toLowerCase().includes(q) || (s.coChair || "").toLowerCase().includes(q);
            const keynoteMatch = (s.keynote?.speaker || "").toLowerCase().includes(q) || (s.keynote?.title || "").toLowerCase().includes(q);
            
            const oralMatch = s.oralPresentations?.some((p: any) =>
                (p.title || "").toLowerCase().includes(q) ||
                (p.authors || "").toLowerCase().includes(q) ||
                (p.affiliation || "").toLowerCase().includes(q)
            );

            const posterMatch = s.posterPresentations?.some((p: any) =>
                (p.title || "").toLowerCase().includes(q) ||
                (p.authors || "").toLowerCase().includes(q) ||
                (p.affiliation || "").toLowerCase().includes(q)
            );

            const panellistMatch = s.panellists?.some((p: any) =>
                (p.name || "").toLowerCase().includes(q) ||
                (p.topic || "").toLowerCase().includes(q)
            );

            return titleMatch || themeMatch || chairMatch || keynoteMatch || oralMatch || posterMatch || panellistMatch;
        });
    }, [data, activeDay, searchQuery, sessionFilter]);

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
            <div className="w-10 h-10 border-3 border-earth-green/20 border-t-earth-green rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-earth-green/70 font-semibold tracking-wide">Loading Technical Programme...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FAF9F5] font-sans text-charcoal selection:bg-earth-green/15 selection:text-earth-green">
            <Navbar />

            <PageHero
                headline={data.hero?.headline || "Conference Technical Programme"}
                subheadline={data.hero?.subheadline || "5th International Conference on Organic and Natural Rice Production Systems (ORP-5) | 21–25 September 2026"}
                backgroundImage={data.hero?.backgroundImage}
                breadcrumb="Home / Programme"
                buttons={[
                    { label: "Download PDF Schedule", link: "/documents/ORP5_Technical_Programme.pdf", variant: "primary" as const },
                    { label: "Download DOCX", link: "/documents/ORP5_Technical_Programme.docx", variant: "secondary" as const }
                ]}
            />

            {/* Quick Document Download Strip */}
            <section className="bg-earth-green text-white py-5 border-b border-rice-gold/30 relative shadow-inner">
                <div className="container mx-auto px-6 max-w-6xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rice-gold/20 flex items-center justify-center text-rice-gold shrink-0 border border-rice-gold/40">
                            <FileText size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-rice-gold">Official Schedule Document</div>
                            <div className="text-sm font-medium text-white/90">A.P. Shinde Symposium Hall, NASC Complex, New Delhi | 21–25 Sept 2026</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/documents/ORP5_Technical_Programme.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-rice-gold hover:bg-rice-gold-dark text-earth-green font-bold text-xs rounded-xl transition shadow-md"
                        >
                            <Download size={14} /> Download PDF (Official)
                        </a>
                        <a
                            href="/documents/ORP5_Technical_Programme.docx"
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
                        >
                            <Download size={14} /> DOCX Version
                        </a>
                    </div>
                </div>
            </section>

            {/* 5-Day Roadmap Overview */}
            <section className="py-16 container mx-auto px-6 max-w-6xl">
                <SectionTitle
                    badge="5-Day Roadmap"
                    title="Programme Structure Overview"
                    subtitle="A structured 5-day flow featuring inaugural plenaries, 9 thematic technical break-outs, farmer-scientist roundtables, and field excursions."
                    centered
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-10">
                    {data.overview?.map((item: any, i: number) => {
                        const dayKey = `Day ${i + 1}`;
                        const isSelected = activeDay === dayKey;
                        return (
                            <div
                                key={i}
                                onClick={() => setActiveDay(dayKey)}
                                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                    isSelected
                                        ? "bg-earth-green text-white border-rice-gold/60 shadow-xl scale-[1.02] ring-2 ring-rice-gold/40"
                                        : "bg-white border-earth-green/10 text-charcoal hover:border-earth-green/30 hover:shadow-md"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                            isSelected ? "bg-rice-gold text-earth-green" : "bg-earth-green/10 text-earth-green"
                                        }`}>
                                            Day {i + 1}
                                        </span>
                                        <span className={`text-[11px] font-semibold ${isSelected ? "text-rice-gold-light" : "text-gray-400"}`}>
                                            {item.date?.split(" ")[0]} Sept
                                        </span>
                                    </div>
                                    <h3 className="font-serif font-bold text-base mb-2 leading-snug">{item.day}</h3>
                                    <p className={`text-xs leading-relaxed ${
                                        isSelected ? "text-white/80" : "text-charcoal/70"
                                    }`}>
                                        {item.summary}
                                    </p>
                                </div>
                                <div className={`mt-4 pt-3 border-t text-[11px] font-bold flex items-center justify-between ${
                                    isSelected ? "border-white/15 text-rice-gold" : "border-gray-100 text-earth-green"
                                }`}>
                                    <span>{isSelected ? "Active View" : "View Agenda"}</span>
                                    <ArrowRight size={12} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Detailed Interactive Day Schedule */}
            <section className="py-16 bg-white border-y border-gray-200/70">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionTitle
                        badge="Scientific Agenda"
                        title="Detailed Daily Schedule"
                        subtitle="Explore technical sessions, plenary lectures, keynote speeches, and oral/poster research presentations."
                        centered
                    />

                    {/* Day Selection Tabs */}
                    <div className="flex justify-center gap-2 md:gap-3 my-8 overflow-x-auto pb-2">
                        {Object.keys(data.schedule || {}).map((day) => {
                            const isSelected = activeDay === day;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`py-3 px-5 md:px-7 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                                        isSelected
                                            ? "bg-earth-green text-rice-gold shadow-lg ring-2 ring-earth-green/30"
                                            : "bg-[#FAF9F5] text-charcoal/70 hover:bg-earth-green/5 hover:text-earth-green border border-gray-200"
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-[#FAF9F5] p-4 md:p-5 rounded-2xl border border-earth-green/15 mb-8 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
                        <div className="relative w-full md:w-80">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search author, paper, or topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs md:text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:border-earth-green"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">Filter:</span>
                            {[
                                { id: "all", label: "All Sessions" },
                                { id: "oral", label: "Oral Papers" },
                                { id: "poster", label: "Posters" },
                                { id: "plenary", label: "Plenaries" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSessionFilter(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                                        sessionFilter === tab.id
                                            ? "bg-earth-green text-rice-gold shadow-sm"
                                            : "bg-white text-charcoal/70 border border-gray-200 hover:border-earth-green/40"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Sessions List */}
                    <div className="space-y-6 min-h-[400px]">
                        {currentSessions.length === 0 ? (
                            <div className="text-center py-16 bg-[#FAF9F5] rounded-3xl border border-gray-200">
                                <Search size={32} className="mx-auto text-gray-400 mb-3" />
                                <h4 className="font-serif font-bold text-lg text-charcoal mb-1">No sessions match your search</h4>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    Try adjusting your keyword or reset filters to see the full schedule for {activeDay}.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 text-xs font-bold"
                                    onClick={() => { setSearchQuery(""); setSessionFilter("all"); }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        ) : (
                            currentSessions.map((session: any) => {
                                const expanded = isExpanded(session.id);
                                const hasOral = Boolean(session.oralPresentations?.length);
                                const hasPoster = Boolean(session.posterPresentations?.length);
                                const hasBreakdown = Boolean(session.scheduleBreakdown?.length);
                                const hasPanellists = Boolean(session.panellists?.length);

                                return (
                                    <div
                                        key={session.id}
                                        className="bg-[#FAF9F5] rounded-3xl border border-earth-green/15 overflow-hidden transition-all shadow-sm hover:shadow-md hover:border-earth-green/30"
                                    >
                                        {/* Session Top Header Card */}
                                        <div className="p-6 md:p-8 bg-white border-b border-earth-green/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 border border-earth-green/20">
                                                    <Clock size={22} />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <span className="text-xs font-bold text-rice-gold-dark uppercase tracking-wider bg-rice-gold/15 px-2.5 py-0.5 rounded-md border border-rice-gold/30">
                                                            {session.time}
                                                        </span>
                                                        {session.sessionType && (
                                                            <span className="text-[11px] font-bold text-earth-green uppercase tracking-wider bg-earth-green/10 px-2 py-0.5 rounded-md">
                                                                {session.sessionType}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-serif font-bold text-charcoal">
                                                        {session.themeName || session.title}
                                                    </h3>
                                                    {session.venue && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                            <MapPin size={13} className="text-earth-green" />
                                                            <span>{session.venue}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                                {session.tags?.map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF9F5] text-earth-green border border-earth-green/20 shadow-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(hasOral || hasPoster || hasBreakdown || hasPanellists) && (
                                                    <button
                                                        onClick={() => toggleExpand(session.id)}
                                                        className="p-2 rounded-xl text-gray-500 hover:text-earth-green hover:bg-earth-green/10 transition ml-1"
                                                        title={expanded ? "Collapse details" : "Expand details"}
                                                    >
                                                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Meta Information: Chairs, Keynotes, Panellists */}
                                        <div className="p-6 md:p-8 space-y-4">
                                            {/* Details note */}
                                            {session.details && (
                                                <p className="text-sm text-charcoal/80 leading-relaxed bg-white p-4 rounded-2xl border border-gray-200/80">
                                                    {session.details}
                                                </p>
                                            )}

                                            {/* Leadership & Dignitaries Strip */}
                                            {(session.chair || session.coChair || session.convenors || session.coordinator) && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-earth-green/10 text-xs">
                                                    {session.chair && (
                                                        <div>
                                                            <span className="font-bold text-earth-green block uppercase tracking-wider text-[10px]">Session Chair</span>
                                                            <span className="text-charcoal font-medium">{session.chair}</span>
                                                        </div>
                                                    )}
                                                    {session.coChair && (
                                                        <div>
                                                            <span className="font-bold text-earth-green block uppercase tracking-wider text-[10px]">Co-Chair</span>
                                                            <span className="text-charcoal font-medium">{session.coChair}</span>
                                                        </div>
                                                    )}
                                                    {session.convenors && (
                                                        <div className="sm:col-span-2 md:col-span-1">
                                                            <span className="font-bold text-earth-green block uppercase tracking-wider text-[10px]">Convenors</span>
                                                            <span className="text-charcoal font-medium">{session.convenors.join(" • ")}</span>
                                                        </div>
                                                    )}
                                                    {session.coordinator && (
                                                        <div className="sm:col-span-2 md:col-span-3">
                                                            <span className="font-bold text-earth-green block uppercase tracking-wider text-[10px]">Programme Coordinator</span>
                                                            <span className="text-charcoal font-medium">{session.coordinator}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Keynote Lecture */}
                                            {session.keynote && (
                                                <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                                                        <Mic size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md inline-block mb-1">
                                                            Keynote Lecture
                                                        </span>
                                                        <h4 className="text-base font-serif font-bold text-charcoal">
                                                            {session.keynote.title}
                                                        </h4>
                                                        <p className="text-xs text-charcoal/80 mt-1 font-medium">
                                                            <strong>{session.keynote.speaker}</strong> — {session.keynote.designation}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Panellists List */}
                                            {session.panellists && session.panellists.length > 0 && (
                                                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                                                    <h5 className="text-xs font-bold uppercase tracking-wider text-earth-green mb-3 flex items-center gap-1.5">
                                                        <Users size={14} /> Distinguished Panellists & Presentations
                                                    </h5>
                                                    <div className="space-y-3">
                                                        {session.panellists.map((p: any, idx: number) => (
                                                            <div key={idx} className="p-3 bg-[#FAF9F5] rounded-xl border border-gray-200/70 text-xs">
                                                                <div className="font-bold text-charcoal text-sm">{p.name} <span className="font-normal text-gray-500 text-xs">({p.designation})</span></div>
                                                                <div className="text-earth-green font-medium mt-1">Topic: <i>{p.topic}</i></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Valedictory Schedule Breakdown */}
                                            {session.scheduleBreakdown && session.scheduleBreakdown.length > 0 && (
                                                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                                                    <h5 className="text-xs font-bold uppercase tracking-wider text-earth-green mb-3 flex items-center gap-1.5">
                                                        <Award size={14} /> Session Programme Sequence
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {session.scheduleBreakdown.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex items-start gap-3 text-xs p-2.5 bg-[#FAF9F5] rounded-xl border border-gray-200/60">
                                                                <span className="font-bold text-rice-gold-dark bg-white px-2 py-1 rounded border border-gray-200 shrink-0">
                                                                    {item.time}
                                                                </span>
                                                                <span className="text-charcoal font-medium pt-0.5">{item.event}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Networking Forum Presentations */}
                                            {session.presentations && session.presentations.length > 0 && (
                                                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                                                    <h5 className="text-xs font-bold uppercase tracking-wider text-earth-green mb-3 flex items-center gap-1.5">
                                                        <BookOpen size={14} /> Scheduled Presentations (10 Minutes Each)
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {session.presentations.map((p: any, idx: number) => (
                                                            <div key={idx} className="p-3 bg-[#FAF9F5] rounded-xl border border-gray-200/70 text-xs">
                                                                <div className="font-bold text-charcoal">{p.title}</div>
                                                                <div className="text-gray-600 mt-0.5">{p.presenter}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Collapsible Section: Oral Presentations Table */}
                                            {expanded && hasOral && (
                                                <div className="mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-300">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-earth-green flex items-center gap-1.5">
                                                            <BookOpen size={15} /> Oral Paper Presentations ({session.oralPresentations.length})
                                                        </h5>
                                                    </div>
                                                    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
                                                        <table className="w-full text-left text-xs bg-white">
                                                            <thead className="bg-earth-green text-white uppercase text-[10px] tracking-wider">
                                                                <tr>
                                                                    <th className="py-3 px-3 w-10 text-center">#</th>
                                                                    <th className="py-3 px-4">Research Paper Title</th>
                                                                    <th className="py-3 px-4">Author(s) & Affiliation</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {session.oralPresentations.map((pres: any, idx: number) => (
                                                                    <tr key={idx} className="hover:bg-amber-50/40 transition">
                                                                        <td className="py-3 px-3 text-center font-bold text-gray-400 align-top">{pres.id || idx + 1}</td>
                                                                        <td className="py-3 px-4 font-semibold text-charcoal align-top leading-relaxed">{pres.title}</td>
                                                                        <td className="py-3 px-4 text-charcoal/80 align-top">
                                                                            <div className="font-medium text-earth-green">{pres.authors}</div>
                                                                            <div className="text-[11px] text-gray-500 italic mt-0.5">{pres.affiliation}</div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Collapsible Section: Poster Presentations Table */}
                                            {expanded && hasPoster && (
                                                <div className="mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-300">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                                                            <Layers size={15} /> Poster Presentations ({session.posterPresentations.length})
                                                        </h5>
                                                    </div>
                                                    <div className="overflow-x-auto rounded-2xl border border-amber-200 shadow-xs">
                                                        <table className="w-full text-left text-xs bg-white">
                                                            <thead className="bg-rice-gold text-earth-green uppercase text-[10px] tracking-wider font-bold">
                                                                <tr>
                                                                    <th className="py-3 px-3 w-10 text-center">#</th>
                                                                    <th className="py-3 px-4">Poster Title</th>
                                                                    <th className="py-3 px-4">Author(s) & Affiliation</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-amber-100/60">
                                                                {session.posterPresentations.map((pres: any, idx: number) => (
                                                                    <tr key={idx} className="hover:bg-amber-50/50 transition">
                                                                        <td className="py-3 px-3 text-center font-bold text-amber-700 align-top">{pres.id || idx + 1}</td>
                                                                        <td className="py-3 px-4 font-semibold text-charcoal align-top leading-relaxed">{pres.title}</td>
                                                                        <td className="py-3 px-4 text-charcoal/80 align-top">
                                                                            <div className="font-medium text-amber-900">{pres.authors}</div>
                                                                            <div className="text-[11px] text-gray-500 italic mt-0.5">{pres.affiliation}</div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Field Visit & Excursions */}
            {data.fieldTrip && (
                <section className="py-16 container mx-auto px-6 max-w-6xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-earth-green/15 luxury-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-lg">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2 block">
                                Practical Agrarian Immersion
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4">
                                {data.fieldTrip.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-semibold text-earth-green mb-6 bg-earth-green/10 px-3 py-1.5 rounded-xl w-fit">
                                <MapPin size={15} /> {data.fieldTrip.location}
                            </div>
                            <div className="space-y-3 mb-8">
                                {data.fieldTrip.features?.map((f: any) => (
                                    <div key={f.id} className="flex items-start gap-3 text-xs text-charcoal/80">
                                        <div className="w-5 h-5 rounded-full bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                            ✓
                                        </div>
                                        <span>{f.text}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/registration">
                                <Button variant="default" size="default" className="text-xs uppercase tracking-wider font-bold">
                                    Register for Field Visits
                                </Button>
                            </Link>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 border border-earth-green/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={data.fieldTrip.imageUrl}
                                alt="Organic Rice Field Visit"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Key Programme Highlights */}
            {data.highlights && data.highlights.length > 0 && (
                <section className="py-16 container mx-auto px-6 max-w-6xl">
                    <SectionTitle
                        badge="Special Features"
                        title="Conference Programme Highlights"
                        subtitle="Distinctive deliberative platforms designed into the ORP-5 scientific schedule."
                        centered
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {data.highlights.map((item: any, i: number) => (
                            <div key={i} className="bg-white rounded-3xl p-8 border border-earth-green/10 luxury-card flex flex-col items-start shadow-sm">
                                <div className="w-14 h-14 bg-earth-green/10 text-earth-green rounded-2xl flex items-center justify-center mb-5 border border-earth-green/20">
                                    {item.iconName === "BookOpen" && <BookOpen size={24} />}
                                    {item.iconName === "Globe" && <Sparkles size={24} />}
                                    {item.iconName === "Users" && <Users size={24} />}
                                </div>
                                <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                                <p className="text-charcoal/70 text-xs leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Official Programme Downloads Section */}
            <section className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-earth-green">Official Documents</span>
                        <h3 className="font-serif font-bold text-2xl text-charcoal mt-1">Download Conference Materials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.downloads?.map((dl: any, idx: number) => (
                            <a
                                key={idx}
                                href={dl.file}
                                target={dl.file.endsWith(".pdf") ? "_blank" : undefined}
                                download={dl.file.endsWith(".docx") ? true : undefined}
                                rel="noopener noreferrer"
                                className="bg-white p-5 rounded-2xl border border-earth-green/15 hover:border-rice-gold/60 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
                            >
                                <div className="w-12 h-12 rounded-xl bg-earth-green/10 text-earth-green group-hover:bg-earth-green group-hover:text-rice-gold flex items-center justify-center shrink-0 transition">
                                    <Download size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-charcoal text-sm group-hover:text-earth-green transition truncate">
                                        {dl.label}
                                    </h4>
                                    <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                        Direct Download <ExternalLink size={10} />
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 container mx-auto px-6 max-w-6xl">
                <div className="bg-earth-green-deep text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rice-gold/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light mb-2 block">
                            Join ORP-5
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                            Secure Your Delegate Pass Today
                        </h3>
                        <p className="text-white/70 text-sm">
                            Access all plenary sessions, 9 thematic break-outs, conference lunches, and official reception dinner.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link href="/registration">
                            <Button variant="premium" size="lg" className="text-xs uppercase tracking-wider font-bold">
                                Register Now <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
