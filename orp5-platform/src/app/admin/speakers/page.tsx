"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { ListEditor } from "@/components/admin/ListEditor";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SpeakersManager() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/presenters")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((jsonData) => {
                setData(jsonData || {});
                setLoading(false);
            })
            .catch((e) => {
                console.error("Fetch error on speakers:", e);
                setLoading(false);
            });
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            [section]: { ...(prev?.[section] || {}), [field]: value },
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
            const res = await fetch('/api/content/presenters', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Speakers Saved Successfully!");
            else alert("Failed to save.");
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-earth-green" size={32} /></div>;

    const hero = data?.hero || {};
    const intro = data?.intro || {};

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-charcoal">Speaker Management</h1>
                    <p className="text-sm text-gray-500">Manage Keynotes, Invited Speakers, and Scientific Panel for /speakers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/speakers" target="_blank" className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 text-charcoal transition-colors">
                        View Live Page
                    </Link>
                    <Button onClick={handleSave} disabled={saving} className="bg-earth-green text-white">
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <AdminTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={["Hero & Intro", "Keynote Speakers", "Invited Speakers", "Scientific Panel"]}
            />

            <div className="mt-8">
                {/* Hero & Intro Tab */}
                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput
                                    label="Headline"
                                    value={hero.headline || ""}
                                    onChange={(e) => handleChange("hero", "headline", e.target.value)}
                                />
                                <AdminInput
                                    label="Subheadline"
                                    value={hero.subheadline || ""}
                                    onChange={(e) => handleChange("hero", "subheadline", e.target.value)}
                                />
                                <ImageUploader
                                    label="Background Image"
                                    value={hero.backgroundImage || ""}
                                    onChange={(url) => handleChange("hero", "backgroundImage", url)}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Intro Section</h2>
                            <div className="grid gap-6">
                                <AdminInput
                                    label="Intro Title"
                                    value={intro.title || ""}
                                    onChange={(e) => handleChange("intro", "title", e.target.value)}
                                />
                                <AdminInput
                                    label="Intro Description"
                                    value={intro.description || ""}
                                    onChange={(e) => handleChange("intro", "description", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Keynotes Tab */}
                {activeTab === "Keynote Speakers" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Keynote Speakers"
                            items={data?.keynotes || []}
                            onUpdate={(items) => handleListUpdate("keynotes", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "Role", institution: "Institution", imageUrl: "", focusArea: "Focus Area", countryCode: "" }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <AdminInput label="Name" value={item.name || ""} onChange={(e) => update("name", e.target.value)} />
                                        <AdminInput label="Role" value={item.role || ""} onChange={(e) => update("role", e.target.value)} />
                                        <AdminInput label="Institution" value={item.institution || ""} onChange={(e) => update("institution", e.target.value)} />
                                        <AdminInput label="Focus Area" value={item.focusArea || ""} onChange={(e) => update("focusArea", e.target.value)} />
                                        <AdminInput label="Country Code (2-letter, e.g. IN, US, JP, IT)" value={item.countryCode || item.country || ""} onChange={(e) => update("countryCode", e.target.value)} />
                                    </div>
                                    <div>
                                        <ImageUploader
                                            label="Photo"
                                            value={item.imageUrl || ""}
                                            onChange={(url) => update("imageUrl", url)}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}

                {/* Invited Tab */}
                {activeTab === "Invited Speakers" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Invited Speakers"
                            items={data?.invited || []}
                            onUpdate={(items) => handleListUpdate("invited", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "Role", institution: "Institution", countryCode: "IN", imageUrl: "", tags: [] }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <AdminInput label="Name" value={item.name || ""} onChange={(e) => update("name", e.target.value)} />
                                        <AdminInput label="Role" value={item.role || ""} onChange={(e) => update("role", e.target.value)} />
                                        <AdminInput label="Institution" value={item.institution || ""} onChange={(e) => update("institution", e.target.value)} />
                                        <AdminInput label="Country Code (2-letter, e.g. IN, US, JP)" value={item.countryCode || item.country || ""} onChange={(e) => update("countryCode", e.target.value)} />
                                        <AdminInput
                                            label="Tags (Comma separated)"
                                            value={Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || "")}
                                            onChange={(e) => update("tags", e.target.value.split(",").map((s: string) => s.trim()))}
                                        />
                                    </div>
                                    <div>
                                        <ImageUploader
                                            label="Photo"
                                            value={item.imageUrl || ""}
                                            onChange={(url) => update("imageUrl", url)}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}

                {/* Scientific Panel Tab */}
                {activeTab === "Scientific Panel" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Scientific Panel Members"
                            items={data?.panel || []}
                            onUpdate={(items) => handleListUpdate("panel", items)}
                            itemTemplate={{ id: "", name: "New Member", role: "Role", expertise: "Expertise" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name || ""} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role / Institution" value={item.role || ""} onChange={(e) => update("role", e.target.value)} />
                                    <AdminInput label="Expertise" value={item.expertise || ""} onChange={(e) => update("expertise", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
