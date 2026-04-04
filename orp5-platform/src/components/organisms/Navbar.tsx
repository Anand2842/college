"use client"

import React from "react"
import Link from "next/link"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/lib/utils"
// import { Logo } from "@/components/atoms/Logo" // Placeholder

import { ChevronDown, Menu, X } from "lucide-react";
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
            { label: "Conference Themes", href: "/themes" },
            { label: "Organizing Committee", href: "/committees" },
            { label: "Speakers", href: "/speakers" },
            { label: "Awards & Prizes", href: "/awards" },
        ]
    },
    {
        label: "Blog",
        href: "/blog",
    },
    {
        label: "Sponsorship",
        href: "/sponsorship",
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

    // Helper for text color
    const isTransparentAtTop = variant === "transparent" && !isScrolled;
    // If transparent at top, use White text. Otherwise (scrolled or default), use Charcoal.
    const textColorClass = isTransparentAtTop ? "text-white hover:text-white/80" : "text-charcoal hover:text-rice-gold";
    const logoClass = "h-12 w-auto object-contain transition-all duration-300";

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                // Background Logic
                isScrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-100 py-3"
                    : variant === "transparent"
                        ? "bg-transparent border-transparent py-6"
                        : "bg-white border-gray-100 py-4"
            )}
        >
            <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between relative z-50">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mr-4 lg:mr-8 xl:mr-16 min-w-fit">
                    <img
                        src="/orp5-logo.png"
                        alt="ORP-5 Logo"
                        className={cn(logoClass, isScrolled ? "h-10" : "h-12")}
                    />
                </Link>

                <div className="hidden xl:flex items-center space-x-4 xl:space-x-8">
                    {navItems.map((item) => {
                        // Hide Dashboard if not logged in
                        if (item.label === "Dashboard" && !isLoggedIn) return null;

                        // Customize Dashboard label/link for Moderators
                        let label = item.label;
                        let href = item.href;

                        if (item.label === "Dashboard" && isModerator) {
                            label = "Reviewer Portal";
                            href = "/moderator/dashboard";
                        }

                        return item.children ? (
                            <div key={item.label} className="relative group">
                                <Link
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-0.5 text-xs xl:text-sm font-medium transition-colors focus:outline-none whitespace-nowrap",
                                        textColorClass
                                    )}
                                >
                                    {label}
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
                                key={label}
                                href={href}
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    textColorClass
                                )}
                            >
                                {label}
                            </Link>
                        )
                    })}

                    {/* Desktop Login/Logout */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <form action="/auth/signout" method="post">
                                <Button
                                    variant="outline"
                                    className="border-charcoal/20 text-charcoal hover:bg-gray-50"
                                    type="submit"
                                >
                                    Sign Out
                                </Button>
                            </form>
                            <Button
                                variant="default"
                                className="font-bold border-charcoal bg-white text-earth-green hover:bg-earth-green hover:text-white border border-earth-green/20"
                                onClick={openModal}
                            >
                                Register
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="ghost" className="text-charcoal hover:text-earth-green font-medium">
                                    Login
                                </Button>
                            </Link>
                            <Button
                                variant="default"
                                className="font-bold border-charcoal bg-white text-earth-green hover:bg-earth-green hover:text-white border border-earth-green/20"
                                onClick={openModal}
                            >
                                Register
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="xl:hidden p-2 transition-colors text-black bg-gray-50 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-white pt-24 px-6 xl:hidden overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="flex flex-col space-y-6 pb-20">
                            {navItems.map((item) => {
                                if (item.label === "Dashboard" && !isLoggedIn) return null;
                                return (
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
                                )
                            })}

                            <div className="flex flex-col gap-4 mt-8">
                                {isLoggedIn ? (
                                    <form action="/auth/signout" method="post" className="w-full">
                                        <Button variant="outline" className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" type="submit">
                                            Sign Out
                                        </Button>
                                    </form>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center">Login</Button>
                                    </Link>
                                )}
                                <Button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openModal();
                                    }}
                                    className="w-full justify-center bg-earth-green text-white hover:bg-earth-green/90"
                                >
                                    Register Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    )
}
