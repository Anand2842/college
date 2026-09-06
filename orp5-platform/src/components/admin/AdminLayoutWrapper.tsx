"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white print:min-h-0">
            <div className="print:hidden">
                <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>
            <div className={cn(
                "transition-all duration-300 print:ml-0 print:m-0 print:p-0",
                isCollapsed ? "ml-[4.5rem]" : "ml-64"
            )}>
                <main className="p-4 md:p-8 min-w-0 print:p-0 print:m-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
