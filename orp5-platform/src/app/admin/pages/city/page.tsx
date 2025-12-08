"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";

export default function CityPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/city")
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

    // For nested fields like travelInfo.times
    const handleTravelTimesUpdate = (newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            travelInfo: { ...prev.travelInfo, times: newItems }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/city', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("City Page Saved!");
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
                title="About City Editor"
                subtitle="Manage content for /about/city"
                onSave={handleSave}
                saving={saving}
                viewLink="/about/city"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Intro", "Highlights & About", "Nearby Places", "Travel Info"]}
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
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Introduction Card</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <AdminInput label="Description" value={data.intro.description} onChange={(e) => handleChange("intro", "description", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Highlights & About" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">City Highlights</h2>
                            <ListEditor
                                title="Highlights"
                                items={data.highlights || []}
                                onUpdate={(items) => handleListUpdate("highlights", items)}
                                itemTemplate={{ id: "", title: "New Highlight", description: "", iconName: "Star" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        <AdminInput label="Icon Name" value={item.iconName} onChange={(e) => update("iconName", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">About Grid Content</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Location Text" value={data.about.location} onChange={(e) => handleChange("about", "location", e.target.value)} />
                                <AdminInput label="Weather Text" value={data.about.weather} onChange={(e) => handleChange("about", "weather", e.target.value)} />
                                <AdminInput label="Connectivity Text" value={data.about.connectivity} onChange={(e) => handleChange("about", "connectivity", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Nearby Places" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Must-Visit Places</h2>
                        <ListEditor
                            title="Places"
                            items={data.nearbyPlaces || []}
                            onUpdate={(items) => handleListUpdate("nearbyPlaces", items)}
                            itemTemplate={{ id: "", title: "New Place", description: "", imageUrl: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    <div className="mt-2">
                                        <ImageUploader label="Place Image" value={item.imageUrl} onChange={(url) => update("imageUrl", url)} />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Travel Info" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Map Image</h2>
                            <ImageUploader label="Map Image URL" value={data.travelInfo.mapImage} onChange={(url) => setData((prev: any) => ({ ...prev, travelInfo: { ...prev.travelInfo, mapImage: url } }))} />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Travel Times</h2>
                            <ListEditor
                                title="Travel Routes"
                                items={data.travelInfo.times || []}
                                onUpdate={handleTravelTimesUpdate}
                                itemTemplate={{ label: "New Route", time: "60 mins", icon: "Car" }}
                                renderItemFields={(item, i, update) => (
                                    <div className="grid grid-cols-3 gap-4">
                                        <AdminInput label="Route Label" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                        <AdminInput label="Time" value={item.time} onChange={(e) => update("time", e.target.value)} />
                                        <AdminInput label="Icon" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
