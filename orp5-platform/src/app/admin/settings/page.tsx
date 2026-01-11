"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ListEditor } from "@/components/admin/ListEditor";

export default function GlobalSettingsEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/content/global-settings")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Fallback structure if API fails or empty
                setData({
                    footer: {
                        aboutText: "",
                        contact: { address: "", email: "", phone: "" },
                        socials: [],
                        copyrightText: ""
                    }
                });
                setLoading(false);
            });
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        // Handle deep nesting for footer.contact
        if (section === 'footer.contact') {
            setData((prev: any) => ({
                ...prev,
                footer: {
                    ...prev.footer,
                    contact: { ...prev.footer.contact, [field]: value }
                }
            }));
            return;
        }

        // Handle generic footer fields
        if (section === 'footer') {
            setData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, [field]: value }
            }));
            return;
        }
    };

    const handleSocialsUpdate = (newItems: any[]) => {
        setData((prev: any) => ({
            ...prev,
            footer: {
                ...prev.footer,
                socials: newItems
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/global-settings', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) alert("Settings Saved Successfully!");
            else alert("Failed to save settings.");
        } catch (e) {
            console.error(e);
            alert("Error saving settings.");
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
                        <h1 className="text-xl font-bold text-charcoal">Global Settings & Footer</h1>
                        <p className="text-xs text-gray-500">Edit sitewide information and footer content.</p>
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

            <div className="container mx-auto max-w-4xl mt-8 px-6 space-y-8">

                {/* Footer Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Footer Information</h2>

                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-earth-green mb-1">About Text (Left Column)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
                                    value={data.footer?.aboutText || ""}
                                    onChange={(e) => handleChange("footer", "aboutText", e.target.value)}
                                    placeholder="Brief description of the conference..."
                                />
                                <p className="text-xs text-gray-400 mt-1">Use &lt;br /&gt; for line breaks.</p>
                            </div>

                            <AdminInput
                                label="Address"
                                value={data.footer?.contact?.address || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("footer.contact", "address", e.target.value)}
                            />
                            <AdminInput
                                label="Phone Number"
                                value={data.footer?.contact?.phone || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("footer.contact", "phone", e.target.value)}
                            />
                            <AdminInput
                                label="Email Address"
                                value={data.footer?.contact?.email || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("footer.contact", "email", e.target.value)}
                            />
                            <AdminInput
                                label="Copyright Text"
                                value={data.footer?.copyrightText || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("footer", "copyrightText", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Social Media Links</h2>
                    <ListEditor
                        title="Links"
                        items={data.footer?.socials || []}
                        onUpdate={handleSocialsUpdate}
                        itemTemplate={{ platform: "New Platform", url: "#", iconName: "Globe" }}
                        renderItemFields={(item: any, i: number, update: (f: string, v: any) => void) => (
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <AdminInput label="Platform Name" value={item.platform} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("platform", e.target.value)} />
                                <AdminInput label="URL" value={item.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("url", e.target.value)} />
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
