"use client";

import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Link2, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Icon map for dynamic socials
const SocialIcons: any = { Facebook, Twitter, Instagram, Linkedin, Globe };

export function Footer() {
    const [footerData, setFooterData] = useState<any>({
        aboutText: "5th International Conference on Organic and Natural Rice Production Systems.<br />Advancing Global Agricultural Innovation & Sustainability.",
        contact: {
            address: "NASC Complex,<br />New Delhi, Delhi, India",
            email: "info@orp5.org",
            phone: "+91 98765 43210"
        },
        socials: [
            { platform: "Facebook", url: "#", iconName: "Facebook" },
            { platform: "Twitter", url: "#", iconName: "Twitter" },
            { platform: "Instagram", url: "#", iconName: "Instagram" }
        ],
        copyrightText: "2024-2026 ORP-5 Conference. All rights reserved."
    });

    useEffect(() => {
        fetch("/api/content/global-settings")
            .then(res => {
                if (!res.ok) return null;
                return res.json();
            })
            .then(data => {
                if (data && data.footer) {
                    setFooterData(data.footer);
                }
            })
            .catch(err => console.error("Failed to fetch footer data", err));
    }, []);

    return (
        <footer className="bg-earth-green text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div>
                        <div className="mb-6 bg-white p-2 rounded-xl inline-block">
                            <img
                                src="/orp5-logo.png"
                                alt="ORP-5 Logo"
                                className="h-24 w-auto object-contain"
                            />
                        </div>
                        <div className="text-white/80 text-sm leading-relaxed mb-6">
                            <SafeHtml html={footerData.aboutText} />
                        </div>
                        <div className="flex gap-4">
                            {/* Dynamic Socials */}
                            {footerData.socials?.map((social: any, idx: number) => {
                                const Icon = SocialIcons[social.iconName] || Globe;
                                return (
                                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                                        <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors flex items-center justify-center">
                                            <Icon size={16} />
                                        </div>
                                    </a>
                                );
                            })}
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
                            <li><Link href="/blog" className="hover:text-rice-gold transition-colors">Blog & News</Link></li>
                            <li><Link href="/submission" className="hover:text-rice-gold transition-colors">Abstract Submission</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-white/80">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 text-sapling-green" />
                                <span><SafeHtml html={footerData.contact.address} /></span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-sapling-green" />
                                <a href={`mailto:${footerData.contact.email}`} className="hover:text-rice-gold">{footerData.contact.email}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-sapling-green" />
                                <a href={`tel:${footerData.contact.phone}`} className="hover:text-rice-gold">{footerData.contact.phone}</a>
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
                    <p>&copy; {footerData.copyrightText}</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SafeHtml({ html }: { html: string }) {
    if (!html) return null;
    const parts = html.split(/(<br\s*\/?>)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.match(/<br\s*\/?>/)) return <br key={index} />;
                return part;
            })}
        </>
    );
}
