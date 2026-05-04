"use client";

import { useState, useEffect } from "react";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Link2, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const [social, setSocial] = useState<{ facebook?: string; twitter?: string; linkedin?: string; instagram?: string }>({});

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.socialLinks) {
                    setSocial(data.socialLinks);
                }
            })
            .catch(err => console.error("Failed to load footer settings:", err));
    }, []);

    return (
        <footer className="bg-earth-green text-white pt-20 pb-24 sm:pb-10">
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
                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                            5ᵗʰ International Conference on Organic and Natural Rice Production Systems.
                            <br />
                            Advancing Global Agricultural Innovation & Sustainability.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Links */}
                            {social.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {social.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {social.linkedin && (
                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {(!social.facebook && !social.twitter && !social.linkedin && !social.instagram) && (
                                <>
                                    <a href="#" aria-label="Facebook" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                        <Facebook size={16} />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                        <Twitter size={16} />
                                    </a>
                                    <a href="#" aria-label="LinkedIn" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-sapling-green transition-colors cursor-pointer">
                                        <Linkedin size={16} />
                                    </a>
                                </>
                            )}
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
                                <span>NASC Complex,<br />New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-sapling-green" />
                                <a href="mailto:info@orp5ic.com" className="hover:text-rice-gold">info@orp5ic.com</a>
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
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                        <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
