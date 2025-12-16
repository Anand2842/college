import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Link2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-earth-green text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div>
                        <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                            <span className="font-serif font-bold text-xl">ORP</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold mb-4">ORP-5</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                            5th International Conference on Organic and Natural Rice Production Systems.
                            <br />
                            Advancing Global Agricultural Innovation & Sustainability.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li><Link href="/about" className="hover:text-rice-gold transition-colors">Organizers</Link></li>
                            <li><Link href="/registration" className="hover:text-rice-gold transition-colors">Registration</Link></li>
                            <li><Link href="/programme" className="hover:text-rice-gold transition-colors">Programme</Link></li>
                            <li><Link href="/venue" className="hover:text-rice-gold transition-colors">Venue & Travel</Link></li>
                            <li><Link href="/submission" className="hover:text-rice-gold transition-colors">Abstract Submission</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-white/80">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 text-sapling-green" />
                                <span>Galgotias University,<br />Greater Noida, Uttar Pradesh, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-sapling-green" />
                                <a href="mailto:info@orp5.org" className="hover:text-rice-gold">info@orp5.org</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-sapling-green" />
                                <a href="tel:+919876543210" className="hover:text-rice-gold">+91 98765 43210</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
                        <p className="text-sm text-white/80 mb-4">Subscribe to our newsletter for the latest updates and announcements.</p>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/60">
                    <p>&copy; 2024-2026 ORP-5 Conference. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/about" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/about" className="hover:text-white">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
