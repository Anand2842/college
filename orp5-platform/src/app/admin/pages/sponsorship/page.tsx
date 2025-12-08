"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SponsorshipPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/sponsorship")
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

    // Special handler for Tiers with features list handled as text
    const handleTierUpdate = (newItems: any[]) => {
        const processedItems = newItems.map((item: any) => ({
            ...item,
            features: typeof item.features === 'string' ? item.features.split('\n').filter((l: string) => l.trim() !== '') : item.features
        }));

        setData((prev: any) => ({
            ...prev,
            tiers: processedItems
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/sponsorship', {
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

    // Helper to join array for textarea
    const getFeaturesText = (features: string[]) => features.join('\n');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-charcoal">Sponsorship Page Manager</h1>
                    <p className="text-xs text-gray-500">Edit packages, benefits, and steps.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/sponsorship" target="_blank">
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
                    tabs={["Hero & Intro", "Tiers & Benefits", "Steps & Contact"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                            <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
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

                {activeTab === "Tiers & Benefits" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Why Sponsor?</h2>
                            <ListEditor
                                title="Benefits"
                                items={data.whySponsor || []}
                                onUpdate={(items) => handleListUpdate("whySponsor", items)}
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
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Sponsorship Tiers</h2>
                            <p className="text-sm text-gray-500 mb-4">Note: Enter features as one per line.</p>
                            <ListEditor
                                title="Packages"
                                items={data.tiers.map((t: any) => ({ ...t, features: Array.isArray(t.features) ? getFeaturesText(t.features) : t.features })) || []}
                                onUpdate={handleTierUpdate}
                                itemTemplate={{ name: "New Tier", price: "$5,000", subheading: "Description", features: "Feature 1\nFeature 2", buttonLabel: "Select", isHighlighted: false }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                            <AdminInput label="Price" value={item.price} onChange={(e) => update("price", e.target.value)} />
                                        </div>
                                        <AdminInput label="Subheading" value={item.subheading} onChange={(e) => update("subheading", e.target.value)} />
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Features (One per line)</label>
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm mt-1"
                                                rows={4}
                                                value={item.features}
                                                onChange={(e) => update("features", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <input type="checkbox" checked={item.isHighlighted} onChange={(e) => update("isHighlighted", e.target.checked)} />
                                            <label className="text-sm text-gray-700">Highlight this tier (Gold Border)</label>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Steps & Contact" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">How It Works Steps</h2>
                            <ListEditor
                                title="Steps"
                                items={data.howItWorks || []}
                                onUpdate={(items) => handleListUpdate("howItWorks", items)}
                                itemTemplate={{ step: "1", title: "Step Title", description: "" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Step Number" value={item.step} onChange={(e) => update("step", e.target.value)} />
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Contact Info</h2>
                            <AdminInput label="Title" value={data.contact.title} onChange={(e) => handleChange("contact", "title", e.target.value)} />
                            <AdminInput label="Text" value={data.contact.text} onChange={(e) => handleChange("contact", "text", e.target.value)} />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <AdminInput label="Email" value={data.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
                                <AdminInput label="Phone" value={data.contact.phone} onChange={(e) => handleChange("contact", "phone", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
