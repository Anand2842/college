"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SubmissionGuidelinesEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/submission-guidelines")
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

    const handleRootChange = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            [field]: value
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
            const res = await fetch('/api/content/submission-guidelines', {
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
                    <h1 className="text-xl font-bold text-charcoal">Guidelines Manager</h1>
                    <p className="text-xs text-gray-500">Edit guidelines, conduct policy, and contacts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/submission-guidelines" target="_blank">
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
                    tabs={["Hero & Intro", "Guidelines", "Policy & Contacts"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Hero Background" value={data.hero.imageUrl} onChange={(url) => handleChange("hero", "imageUrl", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Introduction</h2>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20"
                                rows={4}
                                value={data.intro}
                                onChange={(e) => handleRootChange("intro", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Guidelines" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Participation Guidelines</h2>
                        <ListEditor
                            title="Accordions"
                            items={data.guidelines || []}
                            onUpdate={(items) => handleListUpdate("guidelines", items)}
                            itemTemplate={{ id: "", title: "New Guideline", content: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 text-sm mt-2"
                                        rows={3}
                                        placeholder="Detailed content for this section..."
                                        value={item.content}
                                        onChange={(e) => update("content", e.target.value)}
                                    />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Policy & Contacts" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Code of Conduct</h2>
                            <AdminInput label="Title" value={data.codeOfConduct.title} onChange={(e) => handleChange("codeOfConduct", "title", e.target.value)} />
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 mt-4"
                                rows={4}
                                value={data.codeOfConduct.content}
                                onChange={(e) => handleChange("codeOfConduct", "content", e.target.value)}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Contacts</h2>
                            <ListEditor
                                title="Contact Cards"
                                items={data.contacts || []}
                                onUpdate={(items) => handleListUpdate("contacts", items)}
                                itemTemplate={{ id: "", label: "Support Team", email: "help@orp5.org", icon: "HelpCircle" }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Department Name" value={item.label} onChange={(e) => update("label", e.target.value)} />
                                        <AdminInput label="Email" value={item.email} onChange={(e) => update("email", e.target.value)} />
                                        <AdminInput label="Icon (Lucide)" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
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
