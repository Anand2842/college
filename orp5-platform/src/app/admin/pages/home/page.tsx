"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HomepageEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & General");

    // Smart Input State for Headline
    const [headlineParts, setHeadlineParts] = useState({ pre: "", highlight: "", post: "" });

    useEffect(() => {
        fetch("/api/content/homepage")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);

                // Parse Headline for Smart Inputs
                // Expected format: "Pre <br /> <span class='text-rice-gold'>Highlight</span> <br /> Post"
                const headline = jsonData.hero.headline || "";
                // This regex handles both <br /> and <br/> and splits correctly
                const parts = headline.replace(/<br\s*\/>/g, "").split(/<span class=['"]text-rice-gold['"]>|<\/span>/);

                if (parts.length >= 3) {
                    setHeadlineParts({
                        pre: parts[0]?.trim() || "",
                        highlight: parts[1]?.trim() || "",
                        post: parts[2]?.trim() || ""
                    });
                } else {
                    // Fallback if format doesn't match
                    setHeadlineParts({ pre: headline, highlight: "", post: "" });
                }

                setLoading(false);
            });
    }, []);

    // Sync Headline Parts to Data
    useEffect(() => {
        if (!data) return;
        const newHeadline = `${headlineParts.pre} <br /> <span class='text-rice-gold'>${headlineParts.highlight}</span> <br /> ${headlineParts.post}`;

        // key check to avoid infinite loop or unnecessary updates if valid
        if (data.hero.headline !== newHeadline) {
            setData((prev: any) => ({
                ...prev,
                hero: { ...prev.hero, headline: newHeadline }
            }));
        }
    }, [headlineParts, data]); // Added data to dependency array to ensure it runs when data is first loaded

    const handleChange = (section: string, field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleListUpdate = (sectionKey: string, newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            [sectionKey]: newItems
        }));
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/homepage', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Changes Saved Successfully!");
            else alert("Failed to save changes.");
        } catch (e) {
            console.error(e);
            alert("Error saving changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-charcoal">Homepage Editor</h1>
                        <p className="text-xs text-gray-500">Edit the content of the main landing page.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" target="_blank">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <ExternalLink size={16} className="mr-2" /> View Site
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
                    tabs={["Hero & General", "Partners", "Themes", "Programme Snapshot", "Important Dates", "Why Join & Venue", "Gallery", "FAQ"]}
                />

                {/* Hero Tab */}
                {activeTab === "Hero & General" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="md:col-span-3 mb-2">
                                    <label className="block text-sm font-bold text-earth-green">Main Headline Structure</label>
                                    <p className="text-xs text-gray-500">The headline is split into three parts. The middle part appears in Gold.</p>
                                </div>
                                <AdminInput
                                    label="Top Text"
                                    value={headlineParts.pre}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeadlineParts(p => ({ ...p, pre: e.target.value }))}
                                    placeholder="5ᵗʰ International Conference on..."
                                />
                                <AdminInput
                                    label="Highlighted Text (Gold)"
                                    value={headlineParts.highlight}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeadlineParts(p => ({ ...p, highlight: e.target.value }))}
                                    placeholder="Organic and Natural Rice"
                                />
                                <AdminInput
                                    label="Bottom Text"
                                    value={headlineParts.post}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeadlineParts(p => ({ ...p, post: e.target.value }))}
                                    placeholder="Production Systems"
                                />
                            </div>

                            <AdminInput
                                label="Subheadline"
                                helperText="This text appears below the main headline."
                                value={data.hero.subheadline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "subheadline", e.target.value)}
                            />

                            <AdminInput
                                label="Conference Date Display"
                                helperText="The date string displayed in the hero section (e.g. 21–25 September 2026)"
                                value={data.hero.dateString || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "dateString", e.target.value)}
                            />

                            <AdminInput
                                label="Registration Banner Text"
                                helperText="The large heading in the green registration section (bottom of page)"
                                value={data.hero.registrationBannerText || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "registrationBannerText", e.target.value)}
                            />

                            <AdminInput
                                label="Registration Start Date (Optional)"
                                helperText="YYYY-MM-DD format (e.g. 2026-06-01). Leave empty to HIDE the countdown."
                                value={data.hero.registrationStart || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "registrationStart", e.target.value)}
                            />

                            <AdminInput
                                label="Registration Counter Label (Optional)"
                                helperText="Custom text above the timer (default: 'Registration Opens In')"
                                value={data.hero.registrationStatusText || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "registrationStatusText", e.target.value)}
                            />

                            <div>
                                <ImageUploader
                                    label="Hero Background Image"
                                    value={data.hero.backgroundImage}
                                    onChange={(url) => handleChange("hero", "backgroundImage", url)}
                                />
                            </div>
                        </div>
                    </div>
                )}


                {/* Partners Tab */}
                {activeTab === "Partners" && (() => {
                    const TIERS = [
                        { key: "Jointly organised by", label: "Jointly organised by", description: "Primary organising institutions (shown largest, at the top)", color: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-800" },
                        { key: "Supported by", label: "Supported by", description: "Government bodies & major supporters (shown in the middle)", color: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-800" },
                        { key: "In collaboration with", label: "In collaboration with", description: "Academic institutions, publishers & industry partners (shown at the bottom)", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800" },
                    ];

                    const partnersByTier = TIERS.reduce((acc: Record<string, any[]>, tier) => {
                        acc[tier.key] = (data.partners || []).filter((p: any) => p.category === tier.key);
                        return acc;
                    }, {});

                    const updateTierPartners = (tierKey: string, newItems: any[]) => {
                        // Stamp the correct category on each item
                        const stamped = newItems.map(p => ({ ...p, category: tierKey }));
                        // Merge with partners from other tiers
                        const otherPartners = (data.partners || []).filter((p: any) => p.category !== tierKey);
                        handleListUpdate("partners", [...otherPartners, ...stamped]);
                    };

                    const addPartner = (tierKey: string) => {
                        const newPartner = { id: crypto.randomUUID(), name: "New Organisation", logoUrl: "", website: "", category: tierKey };
                        const updated = [...(data.partners || []), newPartner];
                        handleListUpdate("partners", updated);
                    };

                    const removePartner = (id: string) => {
                        handleListUpdate("partners", (data.partners || []).filter((p: any) => p.id !== id));
                    };

                    const updatePartner = (id: string, field: string, value: string) => {
                        handleListUpdate("partners", (data.partners || []).map((p: any) =>
                            p.id === id ? { ...p, [field]: value } : p
                        ));
                    };

                    const movePartner = (id: string, direction: "up" | "down") => {
                        const currentPartners = [...(data.partners || [])];
                        const index = currentPartners.findIndex(p => p.id === id);
                        if (index === -1) return;
                        
                        const category = currentPartners[index].category;
                        let swapIndex = -1;
                        
                        if (direction === "up") {
                            for (let i = index - 1; i >= 0; i--) {
                                if (currentPartners[i].category === category) {
                                    swapIndex = i;
                                    break;
                                }
                            }
                        } else {
                            for (let i = index + 1; i < currentPartners.length; i++) {
                                if (currentPartners[i].category === category) {
                                    swapIndex = i;
                                    break;
                                }
                            }
                        }

                        if (swapIndex !== -1) {
                            const temp = currentPartners[index];
                            currentPartners[index] = currentPartners[swapIndex];
                            currentPartners[swapIndex] = temp;
                            handleListUpdate("partners", currentPartners);
                        }
                    };

                    return (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-earth-green">Organisers & Partners</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage logos for each tier of the hierarchy shown at the top of the homepage.</p>
                            </div>

                            {TIERS.map((tier) => {
                                const partners = partnersByTier[tier.key];
                                return (
                                    <div key={tier.key} className={`rounded-xl border-2 ${tier.color} overflow-hidden`}>
                                        {/* Tier Header */}
                                        <div className="px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tier.badge}`}>{partners.length} {partners.length === 1 ? 'org' : 'orgs'}</span>
                                                    <h3 className="font-bold text-charcoal text-lg">{tier.label}</h3>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5 ml-14">{tier.description}</p>
                                            </div>
                                            <button
                                                onClick={() => addPartner(tier.key)}
                                                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-earth-green hover:text-earth-green text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                                            >
                                                + Add
                                            </button>
                                        </div>

                                        {/* Partner Cards */}
                                        {partners.length === 0 ? (
                                            <div className="bg-white/60 mx-4 mb-4 rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
                                                No organisations added yet. Click "+ Add" to add one.
                                            </div>
                                        ) : (
                                            <div className="px-4 pb-4 grid grid-cols-1 gap-3">
                                                {partners.map((partner: any, idx: number) => (
                                                    <div key={partner.id} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-start">
                                                        {/* Logo Preview */}
                                                        <div className="w-20 h-16 shrink-0 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                            {partner.logoUrl
                                                                ? <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                                                                : <span className="text-[10px] text-gray-400 text-center px-1">No Logo</span>
                                                            }
                                                        </div>

                                                        {/* Fields */}
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-bold text-earth-green mb-1">Organisation Name</label>
                                                                <input
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-earth-green"
                                                                    value={partner.name}
                                                                    onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                                                                    placeholder="e.g., Ministry of Agriculture"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-earth-green mb-1">Website URL</label>
                                                                <input
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-earth-green"
                                                                    value={partner.website || ""}
                                                                    onChange={(e) => updatePartner(partner.id, "website", e.target.value)}
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <ImageUploader
                                                                    label="Logo"
                                                                    value={partner.logoUrl}
                                                                    onChange={(url) => updatePartner(partner.id, "logoUrl", url)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-col gap-2 shrink-0">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => movePartner(partner.id, "up")}
                                                                    disabled={idx === 0}
                                                                    className="p-1 text-gray-400 hover:text-earth-green hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                                                    title="Move Up"
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    onClick={() => movePartner(partner.id, "down")}
                                                                    disabled={idx === partners.length - 1}
                                                                    className="p-1 text-gray-400 hover:text-earth-green hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                                                    title="Move Down"
                                                                >
                                                                    ↓
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removePartner(partner.id)}
                                                                className="text-red-400 hover:text-red-600 text-xs font-semibold mt-1 transition-colors text-right"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}



                {/* Themes Tab */}
                {activeTab === "Themes" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Conference Themes</h2>
                            <ListEditor
                                title="Themes"
                                items={data.themes || []}
                                onUpdate={(items) => handleListUpdate("themes", items)}
                                itemTemplate={{ id: "", title: "New Theme", description: "", iconName: "Sprout", colorTheme: "green" }}
                                renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("title", e.target.value)} />
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-earth-green mb-1">Color Theme</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                value={item.colorTheme}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update("colorTheme", e.target.value)}
                                            >
                                                <option value="green">Green (Earth)</option>
                                                <option value="mint">Mint (Sapling)</option>
                                                <option value="gold">Gold (Rice)</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <AdminInput label="Description" value={item.description} onChange={(e) => update("description", e.target.value)} />
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Programme Snapshot Tab */}
                {activeTab === "Programme Snapshot" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Programme Snapshot</h2>
                            <p className="text-sm text-gray-500 mb-6">Edit the daily highlights displayed on the homepage.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['day1', 'day2', 'day3', 'day4', 'day5'].map((dayKey, index) => {
                                    const dayData = data.programme?.[dayKey] || { date: "", activities: [] };
                                    return (
                                        <div key={dayKey} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <h3 className="font-bold text-earth-green mb-3">Day {index + 1}</h3>
                                            <AdminInput
                                                label="Date (e.g., 7 September 2026)"
                                                value={dayData.date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("programme", dayKey, { ...dayData, date: e.target.value })}
                                            />

                                            <label className="block text-sm font-bold text-earth-green mt-4 mb-2">Activities (one per line)</label>
                                            <textarea
                                                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                value={Array.isArray(dayData.activities) ? dayData.activities.join('\n') : dayData.activities}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n');
                                                    handleChange("programme", dayKey, { ...dayData, activities: lines });
                                                }}
                                                placeholder="Opening Ceremony&#10;Keynote Speeches"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Important Dates Tab */}
                {activeTab === "Important Dates" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Timeline & Deadlines</h2>
                            <ListEditor
                                title="Important Dates"
                                items={data.dates || []}
                                onUpdate={(items) => handleListUpdate("dates", items)}
                                itemTemplate={{ date: "1 Jan 2026", label: "New Milestone", status: "upcoming" }}
                                renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                    <>
                                        <AdminInput label="Date (String)" value={item.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("date", e.target.value)} />
                                        <AdminInput label="Milestone Label" value={item.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("label", e.target.value)} />
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-earth-green mb-1">Status</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                value={item.status}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update("status", e.target.value)}
                                            >
                                                <option value="completed">Completed (Gray/Crossed)</option>
                                                <option value="active">Active (Highlighted)</option>
                                                <option value="upcoming">Upcoming (Outline)</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Why Join & Venue */}
                {activeTab === "Why Join & Venue" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Why Join Editor */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Why Join Reasons</h2>
                            <ListEditor
                                title="Reasons"
                                items={data.whyJoin || []}
                                onUpdate={(items) => handleListUpdate("whyJoin", items)}
                                itemTemplate={{ title: "New Reason", desc: "", iconName: "Star" }}
                                renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("title", e.target.value)} />
                                        <AdminInput label="Description" value={item.desc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("desc", e.target.value)} />
                                    </>
                                )}
                            />
                        </div>

                        {/* Venue Editor */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Venue Details</h2>
                            <div className="grid gap-6">
                                <AdminInput
                                    label="Venue Title"
                                    value={data.venue?.title || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("venue", "title", e.target.value)}
                                />
                                <AdminInput
                                    label="Venue Description"
                                    value={data.venue?.description || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("venue", "description", e.target.value)}
                                />
                                <AdminInput
                                    label="Address"
                                    value={data.venue?.address || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("venue", "address", e.target.value)}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                                    <ImageUploader
                                        label="Venue Image 1 (Left)"
                                        value={data.venue?.image1 || ""}
                                        onChange={(url) => handleChange("venue", "image1", url)}
                                    />
                                    <ImageUploader
                                        label="Venue Image 2 (Right)"
                                        value={data.venue?.image2 || ""}
                                        onChange={(url) => handleChange("venue", "image2", url)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Tab */}
                {activeTab === "Gallery" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Gallery Preview</h2>
                        <ListEditor
                            title="Images"
                            items={data.gallery || []}
                            onUpdate={(items) => handleListUpdate("gallery", items)}
                            itemTemplate={{ url: "" }}
                            renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                <div className="col-span-2">
                                    <ImageUploader label="Image URL" value={item.url} onChange={(url) => update("url", url)} />
                                </div>
                            )}
                        />
                    </div>
                )}

                {/* FAQ Tab */}
                {activeTab === "FAQ" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Frequently Asked Questions</h2>
                        <ListEditor
                            title="Questions"
                            items={data.faq || []}
                            onUpdate={(items) => handleListUpdate("faq", items)}
                            itemTemplate={{ question: "New Question", answer: "Answer here." }}
                            renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                <div className="col-span-2">
                                    <AdminInput label="Question" value={item.question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("question", e.target.value)} />
                                    <label className="block text-sm font-bold text-earth-green mb-1 mt-2">Answer</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
                                        value={item.answer}
                                        onChange={(e) => update("answer", e.target.value)}
                                    />
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
