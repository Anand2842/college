import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export const metadata = {
    title: "Privacy Policy | ORP-5",
    description: "Privacy Policy for the 5th International Conference on Organic and Natural Rice Production Systems."
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-earth-green/10 pt-32 pb-16">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-green mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 max-w-2xl">Last Updated: January 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <div className="prose prose-lg prose-emerald max-w-none bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="lead text-xl text-gray-700 font-medium">
                        The <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> respects the privacy of its website visitors, participants, and contributors. This Privacy Policy outlines how information is collected, used, and protected when you interact with the ORP-5 website.
                    </p>

                    <h3>Information We Collect</h3>
                    <p>We may collect the following information when you use the website:</p>
                    <ul>
                        <li>Name, email address, affiliation, and contact details (via registration or contact forms)</li>
                        <li>Information related to abstract submission, registration, and participation</li>
                        <li>Technical information such as browser type and device (for basic site analytics)</li>
                    </ul>

                    <h3>Use of Information</h3>
                    <p>The information collected is used solely for:</p>
                    <ul>
                        <li>Conference registration and communication</li>
                        <li>Abstract submission and review processes</li>
                        <li>Providing conference-related updates and logistical information</li>
                        <li>Improving website functionality and user experience</li>
                    </ul>

                    <h3>Data Protection</h3>
                    <p>
                        ORP-5 takes reasonable measures to protect personal information against unauthorized access, alteration, disclosure, or destruction. Personal data is used only for conference-related purposes.
                    </p>

                    <h3>Third-Party Sharing</h3>
                    <p>
                        Personal information is <strong>not sold or shared</strong> with third parties, except where required for conference operations (e.g., payment processing or official communications).
                    </p>

                    <h3>External Links</h3>
                    <p>
                        The ORP-5 website may contain links to external websites. ORP-5 is not responsible for the privacy practices of external sites.
                    </p>

                    <h3>Updates</h3>
                    <p>
                        This Privacy Policy may be updated periodically. Any changes will be reflected on this page.
                    </p>

                    <h3>Contact</h3>
                    <p>For privacy-related concerns, please contact:</p>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <p className="m-0 font-bold text-earth-green">ORP-5 Secretariat</p>
                        <p className="m-0">NASC Complex, New Delhi, India</p>
                        <p className="mt-2 mb-0">
                            📧 <a href="mailto:info@orp5.org" className="text-earth-green hover:underline">info@orp5.org</a>
                        </p>
                        <p className="m-0">
                            📞 <strong>+91 9868416215</strong>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
