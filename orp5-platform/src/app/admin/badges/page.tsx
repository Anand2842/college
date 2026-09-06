"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    Printer,
    Search,
    Filter,
    CheckSquare,
    Square,
    IdCard,
    ArrowLeft,
    Users,
    RefreshCw,
    Camera,
    Sliders,
    UserPlus,
    Edit3,
    X,
    Check,
    UploadCloud,
    Globe,
    Award,
    Mic,
    HeartHandshake
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import {
    AttendeeBadge,
    AttendeeBadgeData,
    BadgeSettings,
    DEFAULT_BADGE_SETTINGS
} from "@/components/admin/AttendeeBadge";
import { BadgePrintSheet } from "@/components/admin/BadgePrintSheet";

export default function AdminBadgesPage() {
    const [attendees, setAttendees] = useState<AttendeeBadgeData[]>([]);
    const [loading, setLoading] = useState(true);

    // Active Group Filter: "all" | "delegate" | "committee" | "speaker" | "volunteer"
    const [groupFilter, setGroupFilter] = useState<string>("all");

    // Search & Additional Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Badge Customization & Photo Settings (Adjustable as requested)
    const [settings, setSettings] = useState<BadgeSettings>({
        ...DEFAULT_BADGE_SETTINGS,
        showPhoto: false, // Default matches user template (minimalist, QR centered)
    });

    // Print & View State
    const [printLayout, setPrintLayout] = useState<"a4-grid" | "single">("a4-grid");
    const [viewMode, setViewMode] = useState<"cards" | "print-preview">("cards");

    // Edit Attendee Modal
    const [editingAttendee, setEditingAttendee] = useState<AttendeeBadgeData | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAttendee, setNewAttendee] = useState<Partial<AttendeeBadgeData>>({
        name: "",
        ticketNumber: "",
        category: "DELEGATE",
        country: "INDIA",
        institution: "",
        group: "delegate",
        photoUrl: "",
    });

    useEffect(() => {
        loadBadgesData();
    }, []);

    const loadBadgesData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/badges");
            if (res.ok) {
                const json = await res.json();
                if (json.attendees && Array.isArray(json.attendees)) {
                    setAttendees(json.attendees);
                    // Select all by default
                    setSelectedIds(new Set(json.attendees.map((a: AttendeeBadgeData) => a.id)));
                }
            } else {
                // Fallback: fetch from /api/register if admin route is restricted
                const regRes = await fetch("/api/register");
                if (regRes.ok) {
                    const regData = await regRes.json();
                    const delegates: AttendeeBadgeData[] = regData.map((d: any) => ({
                        id: d.id,
                        name: d.full_name || d.fullName || "Registered Delegate",
                        ticketNumber: d.ticket_number || d.ticketId || `ORP5IC-IND-${d.id.substring(0, 5).toUpperCase()}`,
                        category: (d.category || "DELEGATE").toUpperCase(),
                        group: "delegate",
                        subgroup: d.category || "Delegate",
                        country: (d.country || "INDIA").toUpperCase(),
                        institution: d.institution || d.affiliation || "",
                        designation: d.designation || "",
                        photoUrl: d.photo_url || "",
                        mode: d.mode || "physical",
                        paymentStatus: d.payment_status || "awaiting_payment",
                    }));

                    // Master Template Exemplars (Devansh Dogra + Long Name test badges)
                    const exemplars: AttendeeBadgeData[] = [
                        {
                            id: "exemplar-devansh",
                            name: "DEVANSH DOGRA",
                            ticketNumber: "ORP5IC-IND-20548",
                            category: "RESEARCH SCHOLAR",
                            group: "delegate",
                            subgroup: "Research Scholar",
                            country: "INDIA",
                            institution: "Dr. Y.S. Parmar University of Horticulture & Forestry",
                            designation: "Research Scholar",
                            photoUrl: "",
                            mode: "physical",
                            paymentStatus: "paid",
                        },
                        {
                            id: "exemplar-muhammad",
                            name: "MUHAMMAD ABDUL RAHMAN AL-HASSAN",
                            ticketNumber: "ORP5IC-IND-20549",
                            category: "SCIENTIST",
                            group: "delegate",
                            subgroup: "Scientist",
                            country: "INDIA",
                            institution: "ICAR-Indian Agricultural Research Institute",
                            designation: "Senior Scientist",
                            photoUrl: "",
                            mode: "physical",
                            paymentStatus: "paid",
                        },
                        {
                            id: "exemplar-li-wei",
                            name: "LI WEI",
                            ticketNumber: "ORP5IC-CHN-10293",
                            category: "PROFESSIONAL",
                            group: "delegate",
                            subgroup: "Professional",
                            country: "CHINA",
                            institution: "China National Rice Research Institute",
                            designation: "Lead Agronomist",
                            photoUrl: "",
                            mode: "physical",
                            paymentStatus: "paid",
                        },
                    ];

                    const combined = [...exemplars, ...delegates];
                    setAttendees(combined);
                    setSelectedIds(new Set(combined.map((a) => a.id)));
                }
            }
        } catch (e) {
            console.error("Failed to load badges:", e);
        } finally {
            setLoading(false);
        }
    };

    // Filter attendees
    const filteredAttendees = useMemo(() => {
        return attendees.filter((att) => {
            // Group filter
            if (groupFilter !== "all" && att.group !== groupFilter) return false;

            // Category filter
            if (categoryFilter !== "all" && att.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const name = (att.name || "").toLowerCase();
                const ticket = (att.ticketNumber || "").toLowerCase();
                const inst = (att.institution || "").toLowerCase();
                const ctry = (att.country || "").toLowerCase();
                const cat = (att.category || "").toLowerCase();
                if (!name.includes(q) && !ticket.includes(q) && !inst.includes(q) && !ctry.includes(q) && !cat.includes(q)) {
                    return false;
                }
            }

            return true;
        });
    }, [attendees, groupFilter, categoryFilter, searchQuery]);

    // Cohort Summary Counts
    const stats = useMemo(() => {
        const total = attendees.length;
        const delegates = attendees.filter((a) => a.group === "delegate").length;
        const committee = attendees.filter((a) => a.group === "committee").length;
        const speakers = attendees.filter((a) => a.group === "speaker").length;
        const volunteers = attendees.filter((a) => a.group === "volunteer").length;
        return { total, delegates, committee, speakers, volunteers };
    }, [attendees]);

    // Categories in the filtered cohort
    const availableCategories = useMemo(() => {
        const set = new Set<string>();
        attendees.forEach((a) => {
            if (groupFilter === "all" || a.group === groupFilter) {
                if (a.category) set.add(a.category);
            }
        });
        return ["all", ...Array.from(set)];
    }, [attendees, groupFilter]);

    // Selection handlers
    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const selectAllFiltered = () => {
        const next = new Set(selectedIds);
        filteredAttendees.forEach((a) => next.add(a.id));
        setSelectedIds(next);
    };

    const deselectAllFiltered = () => {
        const next = new Set(selectedIds);
        filteredAttendees.forEach((a) => next.delete(a.id));
        setSelectedIds(next);
    };

    const selectedAttendees = useMemo(() => {
        return attendees.filter((a) => selectedIds.has(a.id));
    }, [attendees, selectedIds]);

    // Save edited attendee
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAttendee) return;

        setAttendees((prev) =>
            prev.map((a) => (a.id === editingAttendee.id ? editingAttendee : a))
        );
        setEditingAttendee(null);
    };

    // Add new attendee / badge
    const handleAddBadge = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAttendee.name) return;

        const id = `custom-${Date.now()}`;
        const autoTicket = newAttendee.ticketNumber || `ORP5IC-NEW-${Math.floor(10000 + Math.random() * 90000)}`;
        const created: AttendeeBadgeData = {
            id,
            name: newAttendee.name.trim(),
            ticketNumber: autoTicket.trim(),
            category: (newAttendee.category || "DELEGATE").toUpperCase(),
            group: newAttendee.group || "delegate",
            country: (newAttendee.country || "INDIA").toUpperCase(),
            institution: newAttendee.institution || "",
            designation: newAttendee.designation || "",
            photoUrl: newAttendee.photoUrl || "",
            mode: "physical",
            paymentStatus: "paid",
        };

        setAttendees((prev) => [created, ...prev]);
        setSelectedIds((prev) => new Set([id, ...prev]));
        setIsAddModalOpen(false);
        setNewAttendee({
            name: "",
            ticketNumber: "",
            category: "DELEGATE",
            country: "INDIA",
            institution: "",
            group: "delegate",
            photoUrl: "",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header (Hidden during print) */}
            <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Link href="/admin/registrations" className="hover:text-gray-900 flex items-center gap-1">
                            <ArrowLeft size={14} /> Registrations
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-semibold">Conference Badges & ID Cards</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#123125] flex items-center gap-3">
                        <IdCard className="text-[#d99b26]" size={32} />
                        ORP-5 Official Badge & ID Card Printing
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Designed to exact conference specifications. Badges for Delegates, Organizing Committee, Speakers, and Volunteers.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="gap-2 border-[#123125] text-[#123125] hover:bg-[#123125]/5"
                    >
                        <UserPlus size={15} /> Add Custom Badge
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadBadgesData}
                        className="gap-2"
                        disabled={loading}
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </Button>

                    <Button
                        onClick={() => window.print()}
                        disabled={selectedAttendees.length === 0}
                        className="bg-[#123125] hover:bg-[#1a4434] text-white gap-2 font-bold px-6 shadow-lg"
                    >
                        <Printer size={18} /> Print {selectedAttendees.length} Badges
                    </Button>
                </div>
            </div>

            {/* Cohort Tabs / Quick Stats (Hidden during print) */}
            <div className="no-print grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { id: "all", label: "All Badges", count: stats.total, icon: Users, color: "border-gray-300" },
                    { id: "delegate", label: "Delegates", count: stats.delegates, icon: Globe, color: "border-emerald-500" },
                    { id: "committee", label: "Organizing Committee", count: stats.committee, icon: Award, color: "border-blue-500" },
                    { id: "speaker", label: "Speakers", count: stats.speakers, icon: Mic, color: "border-purple-500" },
                    { id: "volunteer", label: "Volunteers", count: stats.volunteers, icon: HeartHandshake, color: "border-amber-500" },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = groupFilter === tab.id;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => {
                                setGroupFilter(tab.id);
                                setCategoryFilter("all");
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                isActive
                                    ? "bg-[#123125] text-white shadow-md border-[#123125]"
                                    : "bg-white text-gray-800 hover:border-gray-400 border-gray-200"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-[#d99b26]" : "text-gray-500"}`}>
                                    {tab.label}
                                </span>
                                <Icon size={16} className={isActive ? "text-[#d99b26]" : "text-gray-400"} />
                            </div>
                            <p className="text-2xl font-black mt-1">{tab.count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Badge Settings & Customization Drawer (Adjustable Photo & Info) */}
            <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-2">
                        <Sliders size={18} className="text-[#123125]" />
                        <h3 className="font-bold text-sm text-gray-800">Badge Layout & Photo Customization</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Adjustable
                        </span>
                    </div>

                    {/* Photo Toggle Button */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-700">Include Attendee Photo:</span>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showPhoto: !s.showPhoto }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                                settings.showPhoto
                                    ? "bg-[#123125] text-white shadow"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <Camera size={14} /> {settings.showPhoto ? "Photos ON" : "Photos OFF (Minimalist)"}
                        </button>
                    </div>
                </div>

                {/* Adjustable Photo Controls (Only shown when Photo is ON) */}
                {settings.showPhoto && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-amber-900">Photo Size:</span>
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-amber-200">
                                {(["sm", "md", "lg"] as const).map((sz) => (
                                    <button
                                        key={sz}
                                        onClick={() => setSettings((s) => ({ ...s, photoSize: sz }))}
                                        className={`px-2.5 py-1 rounded font-bold uppercase transition ${
                                            settings.photoSize === sz ? "bg-amber-600 text-white" : "text-gray-600 hover:text-black"
                                        }`}
                                    >
                                        {sz === "sm" ? "Small (64px)" : sz === "md" ? "Medium (78px)" : "Large (92px)"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-amber-900">Photo Shape:</span>
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-amber-200">
                                {(["circle", "rounded"] as const).map((shp) => (
                                    <button
                                        key={shp}
                                        onClick={() => setSettings((s) => ({ ...s, photoShape: shp }))}
                                        className={`px-2.5 py-1 rounded font-bold uppercase transition ${
                                            settings.photoShape === shp ? "bg-amber-600 text-white" : "text-gray-600 hover:text-black"
                                        }`}
                                    >
                                        {shp === "circle" ? "Circle" : "Rounded Square"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <span className="text-[11px] text-amber-800 italic">
                            Tip: Click any photo on the badge preview to upload or replace a photo.
                        </span>
                    </div>
                )}

                {/* Filters, Search & Layout Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, country, category, institution, or Ticket ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#123125]"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#123125] bg-white capitalize"
                        >
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Country, Institution & Organizers Toggles */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showCountry: !s.showCountry }))}
                            className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition text-center ${
                                settings.showCountry ? "bg-emerald-50 border-emerald-400 text-emerald-900" : "bg-gray-100 text-gray-400"
                            }`}
                        >
                            Country: {settings.showCountry ? "ON" : "OFF"}
                        </button>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showInstitution: !s.showInstitution }))}
                            className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition text-center ${
                                settings.showInstitution ? "bg-emerald-50 border-emerald-400 text-emerald-900" : "bg-gray-100 text-gray-400"
                            }`}
                        >
                            Affiliation: {settings.showInstitution ? "ON" : "OFF"}
                        </button>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showOrganizers: !s.showOrganizers }))}
                            className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition text-center ${
                                settings.showOrganizers ? "bg-emerald-50 border-emerald-400 text-emerald-900" : "bg-gray-100 text-gray-400"
                            }`}
                        >
                            Organizers: {settings.showOrganizers ? "ON" : "OFF"}
                        </button>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, showSlotGuide: !s.showSlotGuide }))}
                            className={`flex-1 py-2 px-2 rounded-xl border text-[11px] font-bold transition text-center ${
                                settings.showSlotGuide ? "bg-emerald-50 border-emerald-400 text-emerald-900" : "bg-gray-100 text-gray-400"
                            }`}
                            title="Lanyard Slot Punch Production Guide"
                        >
                            Slot Guide: {settings.showSlotGuide ? "ON" : "OFF"}
                        </button>
                    </div>
                </div>

                {/* Selection & Layout Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectAllFiltered}
                            className="text-xs text-[#123125] font-semibold gap-1.5 h-8 px-2.5 hover:bg-[#123125]/5"
                        >
                            <CheckSquare size={14} /> Select All Filtered ({filteredAttendees.length})
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={deselectAllFiltered}
                            className="text-xs text-gray-600 font-semibold gap-1.5 h-8 px-2.5 hover:bg-gray-100"
                        >
                            <Square size={14} /> Deselect All
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                            <button
                                onClick={() => setPrintLayout("a4-grid")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    printLayout === "a4-grid" ? "bg-white shadow-sm text-gray-900 font-bold" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                A4 Sheet (4 / page)
                            </button>
                            <button
                                onClick={() => setPrintLayout("single")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    printLayout === "single" ? "bg-white shadow-sm text-gray-900 font-bold" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                Single Badge
                            </button>
                        </div>

                        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                            <button
                                onClick={() => setViewMode("cards")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    viewMode === "cards" ? "bg-white shadow-sm text-gray-900 font-bold" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                Card Grid
                            </button>
                            <button
                                onClick={() => setViewMode("print-preview")}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    viewMode === "print-preview" ? "bg-white shadow-sm text-gray-900 font-bold" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                Print Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badge Display */}
            {loading ? (
                <div className="no-print bg-white p-16 rounded-2xl border border-gray-200 text-center space-y-3">
                    <RefreshCw className="animate-spin text-[#123125] mx-auto" size={32} />
                    <p className="text-gray-600 font-medium">Loading badges...</p>
                </div>
            ) : viewMode === "print-preview" ? (
                <div className="bg-gray-100 p-4 sm:p-8 rounded-2xl border">
                    <BadgePrintSheet attendees={selectedAttendees} layout={printLayout} settings={settings} />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="no-print flex items-center justify-between text-xs text-gray-500 px-1">
                        <span>
                            Showing <strong>{filteredAttendees.length}</strong> badges &bull; <strong>{selectedAttendees.length}</strong> selected for print
                        </span>
                        <span>Click badge to edit info / click photo to replace</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {filteredAttendees.map((att) => {
                            const isSelected = selectedIds.has(att.id);
                            return (
                                <div
                                    key={att.id}
                                    className={`relative group transition-all duration-200 ${
                                        isSelected ? "ring-4 ring-[#123125]/80 rounded-[28px]" : "opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    {/* Action Buttons on Card */}
                                    <div className="no-print absolute top-3 right-3 z-30 flex items-center gap-1.5">
                                        <button
                                            onClick={() => setEditingAttendee(att)}
                                            className="w-7 h-7 rounded-lg bg-white/95 text-gray-600 hover:text-black border border-gray-300 shadow-md flex items-center justify-center transition cursor-pointer"
                                            title="Edit badge details"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => toggleSelect(att.id)}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-md transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#123125] text-white border border-[#123125]"
                                                    : "bg-white/95 text-gray-400 border border-gray-300 hover:text-gray-700"
                                            }`}
                                            title={isSelected ? "Unselect badge" : "Select badge for print"}
                                        >
                                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                    </div>

                                    {/* Badge Component */}
                                    <AttendeeBadge
                                        attendee={att}
                                        settings={settings}
                                        onPhotoClick={() => setEditingAttendee(att)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Edit Attendee Modal */}
            {editingAttendee && (
                <div className="no-print fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-serif font-bold text-lg text-[#123125] flex items-center gap-2">
                                <Edit3 size={18} /> Edit Badge Details
                            </h3>
                            <button
                                onClick={() => setEditingAttendee(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3.5 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingAttendee.name}
                                    onChange={(e) => setEditingAttendee({ ...editingAttendee, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl font-bold uppercase text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">ORP Ticket ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingAttendee.ticketNumber}
                                        onChange={(e) => setEditingAttendee({ ...editingAttendee, ticketNumber: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={editingAttendee.country || ""}
                                        onChange={(e) => setEditingAttendee({ ...editingAttendee, country: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-xl font-bold uppercase text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Category Ribbon</label>
                                <input
                                    type="text"
                                    required
                                    value={editingAttendee.category}
                                    onChange={(e) => setEditingAttendee({ ...editingAttendee, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl font-bold uppercase text-gray-900"
                                    placeholder="e.g. RESEARCH SCHOLAR, DELEGATE, ORGANIZING COMMITTEE, KEYNOTE SPEAKER, VOLUNTEER"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Institution / Affiliation</label>
                                <input
                                    type="text"
                                    value={editingAttendee.institution || ""}
                                    onChange={(e) => setEditingAttendee({ ...editingAttendee, institution: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-gray-900"
                                />
                            </div>

                            {/* Direct Local PC Photo Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                                    Attendee Photo (Upload from Computer)
                                </label>
                                {editingAttendee.photoUrl ? (
                                    <div className="flex items-center gap-3.5 p-3 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-300 bg-white shrink-0 shadow-2xs">
                                            <img
                                                src={editingAttendee.photoUrl}
                                                alt="Attendee Photo Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">Photo Ready</p>
                                            <p className="text-[11px] text-emerald-800">Will print directly on badge</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <label className="cursor-pointer px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-700 transition flex items-center gap-1 shadow-2xs">
                                                    <UploadCloud size={13} /> Change Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (ev) => {
                                                                    setEditingAttendee({ ...editingAttendee, photoUrl: ev.target?.result as string });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingAttendee({ ...editingAttendee, photoUrl: "" })}
                                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#123125] bg-gray-50/60 hover:bg-gray-100/60 rounded-2xl p-4 cursor-pointer transition text-center group">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#123125] flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                                            <UploadCloud size={20} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">Click to upload photo from your computer</span>
                                        <span className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, JPEG, or WEBP</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        setEditingAttendee({ ...editingAttendee, photoUrl: ev.target?.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingAttendee(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#123125] text-white hover:bg-[#1a4434] font-bold px-5"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Custom Badge Modal */}
            {isAddModalOpen && (
                <div className="no-print fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-serif font-bold text-lg text-[#123125] flex items-center gap-2">
                                <UserPlus size={18} /> Create New Badge
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddBadge} className="space-y-3.5 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cohort Type</label>
                                <select
                                    value={newAttendee.group}
                                    onChange={(e: any) => setNewAttendee({ ...newAttendee, group: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                                >
                                    <option value="delegate">Registered Delegate</option>
                                    <option value="committee">Organizing Committee</option>
                                    <option value="speaker">Speaker</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. DEVANSH DOGRA"
                                    value={newAttendee.name}
                                    onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl font-bold uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Ribbon</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. DELEGATE"
                                        value={newAttendee.category}
                                        onChange={(e) => setNewAttendee({ ...newAttendee, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-xl font-bold uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Country</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. INDIA"
                                        value={newAttendee.country}
                                        onChange={(e) => setNewAttendee({ ...newAttendee, country: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-xl font-bold uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Institution / Affiliation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Centurion University"
                                    value={newAttendee.institution}
                                    onChange={(e) => setNewAttendee({ ...newAttendee, institution: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl"
                                />
                            </div>

                            {/* Direct Local PC Photo Upload for New Badge */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                                    Attendee Photo (Upload from Computer)
                                </label>
                                {newAttendee.photoUrl ? (
                                    <div className="flex items-center gap-3.5 p-3 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-300 bg-white shrink-0 shadow-2xs">
                                            <img
                                                src={newAttendee.photoUrl}
                                                alt="Attendee Photo Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">Photo Ready</p>
                                            <p className="text-[11px] text-emerald-800">Will print directly on badge</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <label className="cursor-pointer px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-700 transition flex items-center gap-1 shadow-2xs">
                                                    <UploadCloud size={13} /> Change Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (ev) => {
                                                                    setNewAttendee({ ...newAttendee, photoUrl: ev.target?.result as string });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewAttendee({ ...newAttendee, photoUrl: "" })}
                                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#123125] bg-gray-50/60 hover:bg-gray-100/60 rounded-2xl p-4 cursor-pointer transition text-center group">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#123125] flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                                            <UploadCloud size={20} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">Click to upload photo from your computer</span>
                                        <span className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, JPEG, or WEBP</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        setNewAttendee({ ...newAttendee, photoUrl: ev.target?.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#123125] text-white hover:bg-[#1a4434] font-bold px-5"
                                >
                                    Create Badge
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
