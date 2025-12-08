"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FileUploader } from "@/components/admin/FileUploader";

export default function ImportantDatesEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/important-dates")
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

    const handleNestedListUpdate = (section: string, items: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], items: items }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/important-dates', {
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
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-charcoal">Important Dates Manager</h1>
                    <p className="text-xs text-gray-500">Edit timeline, deadlines, and daily schedule.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/important-dates" target="_blank">
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
                    tabs={["Hero & Intro", "Timeline", "Daily Breakdown", "Deadlines", "Downloads"]}
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
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Intro Card</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <AdminInput label="Description" value={data.intro.description} onChange={(e) => handleChange("intro", "description", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Timeline" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Master Timeline</h2>
                        <ListEditor
                            title="Milestones"
                            items={data.timeline || []}
                            onUpdate={(items) => handleListUpdate("timeline", items)}
                            itemTemplate={{ number: "1", date: "Jan 1, 2026", title: "New Milestone" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput label="Number" value={item.number} onChange={(e) => update("number", e.target.value)} />
                                        <AdminInput label="Date" value={item.date} onChange={(e) => update("date", e.target.value)} />
                                    </div>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Daily Breakdown" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Daily Breakdown</h2>
                        <ListEditor
                            title="Days"
                            items={data.dailyBreakdown || []}
                            onUpdate={(items) => handleListUpdate("dailyBreakdown", items)}
                            itemTemplate={{ day: "Day X: Date", title: "New Day", description: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Day Label" value={item.day} onChange={(e) => update("day", e.target.value)} />
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Deadlines" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Presenter Deadlines */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Presenter Deadlines</h2>
                            <div className="grid gap-6 mb-6">
                                <AdminInput label="Title" value={data.presenterDeadlines.title} onChange={(e) => handleChange("presenterDeadlines", "title", e.target.value)} />
                                <AdminInput label="Intro" value={data.presenterDeadlines.intro} onChange={(e) => handleChange("presenterDeadlines", "intro", e.target.value)} />
                            </div>
                            <ListEditor
                                title="Deadlines List"
                                items={data.presenterDeadlines.items || []}
                                onUpdate={(items) => handleNestedListUpdate("presenterDeadlines", items)}
                                itemTemplate={{ id: "", text: "**Bold**: Description" }}
                                renderItemFields={(item, i, update) => (
                                    <AdminInput label="Text (use **bold**)" value={item.text} onChange={(e) => update("text", e.target.value)} />
                                )}
                            />
                        </div>

                        {/* Exhibitor Deadlines */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Exhibitor Deadlines</h2>
                            <div className="grid gap-6 mb-6">
                                <AdminInput label="Title" value={data.exhibitorDeadlines.title} onChange={(e) => handleChange("exhibitorDeadlines", "title", e.target.value)} />
                                <AdminInput label="Intro" value={data.exhibitorDeadlines.intro} onChange={(e) => handleChange("exhibitorDeadlines", "intro", e.target.value)} />
                            </div>
                            <ListEditor
                                title="Deadlines List"
                                items={data.exhibitorDeadlines.items || []}
                                onUpdate={(items) => handleNestedListUpdate("exhibitorDeadlines", items)}
                                itemTemplate={{ id: "", text: "**Bold**: Description" }}
                                renderItemFields={(item, i, update) => (
                                    <AdminInput label="Text (use **bold**)" value={item.text} onChange={(e) => update("text", e.target.value)} />
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Downloads" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Downloads</h2>
                        <ListEditor
                            title="Files"
                            items={data.downloads || []}
                            onUpdate={(items) => handleListUpdate("downloads", items)}
                            itemTemplate={{ id: "", label: "File Name", sublabel: "PDF", icon: "FileText", file: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput label="Label" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                        <AdminInput label="Sub-label/Action" value={item.sublabel} onChange={(e) => update("sublabel", e.target.value)} />
                                    </div>
                                    <AdminInput label="Icon (Lucide)" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    <FileUploader label="Upload File" value={item.file} onChange={(url) => update("file", url)} accept=".pdf,.doc,.docx,image/*" />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
