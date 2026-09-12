"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import {
    Save,
    Loader2,
    ExternalLink,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Mic,
    BookOpen,
    Layers,
    Users,
    Clock,
    FileText,
    Sparkles,
    Check,
    Code,
    Award
} from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FileUploader } from "@/components/admin/FileUploader";

export default function ProgrammePageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Overview");
    const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});
    const [jsonString, setJsonString] = useState("");
    const [jsonError, setJsonError] = useState("");

    useEffect(() => {
        fetch("/api/content/programme")
            .then((res) => res.json())
            .then((jsonData) => {
                if (jsonData && Object.keys(jsonData).length > 0) {
                    setData(jsonData);
                    setJsonString(JSON.stringify(jsonData, null, 2));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleSessionExpand = (id: string) => {
        setExpandedSessions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleChange = (section: string, field: string, value: any) => {
        setData((prev: any) => {
            const updated = {
                ...prev,
                [section]: { ...prev[section], [field]: value },
            };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    // Sessions handler
    const handleUpdateSession = (day: string, sessionIndex: number, field: string, value: any) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            daySessions[sessionIndex] = {
                ...daySessions[sessionIndex],
                [field]: value,
            };
            const updated = {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: daySessions,
                },
            };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleAddSession = (day: string) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const newId = `sess-${Date.now()}`;
            daySessions.push({
                id: newId,
                time: "09:00 – 10:00",
                title: "New Technical Session",
                sessionType: "Technical Session",
                tags: ["Technical"],
                oralPresentations: [],
                posterPresentations: [],
            });
            const updated = {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: daySessions,
                },
            };
            setExpandedSessions((exp) => ({ ...exp, [newId]: true }));
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleRemoveSession = (day: string, sessionIndex: number) => {
        if (!confirm("Are you sure you want to delete this entire session and all its presentations?")) return;
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            daySessions.splice(sessionIndex, 1);
            const updated = {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: daySessions,
                },
            };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    // Sub-items: Oral Presentations
    const handleAddOral = (day: string, sessionIndex: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const orals = [...(session.oralPresentations || [])];
            orals.push({
                id: orals.length + 1,
                title: "New Research Paper Title",
                authors: "Author Name(s)",
                affiliation: "Institution, City, Country",
            });
            session.oralPresentations = orals;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleUpdateOral = (day: string, sessionIndex: number, oralIndex: number, field: string, value: any) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const orals = [...(session.oralPresentations || [])];
            orals[oralIndex] = { ...orals[oralIndex], [field]: value };
            session.oralPresentations = orals;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleRemoveOral = (day: string, sessionIndex: number, oralIndex: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const orals = [...(session.oralPresentations || [])];
            orals.splice(oralIndex, 1);
            session.oralPresentations = orals;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    // Sub-items: Poster Presentations
    const handleAddPoster = (day: string, sessionIndex: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const posters = [...(session.posterPresentations || [])];
            posters.push({
                id: posters.length + 1,
                title: "New Poster Title",
                authors: "Author Name(s)",
                affiliation: "Institution, City, Country",
            });
            session.posterPresentations = posters;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleUpdatePoster = (day: string, sessionIndex: number, posterIndex: number, field: string, value: any) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const posters = [...(session.posterPresentations || [])];
            posters[posterIndex] = { ...posters[posterIndex], [field]: value };
            session.posterPresentations = posters;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleRemovePoster = (day: string, sessionIndex: number, posterIndex: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const posters = [...(session.posterPresentations || [])];
            posters.splice(posterIndex, 1);
            session.posterPresentations = posters;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    // Sub-items: Panellists
    const handleAddPanellist = (day: string, sessionIndex: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const panellists = [...(session.panellists || [])];
            panellists.push({
                name: "Dr. Speaker Name",
                designation: "Designation & Organization",
                topic: "Presentation Topic",
            });
            session.panellists = panellists;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleUpdatePanellist = (day: string, sessionIndex: number, pIdx: number, field: string, val: any) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const panellists = [...(session.panellists || [])];
            panellists[pIdx] = { ...panellists[pIdx], [field]: val };
            session.panellists = panellists;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    const handleRemovePanellist = (day: string, sessionIndex: number, pIdx: number) => {
        setData((prev: any) => {
            const daySessions = [...(prev.schedule?.[day] || [])];
            const session = { ...daySessions[sessionIndex] };
            const panellists = [...(session.panellists || [])];
            panellists.splice(pIdx, 1);
            session.panellists = panellists;
            daySessions[sessionIndex] = session;
            const updated = { ...prev, schedule: { ...prev.schedule, [day]: daySessions } };
            setJsonString(JSON.stringify(updated, null, 2));
            return updated;
        });
    };

    // Save Action
    const handleSave = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const res = await fetch("/api/content/programme", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert("Failed to save programme data.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving programme data.");
        } finally {
            setSaving(false);
        }
    };

    // JSON Editor apply
    const handleApplyJson = () => {
        setJsonError("");
        try {
            const parsed = JSON.parse(jsonString);
            setData(parsed);
            alert("Raw JSON applied successfully! Click 'Save Changes' at top to publish.");
        } catch (err: any) {
            setJsonError(err.message || "Invalid JSON format");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-earth-green mb-3" size={40} />
                <p className="text-sm font-semibold text-gray-600">Loading Programme Editor...</p>
            </div>
        );
    }

    const tabs = [
        "Hero & Overview",
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Highlights & Field Trip",
        "Downloads",
        "Raw JSON (Expert)"
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Top Fixed Control Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xs">
                <div>
                    <h1 className="text-xl font-bold text-charcoal flex items-center gap-2">
                        Programme Manager
                        {saveSuccess && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Check size={12} /> Saved!
                            </span>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500">Edit schedule, session chairs, keynotes, research papers, and downloads.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/programme" target="_blank">
                        <Button variant="outline" size="sm" className="hidden md:flex text-xs font-semibold">
                            <ExternalLink size={14} className="mr-1.5" /> View Live Page
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px] text-xs font-bold shadow-sm"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={15} className="animate-spin mr-1.5" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={15} className="mr-1.5" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

                {/* 1. HERO & OVERVIEW */}
                {activeTab === "Hero & Overview" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-4 text-earth-green pb-3 border-b border-gray-100">Hero Section</h2>
                            <div className="grid gap-4">
                                <AdminInput
                                    label="Headline"
                                    value={data.hero?.headline || ""}
                                    onChange={(e) => handleChange("hero", "headline", e.target.value)}
                                />
                                <AdminInput
                                    label="Subheadline"
                                    value={data.hero?.subheadline || ""}
                                    onChange={(e) => handleChange("hero", "subheadline", e.target.value)}
                                />
                                <ImageUploader
                                    label="Background Image URL"
                                    value={data.hero?.backgroundImage || ""}
                                    onChange={(url) => handleChange("hero", "backgroundImage", url)}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-4 text-earth-green pb-3 border-b border-gray-100">5-Day Roadmap Overview</h2>
                            <div className="space-y-4">
                                {data.overview?.map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Day Title</label>
                                            <input
                                                type="text"
                                                value={item.day || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.overview];
                                                    updated[idx] = { ...updated[idx], day: e.target.value };
                                                    setData((p: any) => ({ ...p, overview: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Date String</label>
                                            <input
                                                type="text"
                                                value={item.date || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.overview];
                                                    updated[idx] = { ...updated[idx], date: e.target.value };
                                                    setData((p: any) => ({ ...p, overview: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Summary Description</label>
                                            <input
                                                type="text"
                                                value={item.summary || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.overview];
                                                    updated[idx] = { ...updated[idx], summary: e.target.value };
                                                    setData((p: any) => ({ ...p, overview: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. DAYS 1 TO 5 SCHEDULE */}
                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].includes(activeTab) && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                            <div>
                                <h2 className="text-lg font-bold text-earth-green">{activeTab} Schedule</h2>
                                <p className="text-xs text-gray-500">
                                    {(data.schedule?.[activeTab] || []).length} session(s) scheduled for this day.
                                </p>
                            </div>
                            <Button
                                onClick={() => handleAddSession(activeTab)}
                                size="sm"
                                variant="outline"
                                className="text-xs font-bold border-earth-green/40 text-earth-green hover:bg-earth-green/10"
                            >
                                <Plus size={14} className="mr-1" /> Add New Session
                            </Button>
                        </div>

                        {/* Sessions List */}
                        <div className="space-y-4">
                            {(data.schedule?.[activeTab] || []).map((sess: any, sIdx: number) => {
                                const isExp = expandedSessions[sess.id] !== false; // default expanded

                                return (
                                    <div
                                        key={sess.id || sIdx}
                                        className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all"
                                    >
                                        {/* Session Top Accordion Header */}
                                        <div className="p-4 md:p-5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between gap-4">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer flex-1"
                                                onClick={() => toggleSessionExpand(sess.id)}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-earth-green/10 text-earth-green flex items-center justify-center font-bold text-xs shrink-0">
                                                    {sIdx + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-rice-gold-dark bg-white px-2 py-0.5 rounded border border-gray-200">
                                                            {sess.time || "No time"}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-gray-500 uppercase">
                                                            {sess.sessionType || "Session"}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-charcoal text-sm truncate mt-0.5">
                                                        {sess.themeName || sess.title || "Untitled Session"}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRemoveSession(activeTab, sIdx)}
                                                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                                    title="Delete Session"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleSessionExpand(sess.id)}
                                                    className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                                >
                                                    {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Session Form */}
                                        {isExp && (
                                            <div className="p-6 space-y-6">
                                                {/* Basic Info */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Time Slot</label>
                                                        <input
                                                            type="text"
                                                            value={sess.time || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "time", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="e.g. 09:15 – 11:45"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Session Type</label>
                                                        <input
                                                            type="text"
                                                            value={sess.sessionType || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "sessionType", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="Technical Session, Plenary, Break, etc."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Venue / Room</label>
                                                        <input
                                                            type="text"
                                                            value={sess.venue || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "venue", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="A.P. Shinde Symposium Hall"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Session Title</label>
                                                        <input
                                                            type="text"
                                                            value={sess.title || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "title", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="e.g. Technical Session-I: Theme I"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Theme Name (Full Title)</label>
                                                        <input
                                                            type="text"
                                                            value={sess.themeName || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "themeName", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="Theme I: Organic & Natural Rice..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Chairs & Convenors */}
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-earth-green flex items-center gap-1.5">
                                                        <Users size={14} /> Leadership & Chairs
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-600 block mb-1">Session Chair</label>
                                                            <input
                                                                type="text"
                                                                value={sess.chair || ""}
                                                                onChange={(e) => handleUpdateSession(activeTab, sIdx, "chair", e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                                placeholder="Prof. / Dr. Chair Name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-600 block mb-1">Co-Chair</label>
                                                            <input
                                                                type="text"
                                                                value={sess.coChair || ""}
                                                                onChange={(e) => handleUpdateSession(activeTab, sIdx, "coChair", e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                                placeholder="Dr. Co-Chair Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] font-bold text-gray-600 block mb-1">Convenors (Comma-separated)</label>
                                                        <input
                                                            type="text"
                                                            value={(sess.convenors || []).join(", ")}
                                                            onChange={(e) => {
                                                                const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                                                handleUpdateSession(activeTab, sIdx, "convenors", list);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="Dr. Convenor 1, Dr. Convenor 2"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Keynote Lecture */}
                                                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-3">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                                                        <Mic size={14} /> Keynote Lecture (Optional)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-700 block mb-1">Speaker Name</label>
                                                            <input
                                                                type="text"
                                                                value={sess.keynote?.speaker || ""}
                                                                onChange={(e) => {
                                                                    const kn = { ...(sess.keynote || {}), speaker: e.target.value };
                                                                    handleUpdateSession(activeTab, sIdx, "keynote", kn);
                                                                }}
                                                                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
                                                                placeholder="Dr. Keynote Speaker"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-700 block mb-1">Speaker Designation / Org</label>
                                                            <input
                                                                type="text"
                                                                value={sess.keynote?.designation || ""}
                                                                onChange={(e) => {
                                                                    const kn = { ...(sess.keynote || {}), designation: e.target.value };
                                                                    handleUpdateSession(activeTab, sIdx, "keynote", kn);
                                                                }}
                                                                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
                                                                placeholder="Professor, UAS Raichur"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Keynote Lecture Title</label>
                                                        <input
                                                            type="text"
                                                            value={sess.keynote?.title || ""}
                                                            onChange={(e) => {
                                                                const kn = { ...(sess.keynote || {}), title: e.target.value };
                                                                handleUpdateSession(activeTab, sIdx, "keynote", kn);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
                                                            placeholder="Title of keynote speech..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Plenary Panellists */}
                                                {(sess.panellists !== undefined || sess.sessionType === "Plenary") && (
                                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-green">
                                                                Plenary Panellists / Speakers ({sess.panellists?.length || 0})
                                                            </h4>
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleAddPanellist(activeTab, sIdx)}
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                <Plus size={12} className="mr-1" /> Add Panellist
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {(sess.panellists || []).map((p: any, pIdx: number) => (
                                                                <div key={pIdx} className="p-3 bg-white rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-2 relative">
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-500 block">Name</label>
                                                                        <input
                                                                            type="text"
                                                                            value={p.name || ""}
                                                                            onChange={(e) => handleUpdatePanellist(activeTab, sIdx, pIdx, "name", e.target.value)}
                                                                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-500 block">Designation</label>
                                                                        <input
                                                                            type="text"
                                                                            value={p.designation || ""}
                                                                            onChange={(e) => handleUpdatePanellist(activeTab, sIdx, pIdx, "designation", e.target.value)}
                                                                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1">
                                                                            <label className="text-[10px] font-bold text-gray-500 block">Topic</label>
                                                                            <input
                                                                                type="text"
                                                                                value={p.topic || ""}
                                                                                onChange={(e) => handleUpdatePanellist(activeTab, sIdx, pIdx, "topic", e.target.value)}
                                                                                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemovePanellist(activeTab, sIdx, pIdx)}
                                                                            className="text-red-500 hover:text-red-700 mt-4 p-1 rounded"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Oral Paper Presentations */}
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-earth-green flex items-center gap-1.5">
                                                            <BookOpen size={14} /> Oral Paper Presentations ({sess.oralPresentations?.length || 0})
                                                        </h4>
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleAddOral(activeTab, sIdx)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Plus size={12} className="mr-1" /> Add Paper
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                                        {(sess.oralPresentations || []).map((paper: any, pIdx: number) => (
                                                            <div key={pIdx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2 relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveOral(activeTab, sIdx, pIdx)}
                                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                                                    title="Remove paper"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                                <div className="flex items-center gap-2 pr-6">
                                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                                        #{pIdx + 1}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        value={paper.title || ""}
                                                                        onChange={(e) => handleUpdateOral(activeTab, sIdx, pIdx, "title", e.target.value)}
                                                                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-bold"
                                                                        placeholder="Research Paper Title"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={paper.authors || ""}
                                                                        onChange={(e) => handleUpdateOral(activeTab, sIdx, pIdx, "authors", e.target.value)}
                                                                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded text-xs"
                                                                        placeholder="Author Name(s)"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={paper.affiliation || ""}
                                                                        onChange={(e) => handleUpdateOral(activeTab, sIdx, pIdx, "affiliation", e.target.value)}
                                                                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded text-xs italic"
                                                                        placeholder="Affiliation / University / Country"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!sess.oralPresentations || sess.oralPresentations.length === 0) && (
                                                            <div className="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg">
                                                                No oral presentations in this session.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Poster Presentations */}
                                                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                                                            <Layers size={14} /> Poster Presentations ({sess.posterPresentations?.length || 0})
                                                        </h4>
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleAddPoster(activeTab, sIdx)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Plus size={12} className="mr-1" /> Add Poster
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                                        {(sess.posterPresentations || []).map((poster: any, pIdx: number) => (
                                                            <div key={pIdx} className="p-3 bg-white rounded-lg border border-amber-200 space-y-2 relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemovePoster(activeTab, sIdx, pIdx)}
                                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                                                    title="Remove poster"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                                <div className="flex items-center gap-2 pr-6">
                                                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                                                        Poster #{pIdx + 1}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        value={poster.title || ""}
                                                                        onChange={(e) => handleUpdatePoster(activeTab, sIdx, pIdx, "title", e.target.value)}
                                                                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-bold"
                                                                        placeholder="Poster Title"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={poster.authors || ""}
                                                                        onChange={(e) => handleUpdatePoster(activeTab, sIdx, pIdx, "authors", e.target.value)}
                                                                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded text-xs"
                                                                        placeholder="Author Name(s)"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={poster.affiliation || ""}
                                                                        onChange={(e) => handleUpdatePoster(activeTab, sIdx, pIdx, "affiliation", e.target.value)}
                                                                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded text-xs italic"
                                                                        placeholder="Affiliation / University / Country"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!sess.posterPresentations || sess.posterPresentations.length === 0) && (
                                                            <div className="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg">
                                                                No poster presentations in this session.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tags & Description */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">Tags (Comma-separated)</label>
                                                        <input
                                                            type="text"
                                                            value={(sess.tags || []).join(", ")}
                                                            onChange={(e) => {
                                                                const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                                                handleUpdateSession(activeTab, sIdx, "tags", list);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="Theme I, Keynote, Oral & Poster"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">General Description / Note</label>
                                                        <input
                                                            type="text"
                                                            value={sess.details || ""}
                                                            onChange={(e) => handleUpdateSession(activeTab, sIdx, "details", e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                            placeholder="Any additional instructions or notes..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {(data.schedule?.[activeTab] || []).length === 0 && (
                                <div className="p-12 text-center bg-white border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                                    No sessions configured for {activeTab}. Click &quot;Add New Session&quot; above to create one.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. HIGHLIGHTS & FIELD TRIP */}
                {activeTab === "Highlights & Field Trip" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Highlights */}
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-4 text-earth-green pb-3 border-b border-gray-100 flex items-center gap-2">
                                <Sparkles size={18} /> Conference Highlights
                            </h2>
                            <div className="space-y-4">
                                {(data.highlights || []).map((hl: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={hl.title || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.highlights];
                                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                                    setData((p: any) => ({ ...p, highlights: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Icon Name (Lucide)</label>
                                            <input
                                                type="text"
                                                value={hl.iconName || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.highlights];
                                                    updated[idx] = { ...updated[idx], iconName: e.target.value };
                                                    setData((p: any) => ({ ...p, highlights: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                placeholder="BookOpen, Globe, Users"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
                                            <input
                                                type="text"
                                                value={hl.description || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.highlights];
                                                    updated[idx] = { ...updated[idx], description: e.target.value };
                                                    setData((p: any) => ({ ...p, highlights: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Field Trip */}
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-4 text-earth-green pb-3 border-b border-gray-100">Field Trip Details (Days 4 & 5)</h2>
                            <div className="grid gap-4">
                                <AdminInput
                                    label="Field Trip Title"
                                    value={data.fieldTrip?.title || ""}
                                    onChange={(e) => handleChange("fieldTrip", "title", e.target.value)}
                                />
                                <AdminInput
                                    label="Location Description"
                                    value={data.fieldTrip?.location || ""}
                                    onChange={(e) => handleChange("fieldTrip", "location", e.target.value)}
                                />
                                <ImageUploader
                                    label="Field Trip Image URL"
                                    value={data.fieldTrip?.imageUrl || ""}
                                    onChange={(url) => handleChange("fieldTrip", "imageUrl", url)}
                                />

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Key Features / Bullets</label>
                                    <div className="space-y-2">
                                        {(data.fieldTrip?.features || []).map((feat: any, fIdx: number) => (
                                            <div key={fIdx} className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 font-bold w-6 text-center">{fIdx + 1}.</span>
                                                <input
                                                    type="text"
                                                    value={feat.text || ""}
                                                    onChange={(e) => {
                                                        const updated = [...data.fieldTrip.features];
                                                        updated[fIdx] = { ...updated[fIdx], text: e.target.value };
                                                        handleChange("fieldTrip", "features", updated);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...data.fieldTrip.features];
                                                        updated.splice(fIdx, 1);
                                                        handleChange("fieldTrip", "features", updated);
                                                    }}
                                                    className="p-1.5 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...(data.fieldTrip?.features || [])];
                                                updated.push({ id: `f-${Date.now()}`, text: "New feature description" });
                                                handleChange("fieldTrip", "features", updated);
                                            }}
                                            size="sm"
                                            variant="outline"
                                            className="text-xs mt-2"
                                        >
                                            <Plus size={12} className="mr-1" /> Add Feature Bullet
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. DOWNLOADS */}
                {activeTab === "Downloads" && (
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-earth-green">Downloadable Files</h2>
                                <p className="text-xs text-gray-500">Attach PDF/DOCX materials available for delegates to download.</p>
                            </div>
                            <Button
                                type="button"
                                onClick={() => {
                                    const dls = [...(data.downloads || [])];
                                    dls.push({
                                        file: "/documents/ORP5_Technical_Programme.pdf",
                                        icon: "FileText",
                                        label: "New Document",
                                    });
                                    setData((p: any) => ({ ...p, downloads: dls }));
                                }}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                            >
                                <Plus size={12} className="mr-1" /> Add File Download
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {(data.downloads || []).map((dl: any, dIdx: number) => (
                                <div key={dIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">Display Label</label>
                                        <input
                                            type="text"
                                            value={dl.label || ""}
                                            onChange={(e) => {
                                                const updated = [...data.downloads];
                                                updated[dIdx] = { ...updated[dIdx], label: e.target.value };
                                                setData((p: any) => ({ ...p, downloads: updated }));
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">File URL / Path</label>
                                        <input
                                            type="text"
                                            value={dl.file || ""}
                                            onChange={(e) => {
                                                const updated = [...data.downloads];
                                                updated[dIdx] = { ...updated[dIdx], file: e.target.value };
                                                setData((p: any) => ({ ...p, downloads: updated }));
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Icon Name (Lucide)</label>
                                            <input
                                                type="text"
                                                value={dl.icon || ""}
                                                onChange={(e) => {
                                                    const updated = [...data.downloads];
                                                    updated[dIdx] = { ...updated[dIdx], icon: e.target.value };
                                                    setData((p: any) => ({ ...p, downloads: updated }));
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...data.downloads];
                                                updated.splice(dIdx, 1);
                                                setData((p: any) => ({ ...p, downloads: updated }));
                                            }}
                                            className="text-red-500 hover:text-red-700 mt-4 p-2"
                                            title="Delete Download"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. RAW JSON (EXPERT MODE) */}
                {activeTab === "Raw JSON (Expert)" && (
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 md:p-8 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-earth-green flex items-center gap-2">
                                    <Code size={18} /> Raw JSON Structure
                                </h2>
                                <p className="text-xs text-gray-500">Directly view or modify the complete conference schedule data.</p>
                            </div>
                            <Button onClick={handleApplyJson} size="sm" className="bg-earth-green text-white text-xs font-bold">
                                Apply JSON Changes
                            </Button>
                        </div>

                        {jsonError && (
                            <div className="p-3 mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                                Error: {jsonError}
                            </div>
                        )}

                        <textarea
                            value={jsonString}
                            onChange={(e) => setJsonString(e.target.value)}
                            rows={24}
                            className="w-full p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-earth-green"
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
