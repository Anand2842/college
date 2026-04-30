import { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentInstructionClient from './PaymentInstructionClient';

export const metadata: Metadata = {
    title: 'Complete Payment | ORP-5 Conference',
    description: 'Pay your conference registration fee securely via SBI Collect. Your Ticket ID and payment instructions are provided.',
};

export default function PaymentInstructionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-700"></div>
            </div>
        }>
            <PaymentInstructionClient />
        </Suspense>
    );
}
