"use client";

import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function RegistrationModal() {
    const { isOpen, openModal, closeModal } = useRegistrationModal();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Check for ?register=true
    useEffect(() => {
        if (searchParams.get("register") === "true") {
            openModal();
            // Optional: Clean up URL without refreshing
            const params = new URLSearchParams(searchParams);
            params.delete("register");
            // If we are on home with just ?register=true, we can replace state
            // But let's just leave it or replace it cleanly.
            // router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            // Actually, leaving it might be fine, but cleaning it is better UX.
            // We can just replace with pathname if no other params.
            router.replace(pathname, { scroll: false });
        }
    }, [searchParams, openModal, pathname, router]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeModal]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-black/5 rounded-full text-gray-500 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-1">
                            {/* 
                    RegistrationForm expects a 'selectedCategory' prop.
                    For the general popup, we can pass an empty string to let the user choose.
                 */}
                            <RegistrationForm selectedCategory="" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
