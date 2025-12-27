"use client";

import { Suspense } from "react";
import { RegistrationModalProvider } from "@/contexts/RegistrationModalContext";
import { RegistrationModal } from "@/components/organisms/RegistrationModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <RegistrationModalProvider>
            {children}
            <Suspense fallback={null}>
                <RegistrationModal />
            </Suspense>
        </RegistrationModalProvider>
    );
}
