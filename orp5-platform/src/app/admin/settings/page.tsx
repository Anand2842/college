"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AdminInput } from "@/components/admin/AdminInput";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SiteSettings } from "@/types/pages";
import { Loader2, Save, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const DEFAULT_PROMO_MODAL = {
    enabled: false,
    slideIntervalSeconds: 5,
    showOncePerSession: true,
    delaySeconds: 2,
    slides: [
        {
            id: "slide-1",
            title: "Abstract Submission Open!",
            subtitle: "Submit your research abstract for ORP-5 before the deadline. Expert review. Global audience.",
            ctaLabel: "Submit Abstract",
            ctaLink: "/submission",
            imageUrl: "",
        },
        {
            id: "slide-2",
            title: "Register for ORP-5",
            subtitle: "Secure your spot at the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems.",
            ctaLabel: "Register Now",
            ctaLink: "/registration",
            imageUrl: "",
        },
    ],
};

export default function SettingsPage() {
    const [data, setData] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((jsonData) => {
                if (!jsonData.promoModal) jsonData.promoModal = DEFAULT_PROMO_MODAL;
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
            if (res.ok) {
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        } catch (e) {
            console.error(e);
            setSaveStatus("error");
        } finally {
            setSaving(false);
        }
    };

    const handleDateChange = (field: keyof SiteSettings['dates'], value: string) => {
        if (!data) return;
        setData({ ...data, dates: { ...data.dates, [field]: value } });
    };

    const updateModalField = (field: string, value: any) => {
        if (!data) return;
        setData({ ...data, promoModal: { ...data.promoModal!, [field]: value } });
    };

    const updateSlide = (index: number, field: string, value: string) => {
        if (!data?.promoModal) return;
        const slides = [...data.promoModal.slides];
        slides[index] = { ...slides[index], [field]: value };
        updateModalField("slides", slides);
    };

    const addSlide = () => {
        if (!data?.promoModal) return;
        const newSlide = {
            id: `slide-${Date.now()}`,
            title: "New Slide",
            subtitle: "Enter slide description here.",
            ctaLabel: "Learn More",
            ctaLink: "/",
            imageUrl: "",
        };
        updateModalField("slides", [...data.promoModal.slides, newSlide]);
    };

    const removeSlide = (index: number) => {
        if (!data?.promoModal || data.promoModal.slides.length <= 1) return;
        const slides = data.promoModal.slides.filter((_, i) => i !== index);
        updateModalField("slides", slides);
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading settings...</div>;
    if (!data) return <div className="p-12 text-center text-red-500">Error loading settings.</div>;

    const modal = data.promoModal ?? DEFAULT_PROMO_MODAL;

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Settings</h1>
                    <p className="text-gray-500">Manage global site configuration, integrations, and promotional content.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saveStatus === "saved" && <span className="text-green-600 text-sm font-medium">✓ Changes saved</span>}
                    {saveStatus === "error" && <span className="text-red-600 text-sm font-medium">✗ Save failed</span>}
                    <Button onClick={handleSave} disabled={saving} className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px]">
                        {saving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Settings</>}
                    </Button>
                </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mb-8">
                <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Important Dates</h2>
                <div className="grid gap-6">
                    <AdminInput label="Conference Start Date" type="date" value={data.dates.conferenceStart} onChange={(e) => handleDateChange("conferenceStart", e.target.value)} />
                    <AdminInput label="Conference End Date" type="date" value={data.dates.conferenceEnd} onChange={(e) => handleDateChange("conferenceEnd", e.target.value)} />
                    <div className="h-px bg-gray-100 my-2" />
                    <AdminInput label="Registration Opens" type="date" value={data.dates.registrationOpen} onChange={(e) => handleDateChange("registrationOpen", e.target.value)} />
                    <AdminInput label="Early Bird Deadline" type="date" value={data.dates.earlyBirdDeadline} onChange={(e) => handleDateChange("earlyBirdDeadline", e.target.value)} />
                    <AdminInput label="Abstract Submission Deadline" type="date" value={data.dates.abstractDeadline} onChange={(e) => handleDateChange("abstractDeadline", e.target.value)} />
                </div>
            </div>

            {/* Integrations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mb-8">
                <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Integrations</h2>
                <div className="grid gap-6">
                    <AdminInput
                        label="WhatsApp Group Link"
                        type="url"
                        value={data.whatsappGroupLink || ""}
                        onChange={(e) => setData({ ...data, whatsappGroupLink: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 -mt-4">Redirects the floating WhatsApp button to a group invite link.</p>
                </div>
            </div>

            {/* Promotional Popup Modal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-earth-green">Promotional Popup</h2>
                        <p className="text-sm text-gray-500 mt-1">Auto-sliding announcement modal shown to new visitors.</p>
                    </div>
                    <button
                        onClick={() => updateModalField("enabled", !modal.enabled)}
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        {modal.enabled
                            ? <><ToggleRight size={28} className="text-earth-green" /><span className="text-earth-green">Enabled</span></>
                            : <><ToggleLeft size={28} className="text-gray-400" /><span className="text-gray-400">Disabled</span></>
                        }
                    </button>
                </div>

                {/* Global settings row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Slide Timer (seconds)</label>
                        <input
                            type="number"
                            min={2} max={30}
                            value={modal.slideIntervalSeconds}
                            onChange={(e) => updateModalField("slideIntervalSeconds", Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-earth-green"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Appear After (seconds)</label>
                        <input
                            type="number"
                            min={0} max={30}
                            value={modal.delaySeconds}
                            onChange={(e) => updateModalField("delaySeconds", Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-earth-green"
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Frequency</label>
                        <button
                            onClick={() => updateModalField("showOncePerSession", !modal.showOncePerSession)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${modal.showOncePerSession ? "border-earth-green bg-earth-green/5 text-earth-green" : "border-gray-200 text-gray-500"}`}
                        >
                            {modal.showOncePerSession ? "Once per session" : "Every page load"}
                        </button>
                    </div>
                </div>

                {/* Slides */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Slides ({modal.slides.length})</h3>
                        <button
                            onClick={addSlide}
                            className="flex items-center gap-1.5 text-xs font-medium text-earth-green hover:bg-earth-green/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus size={14} /> Add Slide
                        </button>
                    </div>

                    {modal.slides.map((slide, i) => (
                        <div key={slide.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-bold uppercase bg-earth-green text-white px-2 py-0.5 rounded-full">Slide {i + 1}</span>
                                {modal.slides.length > 1 && (
                                    <button onClick={() => removeSlide(i)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <ImageUploader
                                        label="Designer Image (JPG/PNG)"
                                        value={slide.imageUrl || ""}
                                        onChange={(url) => updateSlide(i, "imageUrl", url)}
                                        className="mb-0"
                                    />
                                    <p className="mt-1 text-[10px] text-gray-500">
                                        Required for image-only popup
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination Link</label>
                                    <input
                                        value={slide.ctaLink}
                                        onChange={(e) => updateSlide(i, "ctaLink", e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-earth-green"
                                        placeholder="/registration"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
