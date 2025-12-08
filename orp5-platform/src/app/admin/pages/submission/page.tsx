"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SubmissionPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Dates");

    useEffect(() => {
        fetch("/api/content/submission")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            });
    }, []);

    const handleChange = (section: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleListUpdate = (key: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [key]: newItems
        }));
    };

    const handleThematicUpdate = (newItems: any[]) => {
        // Wrapper for list of strings
        setData((prev: any) => ({
            ...prev,
            thematicAreas: newItems.map(item => item.text)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/submission', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) alert("Page Saved!");
            else alert("Failed to save.");
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-charcoal">Submission Page Manager</h1>
                    <p className="text-xs text-gray-500">Edit form options, dates, and instructions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/submission" target="_blank">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <ExternalLink size={16} className="mr-2" /> View Page
                        </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={saving} className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px]">
                        {saving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Dates", "Categories & Themes", "Info & CTA"]}
                />

                {activeTab === "Hero & Dates" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20"
                                    rows={4}
                                    value={data.hero.description}
                                    onChange={(e) => handleChange("hero", "description", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Simple Timeline</h2>
                            <ListEditor
                                title="Milestones"
                                items={data.timeline || []}
                                onUpdate={(items) => handleListUpdate("timeline", items)}
                                itemTemplate={{ label: "Event Name", date: "Jan 1, 2026" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Event Label" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                        <AdminInput label="Date" value={item.date} onChange={(e) => update("date", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Categories & Themes" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Submission Categories</h2>
                            <ListEditor
                                title="Categories"
                                items={data.categories || []}
                                onUpdate={(items) => handleListUpdate("categories", items)}
                                itemTemplate={{ title: "New Category", description: "" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Thematic Areas</h2>
                            <ListEditor
                                title="Themes"
                                items={data.thematicAreas.map((t: string) => ({ id: t, text: t })) || []}
                                onUpdate={handleThematicUpdate}
                                itemTemplate={{ id: "", text: "New Theme" }}
                                renderItemFields={(item, i, update) => (
                                    <AdminInput label="Theme Name" value={item.text} onChange={(e) => update("text", e.target.value)} />
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Info & CTA" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Information Cards</h2>
                            <div className="grid gap-6 mb-6">
                                <h3 className="font-bold text-gray-700">Review Card</h3>
                                <AdminInput label="Title" value={data.infoCards.review.title} onChange={(e) => handleChange("infoCards", "review", { ...data.infoCards.review, title: e.target.value })} />
                                <AdminInput label="Description" value={data.infoCards.review.description} onChange={(e) => handleChange("infoCards", "review", { ...data.infoCards.review, description: e.target.value })} />
                            </div>
                            <div className="grid gap-6">
                                <h3 className="font-bold text-gray-700">Support Card</h3>
                                <AdminInput label="Title" value={data.infoCards.support.title} onChange={(e) => handleChange("infoCards", "support", { ...data.infoCards.support, title: e.target.value })} />
                                <AdminInput label="Description" value={data.infoCards.support.description} onChange={(e) => handleChange("infoCards", "support", { ...data.infoCards.support, description: e.target.value })} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Bottom CTA</h2>
                            <AdminInput label="Headline" value={data.cta.headline} onChange={(e) => handleChange("cta", "headline", e.target.value)} />
                            <AdminInput label="Subheadline" value={data.cta.subheadline} onChange={(e) => handleChange("cta", "subheadline", e.target.value)} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
