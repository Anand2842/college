"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut, Mail, Newspaper, MessageCircle, Scan, ClipboardList, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: ClipboardList, label: "Registrations", href: "/admin/registrations" },
    { icon: Inbox, label: "Submissions", href: "/admin/submissions" },
    { icon: Scan, label: "Scan Tickets", href: "/admin/scan" },
    { icon: MessageCircle, label: "Inquiries", href: "/admin/inquiries" },
    { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
    { icon: Newspaper, label: "Blog & News", href: "/admin/blog" },
    { icon: FileText, label: "Pages", href: "/admin/pages" }, // Parent for sub-pages
    { icon: Users, label: "Manage Users", href: "/admin/users" }, // New User Management
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ isCollapsed = false, setIsCollapsed }: { isCollapsed?: boolean; setIsCollapsed?: (val: boolean) => void }) {
    const pathname = usePathname() || '';

    return (
        <div className={cn("bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300", isCollapsed ? "w-[4.5rem]" : "w-64")}>
            <div className={cn("p-4 border-b border-gray-200 flex items-center h-[73px]", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 bg-earth-green text-white rounded-md flex items-center justify-center font-serif font-bold">O</div>
                        <span className="font-bold text-lg text-charcoal truncate">ORP-5 Admin</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 shrink-0 bg-earth-green text-white rounded-md flex items-center justify-center font-serif font-bold">O</div>
                )}
                {setIsCollapsed && (
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)} 
                        className={cn("p-1.5 rounded-md hover:bg-gray-100 text-gray-500", isCollapsed ? "hidden" : "block")}
                        title="Collapse sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-thin">
                {isCollapsed && setIsCollapsed && (
                    <button 
                        onClick={() => setIsCollapsed(false)} 
                        className="flex items-center justify-center w-full p-2 mb-2 rounded-md hover:bg-gray-100 text-gray-500"
                        title="Expand sidebar"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
                
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center rounded-md text-sm font-medium transition-colors",
                                isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5 gap-3",
                                isActive
                                    ? "bg-earth-green/10 text-earth-green"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={18} className="shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}

                <div className={cn("pt-4 mt-4 border-t border-gray-200", isCollapsed ? "px-1" : "")}>
                    {!isCollapsed && <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pages</div>}
                    
                    {[
                        { href: "/admin/pages/home", label: "Homepage" },
                        { href: "/admin/pages/themes", label: "Themes Page" },
                        { href: "/admin/pages/venue", label: "Venue Page" },
                        { href: "/admin/pages/registration", label: "Registration" },
                        { href: "/admin/pages/about", label: "About Page" },
                        { href: "/admin/pages/committees", label: "Committees" },
                        { href: "/admin/pages/awards", label: "Awards" },
                        { href: "/admin/pages/programme", label: "Programme" },
                        { href: "/admin/pages/how-to-reach", label: "How to Reach" },
                        { href: "/admin/pages/accommodation", label: "Accommodation" },
                        { href: "/admin/pages/receipt", label: "Receipt / Success" },
                        { href: "/admin/pages/important-dates", label: "Important Dates" },
                        { href: "/admin/pages/submission-guidelines", label: "Guidelines" },
                        { href: "/admin/pages/submission", label: "Submission Form" },
                        { href: "/admin/pages/sponsorship", label: "Sponsorship" },
                        { href: "/admin/pages/gallery", label: "Gallery" },
                        { href: "/admin/pages/contact", label: "Contact Us" },
                        { href: "/admin/pages/brochure", label: "Brochure" },
                        { href: "/admin/pages/speakers", label: "Speakers" },
                    ].map((page) => (
                        <Link 
                            key={page.href}
                            href={page.href} 
                            title={isCollapsed ? page.label : undefined}
                            className={cn(
                                "flex items-center rounded-md text-sm transition-colors", 
                                isCollapsed ? "justify-center p-2.5 mb-1" : "px-3 py-2 gap-3",
                                pathname === page.href ? "bg-rice-gold/10 text-yellow-700" : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-earth-green/50" /> 
                            {!isCollapsed && <span className="truncate">{page.label}</span>}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className={cn("p-4 border-t border-gray-200", isCollapsed ? "flex justify-center p-2" : "")}>
                <button
                    onClick={async () => {
                        const { createClient } = await import("@/utils/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                    }}
                    title={isCollapsed ? "Sign Out" : undefined}
                    className={cn(
                        "flex items-center text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors",
                        isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2 w-full"
                    )}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
