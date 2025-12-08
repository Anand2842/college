"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { RegistrationPageData } from "@/types/pages";
import { fetchJSON } from "@/lib/fetchWrapper";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";

export default function RegistrationContent() {
    const [data, setData] = useState<RegistrationPageData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        async function loadData() {
            const { data: jsonData, error: fetchError } = await fetchJSON<RegistrationPageData>("/api/content/registration");
            if (fetchError) {
                setError(fetchError);
            } else {
                setData(jsonData);
            }
        }
        loadData();
    }, []);

    const scrollToForm = (categoryName: string) => {
        setSelectedCategory(categoryName);
        document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Helper to resolve icon string to Component
    const getIcon = (name: string) => {
        // @ts-ignore
        const IconComponent = LucideIcons[name];
        return IconComponent ? <IconComponent size={24} /> : null;
    };

    if (error) return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
            <div className="text-center max-w-md">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-earth-green hover:underline">Try Again</button>
            </div>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-charcoal text-white pt-32 pb-20 relative overflow-hidden">
                {/* Green Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-earth-green/20 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <p className="text-rice-gold/80 text-sm font-bold uppercase tracking-widest mb-4">Home / Registration</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        {data.hero.headline}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                        {data.hero.subheadline}
                    </p>
                    <span className="inline-block bg-earth-green text-white font-bold py-2 px-6 rounded-full text-sm shadow-lg animate-pulse">
                        {data.hero.statusText}
                    </span>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-left mb-12">
                    <h2 className="text-2xl font-bold text-charcoal">Choose Your Registration Category</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {data.categories.map((cat: any) => (
                        <div key={cat.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-earth-green">
                                    {getIcon(cat.icon)}
                                </div>
                                <h3 className="font-bold text-lg text-charcoal">{cat.title}</h3>
                            </div>
                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">{cat.price}</p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">{cat.description}</p>

                            <button
                                onClick={() => scrollToForm(cat.title)}
                                className="text-earth-green font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                                Register <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Form Section */}
                <div className="text-left mb-8">
                    <h2 className="text-2xl font-bold text-charcoal">Complete Your Registration</h2>
                </div>

                <RegistrationForm selectedCategory={selectedCategory} />
            </section>

            {/* Help Banner */}
            <section className="py-20 bg-charcoal text-center text-white">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-2xl font-bold mb-4">Need help with registration?</h2>
                    <p className="text-gray-400 text-sm mb-8">We're here to assist you.</p>
                    <Link href="/contact">
                        <button className="bg-earth-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                            Contact Organizers
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
