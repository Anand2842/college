"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ExhibitionPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/exhibition")
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

    const handleNestedListUpdate = (section: string, field: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: newItems }
        }));
    };

    const handleStringListUpdate = (key: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [key]: newItems.map(i => i.text)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/exhibition', {
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
                    <h1 className="text-xl font-bold text-charcoal">Exhibition Page Manager</h1>
                    <p className="text-xs text-gray-500">Edit benefits, floor plan, and guidelines.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/exhibition" target="_blank">
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
                    tabs={["Hero & Intro", "Benefits & Segments", "Layout & Audience", "Guidelines"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <AdminInput label="Button Label" value={data.hero.button.label} onChange={(e) => handleChange("hero", "button", { ...data.hero.button, label: e.target.value })} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Introduction</h2>
                            <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 mt-4"
                                rows={4}
                                value={data.intro.description}
                                onChange={(e) => handleChange("intro", "description", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Benefits & Segments" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Why Exhibit?</h2>
                            <ListEditor
                                title="Benefits"
                                items={data.whyExhibit || []}
                                onUpdate={(items) => handleListUpdate("whyExhibit", items)}
                                itemTemplate={{ title: "New Benefit", description: "", icon: "Star" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        <AdminInput label="Icon (Lucide)" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Exhibition Segments</h2>
                            <ListEditor
                                title="Segments"
                                items={data.segments || []}
                                onUpdate={(items) => handleListUpdate("segments", items)}
                                itemTemplate={{ label: "New Segment", icon: "Tag" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Label" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                        <AdminInput label="Icon (Lucide)" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Layout & Audience" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Floor Layout</h2>
                            <AdminInput label="Title" value={data.floorLayout.title} onChange={(e) => handleChange("floorLayout", "title", e.target.value)} />
                            <AdminInput label="Description" value={data.floorLayout.description} onChange={(e) => handleChange("floorLayout", "description", e.target.value)} />
                            <ImageUploader label="Floor Plan Image" value={data.floorLayout.imageUrl} onChange={(url) => handleChange("floorLayout", "imageUrl", url)} />

                            <h3 className="font-bold text-gray-700 mt-6 mb-2">Booth Types</h3>
                            <ListEditor
                                title="Booth Types"
                                items={data.floorLayout.boothTypes || []}
                                onUpdate={(items) => handleNestedListUpdate("floorLayout", "boothTypes", items)}
                                itemTemplate={{ title: "Booth Type", description: "" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Who Can Exhibit?</h2>
                            <ListEditor
                                title="Audience List"
                                items={data.whoCanExhibit.map((t: string) => ({ id: t, text: t })) || []}
                                onUpdate={(items) => handleStringListUpdate("whoCanExhibit", items)}
                                itemTemplate={{ id: "", text: "Participant Type" }}
                                renderItemFields={(item, i, update) => (
                                    <AdminInput label="Type" value={item.text} onChange={(e) => update("text", e.target.value)} />
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Guidelines" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Exhibitor Guidelines</h2>
                        <ListEditor
                            title="Accordions"
                            items={data.guidelines || []}
                            onUpdate={(items) => handleListUpdate("guidelines", items)}
                            itemTemplate={{ title: "New Guideline", content: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 mt-2"
                                        rows={3}
                                        value={item.content}
                                        onChange={(e) => update("content", e.target.value)}
                                    />
                                </>
                            )}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
