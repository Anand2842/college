"use client"
import { Button } from "@/components/atoms/Button";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Settings</h1>
            <p className="text-gray-500 mb-8">Manage global site configuration.</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Global settings (Logo, Footer Text, SEO) coming soon.</p>
                    <Button variant="outline" disabled>Unavailable in Preview</Button>
                </div>
            </div>
        </div>
    );
}
