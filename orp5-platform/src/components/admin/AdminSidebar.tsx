"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut, Mail, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
    { icon: Newspaper, label: "Blog & News", href: "/admin/blog" },
    { icon: FileText, label: "Pages", href: "/admin/pages" }, // Parent for sub-pages
    { icon: Users, label: "Manage Users", href: "/admin/users" }, // New User Management
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-earth-green text-white rounded-md flex items-center justify-center font-serif font-bold">O</div>
                <span className="font-bold text-lg text-charcoal">ORP-5 Admin</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-earth-green/10 text-earth-green"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pages</div>
                    <Link href="/admin/pages/home" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/home" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Homepage
                    </Link>
                    <Link href="/admin/pages/themes" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/themes" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Themes Page
                    </Link>
                    <Link href="/admin/pages/venue" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/venue" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Venue Page
                    </Link>
                    <Link href="/admin/pages/registration" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/registration" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Registration
                    </Link>
                    <Link href="/admin/pages/about" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/about" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> About Page
                    </Link>
                    <Link href="/admin/pages/committees" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/committees" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Committees
                    </Link>
                    <Link href="/admin/pages/awards" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/awards" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Awards
                    </Link>
                    <Link href="/admin/pages/programme" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/programme" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Programme
                    </Link>
                    <Link href="/admin/pages/how-to-reach" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/how-to-reach" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> How to Reach
                    </Link>
                    <Link href="/admin/pages/accommodation" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/accommodation" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Accommodation
                    </Link>
                    <Link href="/admin/pages/receipt" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/receipt" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Receipt / Success
                    </Link>
                    <Link href="/admin/pages/important-dates" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/important-dates" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Important Dates
                    </Link>
                    <Link href="/admin/pages/submission-guidelines" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/submission-guidelines" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Guidelines
                    </Link>
                    <Link href="/admin/pages/submission" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/submission" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Submission Form
                    </Link>
                    <Link href="/admin/pages/exhibition" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/exhibition" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Exhibition
                    </Link>
                    <Link href="/admin/pages/sponsorship" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/sponsorship" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Sponsorship
                    </Link>
                    <Link href="/admin/pages/gallery" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/gallery" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Gallery
                    </Link>
                    <Link href="/admin/pages/contact" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/contact" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Contact Us
                    </Link>
                    <Link href="/admin/pages/brochure" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/brochure" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Brochure
                    </Link>
                    <Link href="/admin/pages/speakers" className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", pathname === "/admin/pages/speakers" ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" /> Speakers
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={async () => {
                        const { createClient } = await import("@/utils/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 w-full rounded-md transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
