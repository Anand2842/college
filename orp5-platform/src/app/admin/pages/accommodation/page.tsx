"use client";

import { useState, useEffect } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function AccommodationEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("Hero & Info");

    useEffect(() => {
        fetch("/api/content/accommodation")
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

    // Helper to edit array of strings for amenities
    const handleAmenitiesUpdate = (hotelIndex: number, newAmenities: string) => {
        const updatedHotels = [...data.officialHotels];
        updatedHotels[hotelIndex].amenities = newAmenities.split('\n').filter(s => s.trim() !== "");
        setData((prev: any) => ({ ...prev, officialHotels: updatedHotels }));
    };

    const handleFeaturesUpdate = (typeIndex: number, newFeatures: string) => {
        const updatedTypes = [...data.types];
        updatedTypes[typeIndex].features = newFeatures.split('\n').filter(s => s.trim() !== "");
        setData((prev: any) => ({ ...prev, types: updatedTypes }));
    };

    // Update a nested contactDetails field on a hotel
    const handleContactUpdate = (hotelIndex: number, field: string, value: string) => {
        const updatedHotels = [...data.officialHotels];
        updatedHotels[hotelIndex] = {
            ...updatedHotels[hotelIndex],
            contactDetails: {
                ...(updatedHotels[hotelIndex].contactDetails || {}),
                [field]: value,
            },
        };
        setData((prev: any) => ({ ...prev, officialHotels: updatedHotels }));
    };

    // Toggle a hotel between booking-link mode and contact-details mode
    const handleContactModeToggle = (hotelIndex: number, useContact: boolean) => {
        const updatedHotels = [...data.officialHotels];
        const hotel = { ...updatedHotels[hotelIndex] };
        if (useContact) {
            hotel.contactDetails = hotel.contactDetails || { name: '', phone: '', email: '' };
            delete hotel.bookingLink;
            delete hotel.promoCode;
        } else {
            delete hotel.contactDetails;
            hotel.bookingLink = hotel.bookingLink || '#';
            hotel.promoCode = hotel.promoCode || '';
        }
        updatedHotels[hotelIndex] = hotel;
        setData((prev: any) => ({ ...prev, officialHotels: updatedHotels }));
    };


    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content/accommodation', {
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
                title="Accommodation Editor"
                subtitle="Manage content for /accommodation"
                onSave={handleSave}
                saving={saving}
                viewLink="/accommodation"
            />

            <div className="container mx-auto max-w-5xl mt-8 px-6">
                <AdminTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={["Hero & Info", "Convenient Hotels", "Nearby Hotels", "Types & CTA"]}
                />

                {activeTab === "Hero & Info" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Hero Section</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.hero.headline} onChange={(e) => handleChange("hero", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.hero.subheadline} onChange={(e) => handleChange("hero", "subheadline", e.target.value)} />
                                <ImageUploader label="Background Image" value={data.hero.backgroundImage} onChange={(url) => handleChange("hero", "backgroundImage", url)} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Info Bar</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Check In/Out" value={data.infoBar.checkInOut} onChange={(e) => handleChange("infoBar", "checkInOut", e.target.value)} />
                                <AdminInput label="Shuttle Info" value={data.infoBar.shuttle} onChange={(e) => handleChange("infoBar", "shuttle", e.target.value)} />
                                <AdminInput label="Contact Email" value={data.infoBar.contact} onChange={(e) => handleChange("infoBar", "contact", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Convenient Hotels" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Convenient Hotels</h2>
                        <ListEditor
                            title="Hotels"
                            items={data.officialHotels || []}
                            onUpdate={(items) => handleListUpdate("officialHotels", items)}
                            itemTemplate={{ id: "", name: "New Hotel", stars: 5, priceRange: "", amenities: [], promoCode: "" }}
                            renderItemFields={(item, i, update) => (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput label="Hotel Name" value={item.name || ''} onChange={(e) => update("name", e.target.value)} />
                                        <AdminInput label="Price Range" value={item.priceRange || ''} onChange={(e) => update("priceRange", e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <AdminInput label="Distance / Address" value={item.distance || ''} onChange={(e) => update("distance", e.target.value)} />
                                        <AdminInput label="Price Unit (e.g. / night)" value={item.priceUnit || ''} onChange={(e) => update("priceUnit", e.target.value)} />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Amenities (one per line)</label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm h-24"
                                            placeholder={"Free Wi-Fi\nBreakfast Included\nSwimming Pool"}
                                            value={Array.isArray(item.amenities) ? item.amenities.join('\n') : item.amenities || ''}
                                            onChange={(e) => handleAmenitiesUpdate(i, e.target.value)}
                                        />
                                    </div>

                                    {/* ── Booking Method ── */}
                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Booking Method</label>
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                type="button"
                                                onClick={() => handleContactModeToggle(i, false)}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                                    !item.contactDetails ? 'bg-earth-green text-white border-earth-green' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                                }`}
                                            >🔗 Booking Link</button>
                                            <button
                                                type="button"
                                                onClick={() => handleContactModeToggle(i, true)}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                                    item.contactDetails ? 'bg-earth-green text-white border-earth-green' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                                }`}
                                            >📞 Direct Contact</button>
                                        </div>

                                        {item.contactDetails ? (
                                            <div className="bg-gray-50 rounded-lg p-3 grid gap-2 border border-gray-100">
                                                <p className="text-[11px] text-gray-400 mb-1">Shown as an expandable accordion on the card — no booking button.</p>
                                                <AdminInput label="Contact Person & Title" value={item.contactDetails?.name || ''} onChange={(e) => handleContactUpdate(i, 'name', e.target.value)} placeholder="e.g. Shailender Aggarwal (Sales Manager)" />
                                                <AdminInput label="Phone Number(s)" value={item.contactDetails?.phone || ''} onChange={(e) => handleContactUpdate(i, 'phone', e.target.value)} placeholder="e.g. +91-9871225326" />
                                                <AdminInput label="Email Address" value={item.contactDetails?.email || ''} onChange={(e) => handleContactUpdate(i, 'email', e.target.value)} placeholder="e.g. sales@hotel.com" />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-lg p-3 grid gap-2 border border-gray-100">
                                                <p className="text-[11px] text-gray-400 mb-1">Shows a "Check Availability" button linking to this URL.</p>
                                                <AdminInput label="Booking Link URL" value={item.bookingLink || ''} onChange={(e) => update('bookingLink', e.target.value)} placeholder="https://..." />
                                                <AdminInput label="Promo Code (optional)" value={item.promoCode || ''} onChange={(e) => update('promoCode', e.target.value)} placeholder="e.g. ORP5CONF" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <ImageUploader label="Hotel Image" value={item.image || ''} onChange={(url) => update("image", url)} />
                                    </div>
                                </>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Nearby Hotels" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Nearby Hotels List</h2>
                        <ListEditor
                            title="Nearby Hotels"
                            items={data.nearbyHotels || []}
                            onUpdate={(items) => handleListUpdate("nearbyHotels", items)}
                            itemTemplate={{ id: "", name: "New Hotel", distance: "", price: "" }}
                            renderItemFields={(item, i, update) => (
                                <div className="grid grid-cols-3 gap-4">
                                    <AdminInput label="Name" value={item.name} onChange={(e) => update("name", e.target.value)} />
                                    <AdminInput label="Distance" value={item.distance} onChange={(e) => update("distance", e.target.value)} />
                                    <AdminInput label="Price" value={item.price} onChange={(e) => update("price", e.target.value)} />
                                </div>
                            )}
                        />
                    </div>
                )}

                {activeTab === "Types & CTA" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Accommodation Types</h2>
                            <ListEditor
                                title="Room Types"
                                items={data.types || []}
                                onUpdate={(items) => handleListUpdate("types", items)}
                                itemTemplate={{ id: "", title: "New Type", icon: "Briefcase", features: [] }}
                                renderItemFields={(item, i, update) => (
                                    <>
                                        <AdminInput label="Title" value={item.title} onChange={(e) => update("title", e.target.value)} />
                                        <AdminInput label="Icon Name" value={item.icon} onChange={(e) => update("icon", e.target.value)} />
                                        <div className="mt-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Features (Newline separated)</label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm h-24"
                                                value={Array.isArray(item.features) ? item.features.join('\n') : item.features}
                                                onChange={(e) => handleFeaturesUpdate(i, e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold mb-6 text-earth-green pb-4 border-b">Footer CTA</h2>
                            <div className="grid gap-6">
                                <AdminInput label="Headline" value={data.footerCta.headline} onChange={(e) => handleChange("footerCta", "headline", e.target.value)} />
                                <AdminInput label="Subheadline" value={data.footerCta.subheadline} onChange={(e) => handleChange("footerCta", "subheadline", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
