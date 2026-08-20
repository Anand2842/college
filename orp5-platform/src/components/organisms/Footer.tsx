"use client";

import { useState, useEffect } from "react";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const [social, setSocial] = useState<{ facebook?: string; twitter?: string; linkedin?: string; instagram?: string }>({});
    const [logo, setLogo] = useState<string>("/orp5-logo.png");
    const [logoAlt, setLogoAlt] = useState<string>("ORP-5 Logo");

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.socialLinks) {
                    setSocial(data.socialLinks);
                }
                if (data.branding?.footerLogoUrl || data.branding?.logoUrl) {
                    setLogo(data.branding.footerLogoUrl || data.branding.logoUrl);
                }
                if (data.branding?.logoAlt) {
                    setLogoAlt(data.branding.logoAlt);
                }
            })
            .catch(err => console.error("Failed to load footer settings:", err));
    }, []);

    return (
        <footer className="relative bg-earth-green-deep text-white overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-sapling-green/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-rice-gold/10 blur-[120px] rounded-full pointer-events-none" />


            {/* Main Footer Content */}
            <div className="container mx-auto px-6 pt-12 pb-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-5">
                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl inline-block shadow-lg border border-white/30">
                            <Image
                                src={logo || "/orp5-logo.png"}
                                alt={logoAlt || "ORP-5 Logo"}
                                width={110}
                                height={60}
                                className="h-16 w-auto object-contain"
                                unoptimized={logo.startsWith('http')}
                            />
                        </div>

                        <p className="text-white/75 text-sm leading-relaxed">
                            5ᵗʰ International Conference on Organic and Natural Rice Production Systems.
                            <span className="block text-rice-gold-light/90 font-medium mt-2">
                                21–25 September 2026 • New Delhi, India
                            </span>
                        </p>
                        <div className="flex gap-2.5 pt-2">
                            {/* Social Links */}
                            {social.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {social.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {social.linkedin && (
                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {(!social.facebook && !social.twitter && !social.linkedin && !social.instagram) && (
                                <>
                                    <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                        <Facebook size={16} />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                        <Twitter size={16} />
                                    </a>
                                    <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rice-gold hover:text-earth-green flex items-center justify-center transition-all">
                                        <Linkedin size={16} />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rice-gold"></span>
                            Quick Navigation
                        </h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-2 text-sm text-white/75">
                            <li><Link href="/about" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">About ORP-5</Link></li>
                            <li><Link href="/committees" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Committees</Link></li>
                            <li><Link href="/programme" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Programme</Link></li>
                            <li><Link href="/speakers" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Speakers</Link></li>
                            <li><Link href="/themes" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Themes</Link></li>
                            <li><Link href="/awards" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Awards & Prizes</Link></li>
                            <li><Link href="/venue" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Venue & Travel</Link></li>
                            <li><Link href="/registration" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Registration</Link></li>
                            <li><Link href="/contact" className="hover:text-rice-gold transition-colors inline-flex items-center gap-1.5 py-1">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Details */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rice-gold"></span>
                            Secretariat
                        </h4>
                        <ul className="space-y-4 text-sm text-white/75">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rice-gold shrink-0 mt-0.5">
                                    <MapPin size={15} />
                                </div>
                                <span>A.P. Shinde Symposium Hall,<br />NASC Complex, New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rice-gold shrink-0">
                                    <Mail size={15} />
                                </div>
                                <a href="mailto:info@orp5ic.com" className="hover:text-rice-gold transition-colors">info@orp5ic.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rice-gold shrink-0">
                                    <Phone size={15} />
                                </div>
                                <a href="tel:+919868416215" className="hover:text-rice-gold transition-colors">+91 98684 16215</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="font-serif font-bold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rice-gold"></span>
                            Stay Updated
                        </h4>
                        <p className="text-sm text-white/75 mb-4 leading-relaxed">
                            Subscribe to receive official announcements, key deadlines, and speaker updates.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 text-center md:text-left gap-4">
                    <p>&copy; 2024–2026 ORP-5 Organizing Committee. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
