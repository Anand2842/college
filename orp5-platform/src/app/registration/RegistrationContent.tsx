"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegistrationContent() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to Home with 'register=true' query param to trigger the Modal
        router.replace("/?register=true");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin text-earth-green" size={40} />
            <p className="text-gray-500 font-serif">Opening Registration...</p>
        </div>
    );
}
