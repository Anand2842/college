"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function SpeakersEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/speakers")
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
            const res = await fetch('/api/content/speakers', {
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
            <PageHeader
                title="Speakers Page Editor"
                subtitle="Manage content for /speakers"
                onSave={handleSave}
                saving={saving}
                viewLink="/speakers"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Intro", "Keynote Speakers", "Invited Speakers", "Scientific Panel"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Intro Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <AdminInput label="Description" value={data.intro.description} onChange={(e) => handleChange("intro", "description", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Keynote Speakers" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Keynote Speakers</h2>
                        <ListEditor
                            title="Speakers"
                            items={data.keynotes || []}
                            onUpdate={(items) => handleListUpdate("keynotes", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "", institution: "", imageUrl: "", focusArea: "" }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                        <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                        <AdminInput label="Institution" value={item.institution} onChange={(e) => update("institution", e.target.value)} />
                                        <AdminInput label="Focus Area" value={item.focusArea} onChange={(e) => update("focusArea", e.target.value)} />
                                    </div>
                                    <div>
                                        <ImageUploader label="Speaker Photo" value={item.imageUrl} onChange={(url) => update("imageUrl", url)} />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Invited Speakers" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Invited Speakers</h2>
                        <ListEditor
                            title="Invited Speakers"
                            items={data.invited || []}
                            onUpdate={(items) => handleListUpdate("invited", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "", countryCode: "IN", imageUrl: "", tags: [] }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                        <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                        <AdminInput label="Country Code (2-letter)" value={item.countryCode} onChange={(e) => update("countryCode", e.target.value)} />
                                        <AdminInput
                                            label="Tags (Comma separated)"
                                            value={item.tags ? item.tags.join(", ") : ""}
                                            onChange={(e) => update("tags", e.target.value.split(",").map((s: string) => s.trim()))}
                                        />
                                    </div>
                                    <div>
                                        <ImageUploader label="Speaker Photo" value={item.imageUrl} onChange={(url) => update("imageUrl", url)} />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Scientific Panel" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Scientific Panel</h2>
                        <ListEditor
                            title="Panel Members"
                            items={data.panel || []}
                            onUpdate={(items) => handleListUpdate("panel", items)}
                            itemTemplate={{ id: "", name: "New Member", role: "", expertise: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                    <AdminInput label="Expertise" value={item.expertise} onChange={(e) => update("expertise", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
