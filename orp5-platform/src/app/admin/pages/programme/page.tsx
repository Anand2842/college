"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FileUploader } from "@/components/admin/FileUploader";

export default function ProgrammePageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Overview");

    useEffect(() => {
        fetch("/api/content/programme")
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

    const handleScheduleUpdate = (day: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            schedule: { ...prev.schedule, [day]: newItems }
        }));
    };

    const handleDownloadsUpdate = (items: any[]) => {
        setData((prev: any) => ({
            ...prev,
            downloads: items
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/programme', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) alert("Programme Saved!");
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
                    <h1 className="text-xl font-bold text-charcoal">Programme Manager</h1>
                    <p className="text-xs text-gray-500">Edit schedule, field trip details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/programme" target="_blank">
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
                    tabs={["Hero & Overview", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Field Trip", "Downloads"]}
                />

                {activeTab === "Hero & Overview" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].includes(activeTab) && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">{activeTab} Schedule</h2>
                        <ListEditor
                            title="Sessions"
                            items={data.schedule[activeTab] || []}
                            onUpdate={(items) => handleScheduleUpdate(activeTab, items)}
                            itemTemplate={{ id: "", time: "09:00", title: "New Session", type: "Session", tags: [] }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput label="Time" value={item.time} onChange={(e) => update("time", e.target.value)} />
                                        <AdminInput label="Type" value={item.type} onChange={(e) => update("type", e.target.value)} />
                                    </div>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    {/* Tags could be improved with a tag input, simplified here */}
                                    <AdminInput label="Tags (comma separated)" value={item.tags?.join(", ") || ""} onChange={(e) => update("tags", e.target.value.split(",").map((s: string) => s.trim()))} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Field Trip" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Field Trip</h2>
                        <div className="grid gap-6">
                            <AdminInput label="Title" value={data.fieldTrip.title} onChange={(e) => handleChange("fieldTrip", "title", e.target.value)} />
                            <AdminInput label="Location" value={data.fieldTrip.location} onChange={(e) => handleChange("fieldTrip", "location", e.target.value)} />
                            <ImageUploader label="Field Trip Image" value={data.fieldTrip.imageUrl} onChange={(url) => handleChange("fieldTrip", "imageUrl", url)} />

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="font-bold text-gray-700 mb-4">Highlights / Features</h3>
                                <ListEditor
                                    title="Features"
                                    items={data.fieldTrip.features || []}
                                    onUpdate={(items) => handleChange("fieldTrip", "features", items)}
                                    itemTemplate={{ id: "", text: "New Feature" }}
                                    renderItemFields={(item, i, update) => (
                                        <AdminInput label="Feature Text" value={item.text} onChange={(e) => update("text", e.target.value)} />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Downloads" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Manage Downloads</h2>
                        <ListEditor
                            title="Downloadable Files"
                            items={data.downloads || []}
                            onUpdate={handleDownloadsUpdate}
                            itemTemplate={{ id: "", label: "New File", file: "", icon: "FileText" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Label" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                    <AdminInput label="Icon Name (Lucide)" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    <FileUploader label="Upload File" value={item.file} onChange={(url) => update("file", url)} accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
