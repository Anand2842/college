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
                                    placeholder="5th International Conference on"
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
                                label="Registration Start Date (Optional)"
                                helperText="YYYY-MM-DD format (e.g. 2026-06-01). Leave empty to HIDE the countdown."
                                value={data.hero.registrationStart || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("hero", "registrationStart", e.target.value)}
                            />

                            <AdminInput
                                label="Timer Label (Optional)"
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
                {activeTab === "Partners" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Collaborating Partners</h2>
                        <ListEditor
                            title="Partners"
                            items={data.partners || []}
                            onUpdate={(items) => handleListUpdate("partners", items)}
                            itemTemplate={{ id: "", name: "New Partner", logoUrl: "" }}
                            renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                                <div className="col-span-1 md:col-span-2 grid gap-4">
                                    <AdminInput label="Partner Name" value={item.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("name", e.target.value)} />
                                    <ImageUploader label="Logo URL" value={item.logoUrl} onChange={(url) => update("logoUrl", url)} />
                                </div>
                            )}
                        />
                    </div>
                )}

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
