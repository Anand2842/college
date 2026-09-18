"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2, Save, Plus, Trash2, ExternalLink, ArrowUp, ArrowDown, Building } from "lucide-react";
import Link from "next/link";

interface PartnerItem {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
    category: string;
    order?: number;
}

const CATEGORIES = [
    { label: "Jointly organised by", description: "Primary organising institutions" },
    { label: "Supported by", description: "Government bodies, banks & patrons" },
    { label: "Knowledge partner", description: "Research institutes & academic leads" },
    { label: "Technical collaborating partners", description: "Technical, publishers & collaborating bodies" },
    { label: "In collaboration with", description: "Other partners & collaborators" },
];

export default function SponsorsAndPartnersManager() {
    const [partners, setPartners] = useState<PartnerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/content/partners");
            if (res.ok) {
                const data = await res.json();
                setPartners(data || []);
            }
        } catch (e) {
            console.error("Failed to load partners:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/content/partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(partners),
            });

            if (res.ok) {
                alert("Partners & Sponsors saved successfully!");
                await fetchPartners();
            } else {
                alert("Failed to save partners.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving partners.");
        } finally {
            setSaving(false);
        }
    };

    const addPartner = (category = "Supported by") => {
        const newPartner: PartnerItem = {
            id: crypto.randomUUID(),
            name: "New Organization",
            logoUrl: "",
            website: "",
            category: category === "All" ? "Supported by" : category,
            order: partners.length,
        };
        setPartners([...partners, newPartner]);
    };

    const updatePartner = (id: string, field: keyof PartnerItem, value: any) => {
        setPartners(partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const removePartner = (id: string) => {
        if (!confirm("Are you sure you want to remove this organisation?")) return;
        setPartners(partners.filter((p) => p.id !== id));
    };

    const movePartner = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= partners.length) return;

        const updated = [...partners];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);
        setPartners(updated.map((p, idx) => ({ ...p, order: idx })));
    };

    const filteredPartners =
        selectedCategory === "All"
            ? partners
            : partners.filter((p) => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-earth-green" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-charcoal flex items-center gap-2">
                        <Building className="text-earth-green" size={22} />
                        Partners, Sponsors & Supporting Bodies
                    </h1>
                    <p className="text-xs text-gray-500">
                        Manage all collaborating institutions, sponsors, and supporting government / patron bodies
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" target="_blank">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <ExternalLink size={16} className="mr-2" /> View Homepage
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCategory === "All"
                                ? "bg-earth-green text-white shadow-sm"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                        All ({partners.length})
                    </button>
                    {CATEGORIES.map((cat) => {
                        const count = partners.filter((p) => p.category === cat.label).length;
                        return (
                            <button
                                key={cat.label}
                                onClick={() => setSelectedCategory(cat.label)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCategory === cat.label
                                        ? "bg-earth-green text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {cat.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* List of Partners */}
                <div className="space-y-4">
                    {filteredPartners.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
                            <Building size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium mb-4">
                                No organisations found in this category.
                            </p>
                            <Button onClick={() => addPartner(selectedCategory)} className="bg-earth-green text-white">
                                <Plus size={16} className="mr-2" /> Add Organisation
                            </Button>
                        </div>
                    ) : (
                        filteredPartners.map((item, idx) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-earth-green/10 text-earth-green font-bold flex items-center justify-center text-sm">
                                            {idx + 1}
                                        </span>
                                        <h3 className="font-bold text-gray-900 text-base">{item.name || "Untitled Organisation"}</h3>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => movePartner(idx, "up")}
                                            disabled={idx === 0}
                                            className="h-8 w-8 p-0 text-gray-500"
                                            title="Move Up"
                                        >
                                            <ArrowUp size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => movePartner(idx, "down")}
                                            disabled={idx === filteredPartners.length - 1}
                                            className="h-8 w-8 p-0 text-gray-500"
                                            title="Move Down"
                                        >
                                            <ArrowDown size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removePartner(item.id)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            title="Remove Organisation"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AdminInput
                                        label="Organisation / Institution Name"
                                        value={item.name}
                                        onChange={(e) => updatePartner(item.id, "name", e.target.value)}
                                        placeholder="e.g. NATIONAL BANK FOR AGRICULTURE AND RURAL DEVELOPMENT"
                                    />

                                    <div>
                                        <label className="block text-sm font-bold text-earth-green mb-2">Category / Tier</label>
                                        <select
                                            value={item.category}
                                            onChange={(e) => updatePartner(item.id, "category", e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-earth-green/20 focus:outline-none"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.label} value={cat.label}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <AdminInput
                                        label="Website URL"
                                        value={item.website || ""}
                                        onChange={(e) => updatePartner(item.id, "website", e.target.value)}
                                        placeholder="https://..."
                                    />

                                    <div className="md:col-span-2">
                                        <ImageUploader
                                            label="Organisation Logo / Emblem"
                                            value={item.logoUrl || ""}
                                            onChange={(url) => updatePartner(item.id, "logoUrl", url)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Partner Button */}
                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={() => addPartner(selectedCategory)}
                        className="bg-white border-2 border-dashed border-gray-300 hover:border-earth-green text-gray-700 hover:text-earth-green w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={18} />
                        Add New Organisation / Sponsor
                    </Button>
                </div>
            </div>
        </div>
    );
}
