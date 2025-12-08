
import { Metadata } from 'next';
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export const metadata: Metadata = {
    title: 'Abstracts | ORP-5 Conference',
    description: 'Conference Abstracts for ORP-5',
};

export default function AbstractsPage() {
    return (
        <main className="min-h-screen bg-[#FFFDF7] font-sans text-charcoal">
            <Navbar />

            <section className="relative pt-32 pb-20 bg-charcoal text-white">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        Abstracts
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        The full list of accepted abstracts and research papers will be published here after the conference.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-6 text-center">
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Coming Soon</h2>
                    <p className="text-gray-600">
                        We are currently collecting submissions. Check back later for the published abstracts.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
