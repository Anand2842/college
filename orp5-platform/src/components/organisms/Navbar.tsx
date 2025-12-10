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
            { label: "Brochure", href: "/brochure" },
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
            { label: "Programme Schedule", href: "/programme" },
            { label: "Participation Guidelines", href: "/submission-guidelines" },
        ]
    },
    {
        label: "Registration",
        href: "/registration",
        children: [
            { label: "Registration Page", href: "/registration" },
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

    React.useEffect(() => {
        // Check if user is admin client-side
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
                // Silently fail auth check on storage errors (e.g. strict privacy settings)
                console.warn("Auth check suppressed:", error);
            }
        };
        checkAdmin();
    }, []);

    // text color condition
    const isDarkText = variant === "dark" || isScrolled;

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-earth-green/95 backdrop-blur-md py-3 shadow-md"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {/* Placeholder for Logo */}
                    <div className={cn("font-serif font-bold text-xl tracking-wide", isDarkText ? "text-charcoal" : "text-white")}>
                        ORP-5
                    </div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        item.children ? (
                            <div key={item.label} className="relative group">
                                <Link href={item.href} className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-rice-gold focus:outline-none",
                                    isDarkText ? "text-charcoal" : "text-white/90"
                                )}>
                                    {item.label}
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
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
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-rice-gold",
                                    isDarkText ? "text-charcoal" : "text-white/90"
                                )}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}

                    {/* Admin Dashboard Link */}
                    {isAdmin && (
                        <Link href="/admin/dashboard">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "font-bold text-sm",
                                    !isScrolled && variant === "default" && "text-white hover:bg-white/10 hover:text-white",
                                    !isScrolled && variant === "dark" && "text-charcoal hover:bg-black/5 hover:text-charcoal",
                                    isScrolled && "text-white hover:bg-white/20"
                                )}
                            >
                                Dashboard
                            </Button>
                        </Link>
                    )}

                    {/* Login Link for Non-Authenticated Users */}
                    {!isLoggedIn && (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "font-bold text-sm",
                                    !isScrolled && variant === "default" && "text-white hover:bg-white/10 hover:text-white",
                                    !isScrolled && variant === "dark" && "text-charcoal hover:bg-black/5 hover:text-charcoal",
                                    isScrolled && "text-white hover:bg-white/20"
                                )}
                            >
                                Login
                            </Button>
                        </Link>
                    )}

                    <Link href="/registration">
                        <Button
                            variant={isScrolled ? "default" : "outline"}
                            className={cn(
                                "font-bold",
                                !isScrolled && variant === "default" && "border-white text-white hover:bg-white hover:text-earth-green",
                                !isScrolled && variant === "dark" && "border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                            )}
                        >
                            Register
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn("md:hidden p-2 transition-colors", isDarkText ? "text-charcoal" : "text-white")}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="flex flex-col space-y-6 pb-20">
                        {navItems.map((item) => (
                            <div key={item.label} className="border-b border-gray-100 pb-4 last:border-0">
                                {item.children ? (
                                    <>
                                        <div className="font-bold text-earth-green mb-3">{item.label}</div>
                                        <div className="flex flex-col space-y-3 pl-4">
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
            )}
        </header>
    )
}
