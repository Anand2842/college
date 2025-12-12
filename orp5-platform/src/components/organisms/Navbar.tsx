"use client"

import React from "react"
import Link from "next/link"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/lib/utils"
// import { Logo } from "@/components/atoms/Logo" // Placeholder

import { ChevronDown, Menu, X } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        label: "About",
        href: "/about",
        children: [
            { label: "About ORP-5", href: "/about" },
            { label: "Conference Themes", href: "/themes" },
            { label: "Committees", href: "/committees" },
            { label: "Speakers", href: "/speakers" },
            { label: "Awards & Prizes", href: "/awards" },
        ]
    },
    {
        label: "Exhibition & Sponsorship",
        href: "/exhibition",
        children: [
            { label: "Exhibition", href: "/exhibition" },
            { label: "Sponsorship", href: "/sponsorship" },
        ]
    },
    {
        label: "Programme & Participation",
        href: "/programme",
        children: [
            { label: "Schedule", href: "/programme" },
            { label: "Guidelines", href: "/submission-guidelines" },
        ]
    },
    {
        label: "Registration",
        href: "/registration",
        children: [
            { label: "Registration Details", href: "/registration" },
            { label: "Important Dates", href: "/important-dates" },
        ]
    },
    {
        label: "Abstracts & Publications",
        href: "/abstracts",
        children: [
            { label: "Submit Abstract", href: "/submission" },
            { label: "Publications", href: "/publications" },
        ]
    },
    {
        label: "Venue & Travel",
        href: "/venue",
        children: [
            { label: "Venue Details", href: "/venue" },
            { label: "About the City", href: "/about/city" },
            { label: "How to Reach", href: "/how-to-reach" },
            { label: "Accommodation", href: "/accommodation" },
        ]
    },
    {
        label: "Dashboard",
        href: "/dashboard",
    }
];

interface NavbarProps {
    variant?: "default" | "dark";
}

export function Navbar({ variant = "default" }: NavbarProps) {
    const scrollY = useScrollPosition()
    const isScrolled = scrollY > 50

    // Admin check state
    const [isAdmin, setIsAdmin] = React.useState(false);

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] = React.useState<string | null>(null);

    const toggleMobileSubmenu = (label: string) => {
        setOpenMobileSubmenu(prev => prev === label ? null : label);
    }

    React.useEffect(() => {
        // ... existing auth check code ...
        const checkAdmin = async () => {
            try {
                const { createClient } = await import("@/utils/supabase/client");
                const supabase = createClient();

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setIsLoggedIn(true);
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.warn("Auth check suppressed:", error);
            }
        };
        checkAdmin();
    }, []);

    // text color condition
    const isDarkText = variant === "dark" || isScrolled;

    // Simplified Navbar for Static Layout
    return (
        <header
            className="bg-white sticky top-0 z-50 py-4 shadow-sm border-b border-gray-100"
        >
            <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between relative z-50">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mr-4 lg:mr-8 xl:mr-16 min-w-fit">
                    {/* Placeholder for Logo */}
                    <div className="font-serif font-bold text-xl tracking-wide text-black">
                        ORP-5
                    </div>
                </Link>

                <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                    {navItems.map((item) => (
                        item.children ? (
                            <div key={item.label} className="relative group">
                                <Link href={item.href} className="flex items-center gap-0.5 text-xs xl:text-sm font-medium transition-colors hover:text-rice-gold focus:outline-none text-charcoal whitespace-nowrap">
                                    {item.label}
                                    <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200 opacity-70" />
                                </Link>
                                {/* Dropdown Menu */}
                                <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block px-4 py-2 text-sm text-charcoal hover:bg-earth-green/5 hover:text-earth-green transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-rice-gold text-charcoal"
                            >
                                {item.label}
                            </Link>
                        )
                    ))}

                    <Link href="/registration">
                        <Button
                            variant="default"
                            className="font-bold border-charcoal bg-white text-earth-green hover:bg-earth-green hover:text-white border border-earth-green/20"
                        >
                            Register
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 transition-colors text-black bg-gray-50 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="flex flex-col space-y-6 pb-20">
                            {navItems.map((item) => (
                                <div key={item.label} className="border-b border-gray-100 pb-4 last:border-0">
                                    {item.children ? (
                                        <>
                                            <button
                                                className="flex w-full items-center justify-between font-bold text-earth-green mb-3"
                                                onClick={() => toggleMobileSubmenu(item.label)}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={cn("transition-transform duration-200", openMobileSubmenu === item.label && "rotate-180")}
                                                />
                                            </button>
                                            {openMobileSubmenu === item.label && (
                                                <div className="flex flex-col space-y-3 pl-4 animate-in slide-in-from-top-1 fade-in duration-200">
                                                    {item.children.map(child => (
                                                        <Link
                                                            key={child.label}
                                                            href={child.href}
                                                            className="text-gray-600 hover:text-earth-green py-1"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="font-bold text-earth-green block"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-col gap-4 mt-8">
                                {!isLoggedIn && (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center">Login</Button>
                                    </Link>
                                )}
                                <Link href="/registration" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full justify-center bg-earth-green text-white hover:bg-earth-green/90">Register Now</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    )
}
