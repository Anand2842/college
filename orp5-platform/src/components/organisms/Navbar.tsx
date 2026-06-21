"use client"

import React from "react"
import Link from "next/link"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/lib/utils"

import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

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
            { label: "Organizing Committee", href: "/committees" },
        ]
    },
    {
        label: "Call for Papers",
        href: "/submission",
        children: [
            { label: "Submission Guidelines", href: "/submission-guidelines" },
            { label: "Conference Themes", href: "/themes" },
            { label: "Publications", href: "/publications" },
        ]
    },
    {
        label: "Programme",
        href: "/programme",
        children: [
            { label: "Schedule", href: "/programme" },
            { label: "Speakers", href: "/speakers" },
            { label: "Important Dates", href: "/important-dates" },
        ]
    },
    {
        label: "Awards",
        href: "/awards",
    },
    {
        label: "Sponsorship",
        href: "/sponsorship",
    },
    {
        label: "Venue & Travel",
        href: "/venue",
        children: [
            { label: "Venue Details", href: "/venue" },
            { label: "Accommodation", href: "/accommodation" },
            { label: "How to Reach", href: "/how-to-reach" },
            { label: "About the City", href: "/about/city" },
        ]
    }
];

interface NavbarProps {
    variant?: "default" | "dark" | "transparent";
}

export function Navbar({ variant = "default" }: NavbarProps) {
    const scrollY = useScrollPosition()
    const isScrolled = scrollY > 50

    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isModerator, setIsModerator] = React.useState(false);
    const { openModal } = useRegistrationModal();

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] = React.useState<string | null>(null);

    const toggleMobileSubmenu = (label: string) => {
        setOpenMobileSubmenu(prev => prev === label ? null : label);
    }

    React.useEffect(() => {
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
                    if (profile && profile.role === 'moderator') {
                        setIsModerator(true);
                    }
                }
            } catch (error) {
                console.warn("Auth check suppressed:", error);
            }
        };
        checkAdmin();
    }, []);

    const isTransparentAtTop = variant === "transparent" && !isScrolled;
    const textColorClass = isTransparentAtTop ? "text-white hover:text-white/80" : "text-charcoal hover:text-earth-green";
    const logoClass = "h-12 w-auto object-contain transition-all duration-300";

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 w-full z-50 transition-all duration-300 flex flex-col",
                    isMobileMenuOpen || isScrolled
                        ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
                        : variant === "transparent"
                            ? "bg-transparent border-b border-transparent"
                            : "bg-white border-b border-gray-100"
                )}
            >
                {/* 1. Top Utility Bar (IEEE Style) */}
                <div 
                    className={cn(
                        "hidden lg:flex w-full bg-[#123125] text-white px-4 lg:px-8 items-center justify-between transition-all duration-500 overflow-hidden",
                        isScrolled ? "h-0 opacity-0" : "h-10 opacity-100"
                    )}
                >
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-white/70">Abstract Submission Deadline:</span>
                        <span className="text-rice-gold">30 June 2026</span>
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-white/70">
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        
                        {isLoggedIn ? (
                            <div className="flex items-center gap-6">
                                <Link href={isModerator ? "/moderator/dashboard" : "/dashboard"} className="text-rice-gold hover:text-white transition-colors flex items-center gap-1">
                                    {isModerator ? "Reviewer Portal" : "Dashboard"}
                                    <ArrowRight size={12} />
                                </Link>
                                <form action="/auth/signout" method="post" className="m-0 p-0 flex">
                                    <button type="submit" className="text-white/70 hover:text-white transition-colors font-bold uppercase tracking-widest text-[11px]">
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                        )}
                    </div>
                </div>

                {/* 2. Main Navigation Bar */}
                <div className={cn("container mx-auto px-4 lg:px-8 flex items-center justify-between relative z-50 transition-all duration-300", isScrolled ? "py-3" : "py-4")}>
                    
                    {/* Logo (Left) */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mr-8 min-w-fit">
                        <img
                            src="/orp5-logo.png"
                            alt="ORP-5 Logo"
                            className={cn(logoClass, isScrolled ? "h-10" : "h-12")}
                        />
                    </Link>

                    {/* Main Links (Center) */}
                    <div className="hidden xl:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const isAwards = item.label === "Awards";
                            const awardsColor = isTransparentAtTop ? "text-rice-gold hover:text-white drop-shadow-md" : "text-earth-green hover:text-earth-green/80 font-bold";

                            return item.children ? (
                                <div key={item.label} className="relative group py-2">
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-1 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap",
                                            isAwards ? awardsColor : textColorClass
                                        )}
                                    >
                                        {item.label}
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-70" />
                                    </Link>
                                    {/* Glassmorphism Dropdown Menu */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3">
                                        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 overflow-hidden py-3">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="flex items-center px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-earth-green/5 hover:text-earth-green transition-colors"
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
                                        "text-sm font-semibold transition-colors whitespace-nowrap",
                                        isAwards ? awardsColor : textColorClass
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop CTAs (Right) */}
                    <div className="hidden xl:flex items-center gap-4">
                        <Link href="/submission">
                            <Button
                                variant="outline"
                                className={cn(
                                    "font-bold text-xs uppercase tracking-wider px-6 transition-colors border-2",
                                    isTransparentAtTop
                                        ? "border-white/50 text-white hover:bg-white hover:text-earth-green"
                                        : "border-earth-green text-earth-green hover:bg-earth-green hover:text-white"
                                )}
                            >
                                Submit Abstract
                            </Button>
                        </Link>
                        <Button
                            variant="default"
                            className="bg-rice-gold hover:bg-rice-gold-dark text-earth-green font-bold text-xs uppercase tracking-wider px-6 border-none shadow-md"
                            onClick={openModal}
                        >
                            Register Now
                        </Button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-4 xl:hidden">
                        {isScrolled && (
                            <Button
                                className="bg-rice-gold hover:bg-rice-gold-dark text-earth-green font-bold text-xs uppercase tracking-wider px-4 py-2"
                                onClick={openModal}
                            >
                                Register
                            </Button>
                        )}
                        <button
                            className={cn("p-2 transition-colors rounded-md", isTransparentAtTop ? "text-white hover:bg-white/10" : "text-black bg-gray-50 hover:bg-gray-100")}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 px-6 xl:hidden overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className="flex flex-col space-y-6 pb-20">
                        {/* Urgent Alert on Mobile */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1 shrink-0"></span>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Important Deadline</p>
                                <p className="text-sm font-medium text-red-900">Abstract Submission closes 30 June 2026</p>
                            </div>
                        </div>

                        {navItems.map((item) => (
                            <div key={item.label} className="border-b border-gray-100 pb-4 last:border-0">
                                {item.children ? (
                                    <>
                                        <button
                                            className="flex w-full items-center justify-between font-bold text-gray-900 mb-3"
                                            onClick={() => toggleMobileSubmenu(item.label)}
                                        >
                                            <span className="text-lg">{item.label}</span>
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
                                                        className="text-gray-600 hover:text-earth-green py-2 text-base font-medium"
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
                                        className={cn("font-bold block text-lg", item.label === "Awards" ? "text-earth-green" : "text-gray-900")}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}

                        <div className="border-b border-gray-100 pb-4">
                            <Link href="/blog" className="font-bold text-gray-900 block text-lg mb-4" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                            <Link href="/contact" className="font-bold text-gray-900 block text-lg mb-4" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                            
                            {isLoggedIn ? (
                                <Link href={isModerator ? "/moderator/dashboard" : "/dashboard"} className="font-bold text-gray-900 block text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                    {isModerator ? "Reviewer Portal" : "Dashboard"}
                                </Link>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-4 mt-8">
                            <Link href="/submission" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center h-12 text-earth-green border-earth-green font-bold">Submit Abstract</Button>
                            </Link>
                            <Button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    openModal();
                                }}
                                className="w-full justify-center h-12 bg-earth-green text-white hover:bg-earth-green/90 font-bold"
                            >
                                Register Now
                            </Button>
                            
                            {isLoggedIn ? (
                                <form action="/auth/signout" method="post" className="w-full mt-4">
                                    <Button variant="ghost" className="w-full justify-center text-red-600 hover:bg-red-50" type="submit">
                                        Sign Out
                                    </Button>
                                </form>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-center text-gray-500 mt-4">Login to Dashboard</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
