"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { BookOpen, FileText, Download } from "lucide-react";
import Link from 'next/link';

export default function PublicationsClient() {
    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal selection:bg-rice-gold/30">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-charcoal text-white pt-32 pb-20 text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
                        Publications
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Access conference proceedings, abstracts, and journals from ORP-5.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 container mx-auto px-6 max-w-5xl text-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-16 shadow-sm">
                    <div className="w-20 h-20 bg-earth-green/10 text-earth-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Conference Proceedings Coming Soon</h2>
                    <p className="text-gray-500 max-w-lg mx-auto mb-8">
                        The full list of accepted abstracts and research papers will be published here after the conference.
                        Stay tuned for updates.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link href="/submission">
                            <button className="bg-rice-gold hover:bg-yellow-500 text-charcoal font-bold py-3 px-6 rounded-md shadow-md flex items-center gap-2 transition-transform hover:-translate-y-1">
                                Submit Abstract
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
