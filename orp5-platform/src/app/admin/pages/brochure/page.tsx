"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function BrochureEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/brochure")
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

    // For downloads buttons array inside downloadSection
    const handleDownloadButtonUpdate = (index: number, field: string, value: string) => {
        const buttons = [...data.downloadSection.buttons];
        buttons[index] = { ...buttons[index], [field]: value };
        setData((prev: any) => ({
            ...prev,
            downloadSection: { ...prev.downloadSection, buttons }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/brochure', {
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
                title="Brochure Page Editor"
                subtitle="Manage content for /brochure"
                onSave={handleSave}
                saving={saving}
                viewLink="/brochure"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Intro", "Highlights", "Downloads", "Chapters & CTA"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Intro Card</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <AdminInput label="Description" value={data.intro.description} onChange={(e) => handleChange("intro", "description", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Highlights" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Highlights Grid</h2>
                        <ListEditor
                            title="Highlight Cards"
                            items={data.highlights || []}
                            onUpdate={(items) => handleListUpdate("highlights", items)}
                            itemTemplate={{ id: "", title: "New Highlight", description: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Downloads" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Download Section</h2>
                        <div className="grid gap-6 mb-8">
                            <AdminInput label="Title" value={data.downloadSection.title} onChange={(e) => handleChange("downloadSection", "title", e.target.value)} />
                            <AdminInput label="Description" value={data.downloadSection.description} onChange={(e) => handleChange("downloadSection", "description", e.target.value)} />
                            <AdminInput label="Footer Text" value={data.downloadSection.footerText} onChange={(e) => handleChange("downloadSection", "footerText", e.target.value)} />
                        </div>

                        <h3 className="font-bold text-lg mb-4 text-gray-700">Buttons</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {data.downloadSection.buttons.map((btn: any, i: number) => (
                                <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="font-bold text-xs mb-2 uppercase text-gray-500">Button {i + 1}</p>
                                    <div className="space-y-3">
                                        <AdminInput label="Label" value={btn.label} onChange={(e) => handleDownloadButtonUpdate(i, "label", e.target.value)} />
                                        <AdminInput label="Link" value={btn.link} onChange={(e) => handleDownloadButtonUpdate(i, "link", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "Chapters & CTA" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Chapters List</h2>
                            <ListEditor
                                title="Chapters"
                                items={data.chapters || []}
                                onUpdate={(items) => handleListUpdate("chapters", items)}
                                itemTemplate={{ id: "", title: "New Chapter", icon: "Info" }}
                                renderItemFields={(item, i, update) => (
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Icon Name" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </div>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Footer CTA</h2>
                            <AdminInput label="Headline" value={data.footerCta.headline} onChange={(e) => handleChange("footerCta", "headline", e.target.value)} />
                            <div className="mt-4">
                                <AdminInput label="Subheadline" value={data.footerCta.subheadline} onChange={(e) => handleChange("footerCta", "subheadline", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
