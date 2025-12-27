"use client";

import { RegistrationModalProvider } from "@/contexts/RegistrationModalContext";
import { RegistrationModal } from "@/components/organisms/RegistrationModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <RegistrationModalProvider>
            {children}
            <RegistrationModal />
        </RegistrationModalProvider>
    );
}
