"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function HowToReachEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Summary");

    useEffect(() => {
        fetch("/api/content/how-to-reach")
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
            const res = await fetch('/api/content/how-to-reach', {
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
                title="How to Reach Editor"
                subtitle="Manage content for /how-to-reach"
                onSave={handleSave}
                saving={saving}
                viewLink="/how-to-reach"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Summary", "Transport Modes", "Map & Logistics"]}
                />

                {activeTab === "Hero & Summary" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <AdminInput label="Button Label" value={data.hero.buttonLabel} onChange={(e) => handleChange("hero", "buttonLabel", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Quick Summary Card</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Venue Text" value={data.quickSummary.venue} onChange={(e) => handleChange("quickSummary", "venue", e.target.value)} />
                                <AdminInput label="Dates" value={data.quickSummary.dates} onChange={(e) => handleChange("quickSummary", "dates", e.target.value)} />
                                <AdminInput label="Emergency Contact" value={data.quickSummary.emergencyContact} onChange={(e) => handleChange("quickSummary", "emergencyContact", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Transport Modes" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Transport Modes</h2>
                        <ListEditor
                            title="Modes"
                            items={data.transportModes || []}
                            onUpdate={(items) => handleListUpdate("transportModes", items)}
                            itemTemplate={{ id: "", mode: "New Mode", description: "", travelTime: "", icon: "Car" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Mode Name" value={item.mode} onChange={(e) => update("mode", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <AdminInput label="Travel Time Estimate" value={item.travelTime} onChange={(e) => update("travelTime", e.target.value)} />
                                        <AdminInput label="Icon Name" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Map & Logistics" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Map Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.maps.title} onChange={(e) => handleChange("maps", "title", e.target.value)} />
                                <AdminInput label="Description" value={data.maps.description} onChange={(e) => handleChange("maps", "description", e.target.value)} />
                                <AdminInput label="Maps Link" value={data.maps.directionsLink} onChange={(e) => handleChange("maps", "directionsLink", e.target.value)} />
                                <ImageUploader label="Map Image" value={data.maps.mapImage} onChange={(url) => handleChange("maps", "mapImage", url)} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Logistics List</h2>
                            <ListEditor
                                title="Info Items"
                                items={data.logistics || []}
                                onUpdate={(items) => handleListUpdate("logistics", items)}
                                itemTemplate={{ id: "", title: "New Item", content: "" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Content" value={item.content} onChange={(e) => update("content", e.target.value)} />
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
