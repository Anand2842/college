"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function CommitteesPageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");
    const [activeCommitteeTab, setActiveCommitteeTab] = useState("International Scientific Committee");

    useEffect(() => {
        fetch("/api/content/committees")
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

    const handleCommitteeMemberUpdate = (committeeIndex: number, newMembers: any[]) => {
        const newCommittees = [...data.committees];
        newCommittees[committeeIndex].members = newMembers;
        setData({ ...data, committees: newCommittees });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/committees', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Committees Page Saved!");
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
                    <h1 className="text-xl font-bold text-charcoal">Committees Manager</h1>
                    <p className="text-xs text-gray-500">Manage structure & members.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/committees" target="_blank">
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
                    tabs={["Hero & Intro", "Committees", "Contacts"]}
                />

                {activeTab === "Hero & Intro" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Introduction & Advisory</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Intro Title" value={data.intro.title} onChange={(e) => handleChange("intro", "title", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Intro Description</label>
                                    <textarea
                                        value={data.intro.description}
                                        onChange={(e) => handleChange("intro", "description", e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-24"
                                    />
                                </div>
                                <div className="h-px bg-gray-200 my-4"></div>
                                <AdminInput label="Advisory Title" value={data.advisory.title} onChange={(e) => handleChange("advisory", "title", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Advisory Description</label>
                                    <textarea
                                        value={data.advisory.description}
                                        onChange={(e) => handleChange("advisory", "description", e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none h-24"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Committees" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex overflow-x-auto gap-2 mb-8 border-b pb-2">
                            {data.committees.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveCommitteeTab(c.label)}
                                    className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors rounded-t-lg ${activeCommitteeTab === c.label ? "text-earth-green border-b-2 border-earth-green bg-green-50" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        {data.committees.map((c: any, index: number) => {
                            if (c.label !== activeCommitteeTab) return null;
                            return (
                                <ListEditor
                                    key={c.id}
                                    title={`${c.label} Members`}
                                    items={c.members || []}
                                    onUpdate={(items) => handleCommitteeMemberUpdate(index, items)}
                                    itemTemplate={{ id: "", name: "New Member", affiliation: "", country: "", imageUrl: "https://placehold.co/150" }}
                                    renderItemFields={(item, i, update) => (
                                        <>
                                            <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                            <AdminInput label="Affiliation" value={item.affiliation} onChange={(e) => update("affiliation", e.target.value)} />
                                            <AdminInput label="Country/Role" value={item.country} onChange={(e) => update("country", e.target.value)} />
                                            <ImageUploader label="Profile Image" value={item.imageUrl} onChange={(url) => update("imageUrl", url)} />
                                        </>
                                    )}
                                />
                            )
                        })}
                    </div>
                )}

                {activeTab === "Contacts" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Committee Contacts</h2>
                        <ListEditor
                            title="Contact Persons"
                            items={data.contacts || []}
                            onUpdate={(items) => handleListUpdate("contacts", items)}
                            itemTemplate={{ id: "", name: "New Contact", email: "", imageUrl: "https://placehold.co/150" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Email" value={item.email} onChange={(e) => update("email", e.target.value)} />
                                    <ImageUploader label="Profile Image" value={item.imageUrl} onChange={(url) => update("imageUrl", url)} />
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
