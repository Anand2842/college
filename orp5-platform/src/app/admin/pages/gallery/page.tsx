"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function GalleryEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/gallery")
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

    // For simple string arrays (filters)
    const handleFiltersUpdate = (val: string) => {
        const filters = val.split('\n').filter(s => s.trim() !== "");
        setData((prev: any) => ({ ...prev, filters }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/gallery', {
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
                title="Gallery Editor"
                subtitle="Manage content for /gallery"
                onSave={handleSave}
                saving={saving}
                viewLink="/gallery"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Intro", "Featured Gallery", "Main Gallery", "Media Kits"]}
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Filters</h2>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Categories (Newline separated)</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-2 text-sm h-32"
                                value={data.filters.join('\n')}
                                onChange={(e) => handleFiltersUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Featured Gallery" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Featured Photos (Top Row)</h2>
                        <ListEditor
                            title="Featured Items"
                            items={data.featuredGallery || []}
                            onUpdate={(items) => handleListUpdate("featuredGallery", items)}
                            itemTemplate={{ id: "", title: "New Photo", category: "Inauguration & Keynotes", image: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Category" value={item.category} onChange={(e) => update("category", e.target.value)} />
                                    <div className="mt-2">
                                        <ImageUploader label="Photo" value={item.image} onChange={(url) => update("image", url)} />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Main Gallery" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Main Gallery Photos</h2>
                        <ListEditor
                            title="Gallery Items"
                            items={data.mainGallery || []}
                            onUpdate={(items) => handleListUpdate("mainGallery", items)}
                            itemTemplate={{ id: "", title: "New Photo", category: "Technical Sessions", image: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Category" value={item.category} onChange={(e) => update("category", e.target.value)} />
                                    <div className="mt-2">
                                        <ImageUploader label="Photo" value={item.image} onChange={(url) => update("image", url)} />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Media Kits" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Downloadable Media Kits</h2>
                        <ListEditor
                            title="Kits"
                            items={data.mediaKits || []}
                            onUpdate={(items) => handleListUpdate("mediaKits", items)}
                            itemTemplate={{ id: "", title: "New Kit", description: "", icon: "Newspaper", downloadLink: "#" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <AdminInput label="Icon Name" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                        <AdminInput label="Download Link" value={item.downloadLink} onChange={(e) => update("downloadLink", e.target.value)} />
                                    </div>
                                </>
                            )}
                        />
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Footer CTA</h3>
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
