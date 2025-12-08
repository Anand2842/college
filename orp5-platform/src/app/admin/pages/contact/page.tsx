"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function ContactEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Intro");

    useEffect(() => {
        fetch("/api/content/contact")
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

    // For nested address/hours
    const handleVenueChange = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            venueInfo: { ...prev.venueInfo, [field]: value }
        }));
    };

    const handleAddressUpdate = (val: string) => {
        const address = val.split('\n').filter(s => s.trim() !== "");
        setData((prev: any) => ({
            ...prev,
            venueInfo: { ...prev.venueInfo, address }
        }));
    };

    const handleListUpdate = (key: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [key]: newItems
        }));
    };

    // Helper for string array emails
    const handleEmailsUpdate = (index: number, newEmails: string) => {
        const updatedDepts = [...data.departments];
        updatedDepts[index].emails = newEmails.split('\n').filter(s => s.trim() !== "");
        setData((prev: any) => ({ ...prev, departments: updatedDepts }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/contact', {
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
                title="Contact Page Editor"
                subtitle="Manage content for /contact"
                onSave={handleSave}
                saving={saving}
                viewLink="/contact"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Intro", "Departments", "Committee", "Logistics & CTA"]}
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

                {activeTab === "Departments" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Main Departments</h2>
                            <ListEditor
                                title="Departments"
                                items={data.departments || []}
                                onUpdate={(items) => handleListUpdate("departments", items)}
                                itemTemplate={{ id: "", title: "New Dept", description: "", emails: [] }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        <div className="mt-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Emails (Newline separated)</label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm h-24"
                                                value={Array.isArray(item.emails) ? item.emails.join('\n') : item.emails}
                                                onChange={(e) => handleEmailsUpdate(i, e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Additional Contacts (Row)</h2>
                            <ListEditor
                                title="Contacts"
                                items={data.additionalContacts || []}
                                onUpdate={(items) => handleListUpdate("additionalContacts", items)}
                                itemTemplate={{ id: "", title: "New Contact", email: "", icon: "Mail" }}
                                renderItemFields={(item, i, update) => (
                                    <div className="grid grid-cols-3 gap-4">
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Email" value={item.email} onChange={(e) => update("email", e.target.value)} />
                                        <AdminInput label="Icon" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Committee" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Organizing Committee</h2>
                        <ListEditor
                            title="Members"
                            items={data.committee || []}
                            onUpdate={(items) => handleListUpdate("committee", items)}
                            itemTemplate={{ id: "", name: "New Member", role: "Organizer", email: "" }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-3 gap-4">
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Role" value={item.role} onChange={(e) => update("role", e.target.value)} />
                                    <AdminInput label="Email" value={item.email} onChange={(e) => update("email", e.target.value)} />
                                </div>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Logistics & CTA" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Venue Information</h2>
                            <AdminInput label="Title" value={data.venueInfo.title} onChange={(e) => handleVenueChange("title", e.target.value)} />
                            <div className="mt-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Address (Newline separated)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm h-24"
                                    value={data.venueInfo.address.join('\n')}
                                    onChange={(e) => handleAddressUpdate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Footer CTA</h2>
                            <AdminInput label="Headline" value={data.footerCta.headline} onChange={(e) => handleChange("footerCta", "headline", e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
