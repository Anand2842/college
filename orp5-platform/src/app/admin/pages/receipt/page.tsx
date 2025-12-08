"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ListEditor } from "@/components/admin/ListEditor";

export default function ReceiptPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Banner");

    useEffect(() => {
        fetch("/api/content/receipt")
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

    const handleNotesUpdate = (newNotes: string[]) => {
        setData((prev: any) => ({
            ...prev,
            importantNotes: newNotes
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/receipt', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) alert("Receipt Page Saved!");
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
                    <h1 className="text-xl font-bold text-charcoal">Receipt Page Manager</h1>
                    <p className="text-xs text-gray-500">Edit content for the registration success page.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/registration/success" target="_blank">
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
                    tabs={["Hero & Banner", "Important Notes", "Help & Next Steps"]}
                />

                {activeTab === "Hero & Banner" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Title" value={data.hero.title} onChange={(e) => handleChange("hero", "title", e.target.value)} />
                                <AdminInput label="Message" value={data.hero.message} onChange={(e) => handleChange("hero", "message", e.target.value)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Success Banner</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Banner Title" value={data.successBanner.title} onChange={(e) => handleChange("successBanner", "title", e.target.value)} />
                                <AdminInput label="Banner Message" value={data.successBanner.message} onChange={(e) => handleChange("successBanner", "message", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Important Notes" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Important Notes</h2>
                        <ListEditor
                            title="Notes"
                            items={data.importantNotes.map((note: string, i: number) => ({ id: i.toString(), text: note }))}
                            onUpdate={(items) => handleNotesUpdate(items.map((i: any) => i.text))}
                            itemTemplate={{ id: "", text: "New Note" }}
                            renderItemFields={(item, i, update) => (
                                <AdminInput label="Note Text" value={item.text} onChange={(e) => update("text", e.target.value)} />
                            )}
                        />
                    </div>
                )}

                {activeTab === "Help & Next Steps" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Help Info</h2>
                        <div className="grid gap-6 mb-8">
                            <AdminInput label="Title" value={data.helpInfo.title} onChange={(e) => handleChange("helpInfo", "title", e.target.value)} />
                            <AdminInput label="Description" value={data.helpInfo.description} onChange={(e) => handleChange("helpInfo", "description", e.target.value)} />
                            <AdminInput label="Email" value={data.helpInfo.email} onChange={(e) => handleChange("helpInfo", "email", e.target.value)} />
                            <AdminInput label="Phone" value={data.helpInfo.phone} onChange={(e) => handleChange("helpInfo", "phone", e.target.value)} />
                        </div>

                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Footer Call-to-Action</h2>
                        <div className="grid gap-6">
                            <AdminInput label="Footer Title" value={data.nextSteps.title} onChange={(e) => handleChange("nextSteps", "title", e.target.value)} />
                            <AdminInput label="Footer Description" value={data.nextSteps.description} onChange={(e) => handleChange("nextSteps", "description", e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
