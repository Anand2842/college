"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Edit, LayoutDashboard, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

// Map public routes to their admin editor counterparts
const routeMapping: Record<string, string> = {
    "/": "/admin/pages/home",
    "/about": "/admin/pages/about",
    "/themes": "/admin/pages/themes",
    "/committees": "/admin/pages/committees",
    "/speakers": "/admin/pages/speakers",
    "/awards": "/admin/pages/awards",
    "/brochure": "/admin/pages/brochure",
    "/exhibition": "/admin/pages/exhibition",
    "/sponsorship": "/admin/pages/sponsorship",
    "/programme": "/admin/pages/programme",
    "/submission-guidelines": "/admin/pages/submission-guidelines",
    "/registration": "/admin/pages/registration",
    "/important-dates": "/admin/pages/important-dates",
    "/submission": "/admin/pages/submission",
    "/publications": "/admin/pages/submission", // assuming related
    "/venue": "/admin/pages/venue",
    "/about/city": "/admin/pages/city",
    "/how-to-reach": "/admin/pages/how-to-reach",
    "/accommodation": "/admin/pages/accommodation",
    "/contact": "/admin/pages/contact",
};

export function AdminToolbar() {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if user is admin client-side
        const checkAdmin = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
                    setIsAdmin(true);
                }
            }
        };
        checkAdmin();
    }, []);

    if (!isAdmin || !isVisible) return null;

    // Do not show on admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return null;
    }

    const editUrl = routeMapping[pathname];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-[#123125] text-white p-2 rounded-full shadow-2xl border border-[#DFC074]/30 flex items-center gap-2 pr-4 pl-3">
                <div className="bg-[#DFC074] text-[#123125] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ADMIN MODE
                </div>

                <div className="h-4 w-px bg-white/20 mx-1" />

                <Link href="/admin/dashboard">
                    <Button variant="ghost" className="h-8 px-3 text-xs text-white hover:bg-white/10 hover:text-white rounded-full flex items-center gap-1.5">
                        <LayoutDashboard size={14} />
                        Dashboard
                    </Button>
                </Link>

                {editUrl && (
                    <Link href={editUrl}>
                        <Button className="h-8 px-4 text-xs bg-[#DFC074] text-[#123125] hover:bg-[#B89C50] rounded-full flex items-center gap-1.5 font-bold shadow-sm">
                            <Edit size={14} />
                            Edit This Page
                        </Button>
                    </Link>
                )}

                {!editUrl && (
                    <span className="text-xs text-white/50 italic px-2">
                        No editor for this page
                    </span>
                )}

                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-2 p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
