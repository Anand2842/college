"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { ListEditor } from "@/components/admin/ListEditor";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2 } from "lucide-react";

export default function SpeakersManager() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Keynotes");

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
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/speakers', {
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

    if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-charcoal">Speaker Management</h1>
                    <p className="text-sm text-gray-500">Manage Keynotes, Invited Speakers, and Scientific Panel.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-earth-green text-white">
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <AdminTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={["General Info", "Keynotes", "Invited", "Scientific Panel"]}
            />

            <div className="mt-8">
                {/* General Info Tab */}
                {activeTab === "General Info" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Page Intro</h2>
                        <div className="grid gap-6">
                            <AdminInput
                                label="Headline"
                                value={data.hero?.headline}
                                onChange={(e) => handleChange("hero", "headline", e.target.value)}
                            />
                            <AdminInput
                                label="Subheadline"
                                value={data.hero?.subheadline}
                                onChange={(e) => handleChange("hero", "subheadline", e.target.value)}
                            />
                            <AdminInput
                                label="Intro Title"
                                value={data.intro?.title}
                                onChange={(e) => handleChange("intro", "title", e.target.value)}
                            />
                            <AdminInput
                                label="Intro Description"
                                value={data.intro?.description}
                                onChange={(e) => handleChange("intro", "description", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Keynotes Tab */}
                {activeTab === "Keynotes" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Keynote Speakers"
                            items={data.keynotes || []}
                            onUpdate={(items) => handleListUpdate("keynotes", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "Role", institution: "Institution", imageUrl: "", focusArea: "Focus Area" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                    <AdminInput label="Institution" value={item.institution} onChange={(e) => update("institution", e.target.value)} />
                                    <AdminInput label="Focus Area" value={item.focusArea} onChange={(e) => update("focusArea", e.target.value)} />
                                    <div className="mt-2">
                                        <ImageUploader
                                            label="Photo"
                                            value={item.imageUrl}
                                            onChange={(url) => update("imageUrl", url)}
                                        />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {/* Invited Tab */}
                {activeTab === "Invited" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Invited Speakers"
                            items={data.invited || []}
                            onUpdate={(items) => handleListUpdate("invited", items)}
                            itemTemplate={{ id: "", name: "New Speaker", role: "Role", countryCode: "IN", imageUrl: "", tags: [] }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                    <AdminInput label="Country Code (e.g. IN, US, JP)" value={item.countryCode} onChange={(e) => update("countryCode", e.target.value)} />
                                    <div className="mt-2">
                                        <ImageUploader
                                            label="Photo"
                                            value={item.imageUrl}
                                            onChange={(url) => update("imageUrl", url)}
                                        />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {/* Scientific Panel Tab */}
                {activeTab === "Scientific Panel" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ListEditor
                            title="Scientific Panel Members"
                            items={data.panel || []}
                            onUpdate={(items) => handleListUpdate("panel", items)}
                            itemTemplate={{ id: "", name: "New Member", role: "Role", expertise: "Expertise" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role/Institution" value={item.role} onChange={(e) => update("role", e.target.value)} />
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
