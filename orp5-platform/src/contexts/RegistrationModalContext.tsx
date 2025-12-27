"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RegistrationModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const RegistrationModalContext = createContext<RegistrationModalContextType | undefined>(undefined);

export function RegistrationModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <RegistrationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </RegistrationModalContext.Provider>
    );
}

export function useRegistrationModal() {
    const context = useContext(RegistrationModalContext);
    if (context === undefined) {
        throw new Error("useRegistrationModal must be used within a RegistrationModalProvider");
    }
    return context;
}
