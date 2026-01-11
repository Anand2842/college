import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export const metadata = {
    title: "Terms of Service | ORP-5",
    description: "Terms of Service for the 5th International Conference on Organic and Natural Rice Production Systems."
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-earth-green/10 pt-32 pb-16">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-green mb-4">Terms of Service</h1>
                    <p className="text-gray-600 max-w-2xl">Last Updated: January 1, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <div className="prose prose-lg prose-emerald max-w-none bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="lead text-xl text-gray-700 font-medium">
                        By accessing and using the ORP-5 website, you agree to comply with the following terms.
                    </p>

                    <h3>Website Use</h3>
                    <p>
                        The ORP-5 website is intended for informational and academic purposes related to the conference. Users agree to use the website responsibly and lawfully.
                    </p>

                    <h3>Content Accuracy</h3>
                    <p>
                        While efforts are made to ensure accuracy, ORP-5 does not guarantee that all information on the website is free from errors or omissions. Conference details may be updated as needed.
                    </p>

                    <h3>Intellectual Property</h3>
                    <p>
                        All website content, including text, logos, images, and documents, is the property of ORP-5 or its respective contributors. Content may not be reproduced without prior permission, except for personal or academic reference.
                    </p>

                    <h3>Submissions and Participation</h3>
                    <p>
                        Submission of abstracts, registration, and participation are subject to guidelines issued by the organizing committee. ORP-5 reserves the right to accept or reject submissions.
                    </p>

                    <h3>Limitation of Liability</h3>
                    <p>
                        ORP-5 is not liable for any direct or indirect loss arising from the use of the website or participation in the conference.
                    </p>

                    <h3>Modifications</h3>
                    <p>
                        ORP-5 reserves the right to modify these terms at any time. Continued use of the website indicates acceptance of updated terms.
                    </p>

                    <h3>Governing Law</h3>
                    <p>
                        These terms shall be governed by the laws applicable in <strong>India</strong>.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
