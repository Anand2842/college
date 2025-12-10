"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AboutPageData } from "@/types/pages";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AboutPageEditor() {
    const [data, setData] = useState<AboutPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/about")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            });
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
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

    // Specifically for the "atAGlance" simple string array
    const handleStringListUpdate = (key: string, newItems: string[]) => {
        // Need to wrap strings in objects for ListEditor if we were using it for strings, 
        // but let's just use a simple textarea split for now for simplicity on "atAGlance"
        // OR better: use ListEditor with a simple adapter.
        // Actually, let's just make "At A Glance" a text area where lines = items.
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/about', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("About Page Saved!");
            else alert("Failed to save.");
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">Failed to load data</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-charcoal">About Page Editor</h1>
                    <p className="text-xs text-gray-500">Edit content for /about</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/about" target="_blank">
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
                    tabs={["Hero & Intro", "Why Matters", "Objectives", "Organizers"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage || ""} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Introduction & At A Glance</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={data.intro.description}
                                        onChange={(e) => handleChange("intro", "description", e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-32"
                                    />
                                </div>
                                <AdminInput
                                    label="At A Glance (Comma separated)"
                                    value={data.intro.atAGlance.join(", ")}
                                    onChange={(e) => setData({ ...data, intro: { ...data.intro, atAGlance: e.target.value.split(",").map((s: string) => s.trim()) } })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Why Matters" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Why ORP-5 Matters</h2>
                        <ListEditor
                            title="Reason Cards"
                            items={data.whyMatters || []}
                            onUpdate={(items) => handleListUpdate("whyMatters", items)}
                            itemTemplate={{ id: "", title: "New Reason", description: "", iconName: "Star" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    <AdminInput label="Icon Name" value={item.iconName} onChange={(e) => update("iconName", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Objectives" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Conference Objectives</h2>
                        <div className="space-y-4">
                            {data.objectives.map((obj: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-lg"
                                        value={obj}
                                        onChange={(e) => {
                                            const newObjs = [...data.objectives];
                                            newObjs[i] = e.target.value;
                                            setData({ ...data, objectives: newObjs });
                                        }}
                                    />
                                    <Button
                                        onClick={() => {
                                            const newObjs = data.objectives.filter((_: any, idx: number) => idx !== i);
                                            setData({ ...data, objectives: newObjs });
                                        }}
                                        variant="outline"
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={() => setData({ ...data, objectives: [...data.objectives, "New Objective"] })} className="w-full border-dashed border-2 border-gray-200 text-gray-400 hover:text-earth-green hover:border-earth-green mt-4">
                                + Add Objective
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === "Organizers" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Organizers</h2>
                        <ListEditor
                            title="Organizer List"
                            items={data.organizers || []}
                            onUpdate={(items) => handleListUpdate("organizers", items)}
                            itemTemplate={{ id: "", name: "New Organizer", description: "", logoUrl: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <ImageUploader
                                        label="Organizer Logo"
                                        value={item.logoUrl || ""}
                                        onChange={(url) => update("logoUrl", url)}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => update("description", e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-24"
                                        />
                                    </div>
                                </>
                            )}
                        />

                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b mt-12">Collaborating Partners</h2>
                        <ListEditor
                            title="Partners List"
                            items={data.partners || []}
                            onUpdate={(items) => handleListUpdate("partners", items)}
                            itemTemplate={{ name: "New Partner", imageUrl: "", website: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Partner Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <ImageUploader
                                        label="Partner Logo"
                                        value={item.imageUrl || ""}
                                        onChange={(url) => update("imageUrl", url)}
                                    />
                                    <AdminInput label="Website URL" value={item.website || ""} onChange={(e) => update("website", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
