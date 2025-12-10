"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { SiteSettings } from "@/types/pages";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
    const [data, setData] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load settings:", err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) alert("Settings Saved!");
            else alert("Failed to save settings.");
        } catch (e) {
            console.error(e);
            alert("Error saving settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleDateChange = (field: keyof SiteSettings['dates'], value: string) => {
        if (!data) return;
        setData({
            ...data,
            dates: {
                ...data.dates,
                [field]: value
            }
        });
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading settings...</div>;
    if (!data) return <div className="p-12 text-center text-red-500">Error loading settings.</div>;

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Settings</h1>
                    <p className="text-gray-500">Manage global site configuration and important dates.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px]">
                    {saving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Settings</>}
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl">
                <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Important Dates</h2>
                <div className="grid gap-6">
                    <AdminInput
                        label="Conference Start Date"
                        type="date"
                        value={data.dates.conferenceStart}
                        onChange={(e) => handleDateChange("conferenceStart", e.target.value)}
                    />
                    <AdminInput
                        label="Conference End Date"
                        type="date"
                        value={data.dates.conferenceEnd}
                        onChange={(e) => handleDateChange("conferenceEnd", e.target.value)}
                    />
                    <div className="h-px bg-gray-100 my-2" />
                    <AdminInput
                        label="Registration Opens"
                        type="date"
                        value={data.dates.registrationOpen}
                        onChange={(e) => handleDateChange("registrationOpen", e.target.value)}
                    />
                    <AdminInput
                        label="Early Bird Deadline"
                        type="date"
                        value={data.dates.earlyBirdDeadline}
                        onChange={(e) => handleDateChange("earlyBirdDeadline", e.target.value)}
                    />
                    <AdminInput
                        label="Abstract Submission Deadline"
                        type="date"
                        value={data.dates.abstractDeadline}
                        onChange={(e) => handleDateChange("abstractDeadline", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
