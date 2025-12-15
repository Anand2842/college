"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Save, Loader2, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function RegistrationPageEditor() {
    const [data, setData] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Page Content");

    useEffect(() => {
        // Load Page Content
        fetch("/api/content/registration")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            });

        // Load Registrations
        fetch("/api/register")
            .then((res) => res.json())
            .then((regData) => {
                if (Array.isArray(regData)) setRegistrations(regData);
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
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/registration', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Registration Page Saved!");
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
                    <h1 className="text-xl font-bold text-charcoal">Registration Manager</h1>
                    <p className="text-xs text-gray-500">Edit content & view submissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/registration" target="_blank">
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
                    tabs={["Page Content", "Categories", "Target Audience", "Submissions"]}
                />

                {activeTab === "Page Content" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                        <div className="grid gap-6">
                            <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                            <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                            <AdminInput label="Status Text" value={data.hero.statusText} onChange={(e) => handleChange("hero", "statusText", e.target.value)} />
                        </div>
                    </div>
                )}

                {activeTab === "Categories" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Delegate Categories</h2>
                        <ListEditor
                            title="Registration Types"
                            items={data.categories || []}
                            onUpdate={(items) => handleListUpdate("categories", items)}
                            itemTemplate={{ id: "", title: "New Category", price: "Price: TBD", description: "", iconName: "Star" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                    <AdminInput label="Price Label" value={item.price} onChange={(e) => update("price", e.target.value)} />
                                    <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                    <AdminInput label="Icon Name" value={item.iconName} onChange={(e) => update("iconName", e.target.value)} />
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Target Audience" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Who Can Participate</h2>

                        <div className="mb-8">
                            <AdminInput
                                label="Section Title"
                                value={data.whoCanParticipate?.title || ""}
                                onChange={(e) => handleChange("whoCanParticipate", "title", e.target.value)}
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-earth-green mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sapling-green/50 transition-all text-sm h-24"
                                    value={data.whoCanParticipate?.description || ""}
                                    onChange={(e) => handleChange("whoCanParticipate", "description", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-700">Stakeholder List</h3>
                                <Button
                                    onClick={() => handleListUpdate("whoCanParticipate", { ...data.whoCanParticipate, items: [...(data.whoCanParticipate?.items || []), ""] }.items)}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                >
                                    <Plus size={14} className="mr-1" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {(data.whoCanParticipate?.items || []).map((item: string, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sapling-green/50 transition-all text-sm"
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...(data.whoCanParticipate?.items || [])];
                                                newItems[index] = e.target.value;
                                                handleChange("whoCanParticipate", "items", newItems as any);
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const newItems = [...(data.whoCanParticipate?.items || [])];
                                                newItems.splice(index, 1);
                                                handleChange("whoCanParticipate", "items", newItems as any);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Submissions" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Registered Delegates ({registrations.length})</h2>

                        {registrations.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No registrations yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Timestamp</th>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Country</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.map((reg, idx) => (
                                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{new Date(reg.submittedAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900">{reg.fullName}</td>
                                                <td className="px-6 py-4">{reg.category}</td>
                                                <td className="px-6 py-4">{reg.email}</td>
                                                <td className="px-6 py-4">{reg.country}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
