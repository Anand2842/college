"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ThemesPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero");

    useEffect(() => {
        fetch("/api/content/themes")
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

    // For nested Intro object
    const handleIntroChange = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            intro: { ...prev.intro, [field]: value },
        }));
    }

    const handleListUpdate = (key: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [key]: newItems
        }));
    }

    const handlePillarsUpdate = (newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            pillars: { ...prev.pillars, items: newItems }
        }));
    }

    const handlePillarsTextChange = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            pillars: { ...prev.pillars, [field]: value }
        }));
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/themes', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Changes Saved Successfully!");
            else alert("Failed to save changes.");
        } catch (e) {
            console.error(e);
            alert("Error saving changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-charcoal">Themes Page Editor</h1>
                        <p className="text-xs text-gray-500">Edit content for /themes</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/themes" target="_blank">
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
                    tabs={["Hero", "Core Themes", "Pillars"]}
                />

                {/* Hero Tab */}
                {activeTab === "Hero" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                        <div className="grid gap-6">
                            <AdminInput
                                label="Headline"
                                value={data.hero.headline}
                                onChange={(e) => handleChange("hero", "headline", e.target.value)}
                            />
                            <AdminInput
                                label="Subheadline"
                                value={data.hero.subheadline}
                                onChange={(e) => handleChange("hero", "subheadline", e.target.value)}
                            />
                            <ImageUploader
                                label="Hero Background Image"
                                value={data.hero.backgroundImage}
                                onChange={(url) => handleChange("hero", "backgroundImage", url)}
                            />
                        </div>
                    </div>
                )}

                {/* Core Themes Tab */}
                {activeTab === "Core Themes" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Section Header</h2>
                            <AdminInput
                                label="Section Title"
                                value={data.intro.title}
                                onChange={(e) => handleIntroChange("title", e.target.value)}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Manage Themes List</h2>
                            <ListEditor
                                title="Core Themes"
                                items={data.themes || []}
                                onUpdate={(items) => handleListUpdate("themes", items)}
                                itemTemplate={{ id: "", title: "New Theme", description: "", iconName: "Leaf", colorTheme: "green" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <AdminInput label="Icon Name (Lucide)" value={item.iconName} onChange={(e) => update("iconName", e.target.value)} />
                                            <div>
                                                <label className="block text-sm font-bold text-earth-green mb-1">Color Theme</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    value={item.colorTheme}
                                                    onChange={(e) => update("colorTheme", e.target.value)}
                                                >
                                                    <option value="green">Green (Earth)</option>
                                                    <option value="mint">Mint (Sapling)</option>
                                                    <option value="gold">Gold (Rice)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Pillars Tab */}
                {activeTab === "Pillars" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Pillars Introduction</h2>
                            <AdminInput
                                label="Title"
                                value={data.pillars.title}
                                onChange={(e) => handlePillarsTextChange("title", e.target.value)}
                            />
                            <AdminInput
                                label="Description"
                                value={data.pillars.description}
                                onChange={(e) => handlePillarsTextChange("description", e.target.value)}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">The 3 Pillars</h2>
                            <ListEditor
                                title="Pillars"
                                items={data.pillars.items || []}
                                onUpdate={handlePillarsUpdate}
                                itemTemplate={{ id: "", title: "New Pillar", description: "", iconName: "Star", colorTheme: "green" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        <AdminInput label="Icon Name" value={item.iconName} onChange={(e) => update("iconName", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
