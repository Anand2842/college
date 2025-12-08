"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AwardsPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/awards")
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/awards', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Awards Page Saved!");
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
                    <h1 className="text-xl font-bold text-charcoal">Awards Manager</h1>
                    <p className="text-xs text-gray-500">Edit awards, criteria, and logistics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/awards" target="_blank">
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
                    tabs={["Hero & Intro", "Categories", "Criteria", "Logistics"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="grid gap-6">
                                <AdminInput label="Intro Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Intro Description</label>
                                    <textarea
                                        value={data.intro.description}
                                        onChange={(e) => handleChange("intro", "description", e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-24"
                                    />
                                </div>
                                <div className="h-px bg-gray-200 my-4"></div>
                                <AdminInput label="Judging Title" value={data.judging.title} onChange={(e) => handleChange("judging", "title", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Judging Description</label>
                                    <textarea
                                        value={data.judging.description}
                                        onChange={(e) => handleChange("judging", "description", e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-24"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Categories" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Award Categories</h2>
                        <ListEditor
                            title="Awards"
                            items={data.categories || []}
                            onUpdate={(items) => handleListUpdate("categories", items)}
                            itemTemplate={{ id: "", title: "New Award", description: "", iconName: "Star" }}
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

                {activeTab === "Criteria" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Selection Criteria</h2>
                        <ListEditor
                            title="Criteria Points"
                            items={data.criteria || []}
                            onUpdate={(items) => handleListUpdate("criteria", items)}
                            itemTemplate={{ id: "", title: "New Criteria", description: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Logistics" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Logistics (Date, Time, Venue)</h2>
                        <div className="grid gap-6">
                            <AdminInput label="Date" value={data.logistics.date} onChange={(e) => handleChange("logistics", "date", e.target.value)} />
                            <AdminInput label="Venue" value={data.logistics.venue} onChange={(e) => handleChange("logistics", "venue", e.target.value)} />
                            <AdminInput label="Event Name" value={data.logistics.event} onChange={(e) => handleChange("logistics", "event", e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
